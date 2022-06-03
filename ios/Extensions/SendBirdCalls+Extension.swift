//
//  SendBirdCalls+Extension.swift
//  RNSendbirdCalls
//
//  Created by Jaesung Lee on 2020/04/13.
//  Copyright © 2020 Sendbird Inc. All rights reserved.
//
// TODO: Extaract to @sendbird/calls-react-native-voip

import UIKit
import SendBirdCalls

extension SendBirdCall {
    /**
     This method uses when,
     - the user makes outgoing calls from native call history("Recents")
     - the provider performs the specified end(decline) or answer call action.
     */
    static func authenticateIfNeed(completionHandler: @escaping (Error?) -> Void) {
        guard SendBirdCall.currentUser == nil else {
            completionHandler(nil)
            return
        }
        
        guard let credential = UserDefaults.standard.credential else { return }
        
        let params = AuthenticateParams(userId: credential.userId, accessToken: credential.accessToken)
        SendBirdCall.authenticate(with: params) { (_, error) in
            completionHandler(error)
        }
    }
}

// MARK: RecordingStatus
extension RecordingStatus {
    var asString: String {
        switch self {
        case .recording:
            return "RECORDING"
        case .none:
            return "NONE"
        @unknown default:
            fatalError()
        }
    }
    init?(fromString: String) {
        switch fromString {
        case "RECORDING":
            self = .recording
        case "NONE":
            self = .none
        default:
            return nil
        }
    }
}


// MARK: VideoDevice.Position
extension VideoDevice.Position {
    var asString: String {
        switch self {
        case .back:
            return "BACK"
        case .front:
            return "FRONT"
        case .unspecified:
            return "UNSPECIFIED"
        @unknown default:
            fatalError()
        }
    }
    
    init?(fromString: String) {
        switch fromString {
        case "BACK":
            self = .back
        case "FRONT":
            self = .front
        default:
            return nil
        }
    }
}

// MARK: DirectCall.UserRole
extension DirectCall.UserRole {
    var asString: String {
        switch self {
        case .callee:
            return "CALLEE"
        case .caller:
            return "CALLER"
        @unknown default:
            fatalError()
        }
    }
    
    init?(fromString: String) {
        switch fromString {
        case "CALLEE":
            self = .callee
        case "CALLER":
            self = .caller
        default:
            return nil
        }
    }
}

// MARK: DirectCallEndResult
extension DirectCallEndResult {
    enum DirectCallEndResultHelper: String {
        case NONE
        case NO_ANSWER
        case CANCELED
        case DECLINED
        case COMPLETED
        case TIMED_OUT
        case CONNECTION_LOST
        case UNKNOWN
        case DIAL_FAILED
        case ACCEPT_FAILED
        case OTHER_DEVICE_ACCEPTED
        
        init(origin: DirectCallEndResult) {
            switch origin {
            case .none:
                self = .NONE
            case .noAnswer:
                self = .NO_ANSWER
            case .canceled:
                self = .CANCELED
            case .declined:
                self = .DECLINED
            case .completed:
                self = .COMPLETED
            case .timedOut:
                self = .TIMED_OUT
            case .connectionLost:
                self = .CONNECTION_LOST
            case .unknown:
                self = .UNKNOWN
            case .dialFailed:
                self = .DIAL_FAILED
            case .acceptFailed:
                self = .ACCEPT_FAILED
            case .otherDeviceAccepted:
                self = .OTHER_DEVICE_ACCEPTED
            @unknown default:
                self = .UNKNOWN
            }
        }
        
        var asOrigin: DirectCallEndResult {
            switch(self){
            case .NONE:
                return .none
            case .NO_ANSWER:
                return .noAnswer
            case .CANCELED:
                return .canceled
            case .DECLINED:
                return .declined
            case .COMPLETED:
                return .completed
            case .TIMED_OUT:
                return .timedOut
            case .CONNECTION_LOST:
                return .connectionLost
            case .UNKNOWN:
                return .unknown
            case .DIAL_FAILED:
                return .dialFailed
            case .ACCEPT_FAILED:
                return .acceptFailed
            case .OTHER_DEVICE_ACCEPTED:
                return .otherDeviceAccepted
            }
        }
    }
    
    var asString: String {
        return DirectCallEndResultHelper(origin: self).rawValue
    }
    init(fromString: String) {
        self = DirectCallEndResultHelper(rawValue: fromString)?.asOrigin ?? .unknown
    }
}
