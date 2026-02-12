//
//  RNSBScreenSharingServiceConfig.swift
//  sendbird-calls-react-native
//
//  Copyright © 2024 Sendbird. All rights reserved.
//

import Foundation

@objc public class RNSBScreenSharingServiceConfig: NSObject {
    /// Set to enable Broadcast Extension mode.
    /// If nil, uses in-app RPScreenRecorder capture.
    @objc public static var appGroupIdentifier: String?

    /// Bundle identifier of the Broadcast Upload Extension target.
    /// Required when appGroupIdentifier is set.
    @objc public static var extensionBundleIdentifier: String?
}
