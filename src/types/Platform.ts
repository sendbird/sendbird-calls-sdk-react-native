// NOTE: This file must follow the native-side convention.

/**
 * @platform iOS
 * @description AVAudioSession.RouteChangeReason {@link https://developer.apple.com/documentation/avfaudio/avaudiosession/routechangereason}
 * */
export enum RouteChangeReason {
  /// The reason is unknown.
  unknown = 'unknown',

  /// A new device became available (e.g. headphones have been plugged in).
  newDeviceAvailable = 'newDeviceAvailable',

  /// The old device became unavailable (e.g. headphones have been unplugged).
  oldDeviceUnavailable = 'oldDeviceUnavailable',

  /// The audio category has changed (e.g. AVAudioSessionCategoryPlayback has been changed to
  /// AVAudioSessionCategoryPlayAndRecord).
  categoryChange = 'categoryChange',

  /// The route has been overridden (e.g. category is AVAudioSessionCategoryPlayAndRecord and
  /// the output has been changed from the receiver, which is the default, to the speaker).
  override = 'override',

  /// The device woke from sleep.
  wakeFromSleep = 'wakeFromSleep',

  /// Returned when there is no route for the current category (for instance, the category is
  /// AVAudioSessionCategoryRecord but no input device is available).
  noSuitableRouteForCategory = 'noSuitableRouteForCategory',

  /// Indicates that the set of input and/our output ports has not changed, but some aspect of
  /// their configuration has changed.  For example, a port's selected data source has changed.
  /// (Introduced in iOS 7.0, watchOS 2.0, tvOS 9.0).
  routeConfigurationChange = 'routeConfigurationChange',
}
