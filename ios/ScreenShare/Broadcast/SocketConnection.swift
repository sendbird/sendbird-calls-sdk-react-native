//
//  SocketConnection.swift
//  sendbird-calls-react-native
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import Foundation

// MARK: - Frame Header

struct FrameHeader {
    let width: UInt32
    let height: UInt32
    let dataSize: UInt32

    static let size = MemoryLayout<UInt32>.size * 3

    /// Maximum allowed frame data size (~50MB, covers 4K BGRA: 3840*2160*4 ≈ 33MB)
    static let maxFrameDataSize: UInt32 = 50_000_000

    func serialize() -> Data {
        var data = Data(capacity: FrameHeader.size)
        var w = width.bigEndian
        var h = height.bigEndian
        var s = dataSize.bigEndian
        data.append(Data(bytes: &w, count: MemoryLayout<UInt32>.size))
        data.append(Data(bytes: &h, count: MemoryLayout<UInt32>.size))
        data.append(Data(bytes: &s, count: MemoryLayout<UInt32>.size))
        return data
    }

    static func deserialize(from data: Data) -> FrameHeader? {
        guard data.count >= FrameHeader.size else { return nil }
        let width = data.withUnsafeBytes { $0.load(fromByteOffset: 0, as: UInt32.self).bigEndian }
        let height = data.withUnsafeBytes { $0.load(fromByteOffset: 4, as: UInt32.self).bigEndian }
        let dataSize = data.withUnsafeBytes { $0.load(fromByteOffset: 8, as: UInt32.self).bigEndian }
        return FrameHeader(width: width, height: height, dataSize: dataSize)
    }
}

// MARK: - Socket Server (Main App)

class SocketServer {
    private var serverSocket: Int32 = -1
    private var clientSocket: Int32 = -1
    private let socketPath: String
    private var isRunning = false
    private let queue = DispatchQueue(label: "com.sendbird.calls.socket.server", qos: .userInteractive)
    private var acceptSource: DispatchSourceRead?

    var onFrameReceived: ((Data, UInt32, UInt32) -> Void)?
    var onClientConnected: (() -> Void)?
    var onClientDisconnected: (() -> Void)?

    init?(appGroupIdentifier: String) {
        guard let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupIdentifier) else {
            return nil
        }
        self.socketPath = containerURL.appendingPathComponent("sb_ss.sock").path
    }

    deinit {
        stop()
    }

    func start() -> Bool {
        stop()

        // Remove stale socket file
        unlink(socketPath)

        // Validate socket path fits in sockaddr_un.sun_path (max 104 bytes on iOS)
        let maxLen = MemoryLayout<sockaddr_un>.size - MemoryLayout<sa_family_t>.size
        guard socketPath.utf8.count < maxLen else {
            NSLog("[SendbirdCalls] Socket path too long (%d bytes, max %d): %@",
                  socketPath.utf8.count, maxLen - 1, socketPath)
            return false
        }

        serverSocket = socket(AF_UNIX, SOCK_STREAM, 0)
        guard serverSocket >= 0 else { return false }

        var addr = sockaddr_un()
        addr.sun_family = sa_family_t(AF_UNIX)
        let pathBytes = socketPath.utf8CString
        pathBytes.withUnsafeBufferPointer { srcBuf in
            withUnsafeMutableBytes(of: &addr.sun_path) { dstBuf in
                let copyLen = min(srcBuf.count, maxLen - 1)
                dstBuf.copyBytes(from: UnsafeRawBufferPointer(srcBuf).prefix(copyLen))
            }
        }

        let addrLen = socklen_t(MemoryLayout<sa_family_t>.size + socketPath.utf8.count + 1)
        let bindResult = withUnsafePointer(to: &addr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                bind(serverSocket, $0, addrLen)
            }
        }
        guard bindResult == 0 else {
            close(serverSocket)
            serverSocket = -1
            return false
        }

        // Restrict socket file access to owner only
        chmod(socketPath, 0o600)

        guard listen(serverSocket, 1) == 0 else {
            close(serverSocket)
            serverSocket = -1
            return false
        }

        // Set non-blocking for accept
        let flags = fcntl(serverSocket, F_GETFL)
        _ = fcntl(serverSocket, F_SETFL, flags | O_NONBLOCK)

        isRunning = true

        let source = DispatchSource.makeReadSource(fileDescriptor: serverSocket, queue: queue)
        source.setEventHandler { [weak self] in
            self?.acceptClient()
        }
        source.setCancelHandler { [weak self] in
            guard let self = self else { return }
            if self.serverSocket >= 0 {
                close(self.serverSocket)
                self.serverSocket = -1
            }
        }
        source.resume()
        acceptSource = source

        return true
    }

    func stop() {
        isRunning = false

        acceptSource?.cancel()
        acceptSource = nil

        if clientSocket >= 0 {
            close(clientSocket)
            clientSocket = -1
        }
        if serverSocket >= 0 {
            close(serverSocket)
            serverSocket = -1
        }
        unlink(socketPath)
    }

    private func acceptClient() {
        var clientAddr = sockaddr_un()
        var clientAddrLen = socklen_t(MemoryLayout<sockaddr_un>.size)

        let newSocket = withUnsafeMutablePointer(to: &clientAddr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                accept(serverSocket, $0, &clientAddrLen)
            }
        }

        guard newSocket >= 0 else { return }

        // Close previous client if any
        if clientSocket >= 0 {
            close(clientSocket)
        }
        clientSocket = newSocket

        DispatchQueue.main.async { [weak self] in
            self?.onClientConnected?()
        }

        queue.async { [weak self] in
            self?.receiveLoop()
        }
    }

    private func receiveLoop() {
        while isRunning && clientSocket >= 0 {
            // Read header
            guard let headerData = readExact(from: clientSocket, count: FrameHeader.size) else {
                break
            }
            guard let header = FrameHeader.deserialize(from: headerData) else {
                break
            }

            // Validate frame size to prevent excessive memory allocation
            guard header.dataSize > 0 && header.dataSize <= FrameHeader.maxFrameDataSize else {
                break
            }

            // Read pixel data
            guard let pixelData = readExact(from: clientSocket, count: Int(header.dataSize)) else {
                break
            }

            onFrameReceived?(pixelData, header.width, header.height)
        }

        if clientSocket >= 0 {
            close(clientSocket)
            clientSocket = -1
        }

        DispatchQueue.main.async { [weak self] in
            self?.onClientDisconnected?()
        }
    }

    private func readExact(from fd: Int32, count: Int) -> Data? {
        var data = Data(count: count)
        var totalRead = 0
        while totalRead < count {
            let bytesRead = data.withUnsafeMutableBytes { buffer in
                recv(fd, buffer.baseAddress!.advanced(by: totalRead), count - totalRead, 0)
            }
            if bytesRead <= 0 { return nil }
            totalRead += bytesRead
        }
        return data
    }
}

// MARK: - Socket Client (Extension)

class SocketClient {
    private var socket_fd: Int32 = -1
    private let socketPath: String
    private let queue = DispatchQueue(label: "com.sendbird.calls.socket.client", qos: .userInteractive)

    init?(appGroupIdentifier: String) {
        guard let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupIdentifier) else {
            return nil
        }
        self.socketPath = containerURL.appendingPathComponent("sb_ss.sock").path
    }

    func connect() -> Bool {
        socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)
        guard socket_fd >= 0 else { return false }

        var addr = sockaddr_un()
        addr.sun_family = sa_family_t(AF_UNIX)
        let pathBytes = socketPath.utf8CString
        let maxLen = MemoryLayout.size(ofValue: addr.sun_path)
        pathBytes.withUnsafeBufferPointer { srcBuf in
            withUnsafeMutableBytes(of: &addr.sun_path) { dstBuf in
                let copyLen = min(srcBuf.count, maxLen - 1)
                dstBuf.copyBytes(from: UnsafeRawBufferPointer(srcBuf).prefix(copyLen))
            }
        }

        let addrLen = socklen_t(MemoryLayout<sa_family_t>.size + socketPath.utf8.count + 1)
        let result = withUnsafePointer(to: &addr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                Darwin.connect(socket_fd, $0, addrLen)
            }
        }

        guard result == 0 else {
            close(socket_fd)
            socket_fd = -1
            return false
        }

        return true
    }

    func sendFrame(pixelData: Data, width: UInt32, height: UInt32) {
        queue.async { [weak self] in
            guard let self = self, self.socket_fd >= 0 else { return }

            let header = FrameHeader(width: width, height: height, dataSize: UInt32(pixelData.count))
            let headerData = header.serialize()

            self.sendAll(headerData)
            self.sendAll(pixelData)
        }
    }

    func disconnect() {
        if socket_fd >= 0 {
            close(socket_fd)
            socket_fd = -1
        }
    }

    private func sendAll(_ data: Data) {
        var totalSent = 0
        let count = data.count
        while totalSent < count {
            let bytesSent = data.withUnsafeBytes { buffer in
                send(socket_fd, buffer.baseAddress!.advanced(by: totalSent), count - totalSent, 0)
            }
            if bytesSent <= 0 { return }
            totalSent += bytesSent
        }
    }
}
