export * from './DirectCall';
export * from './Media';
export * from './Module';
export * from './Platform';
export * from './User';

// type Enumerations =
//   | AudioDeviceType
//   | VideoDevicePosition
//   | RecordingStatus
//   | RecordingType
//   | DirectCallEndResult
//   | DirectCallUserRole
//   | RouteChangeReason;
type PlatformPrefix = 'android' | 'ios';

export type AsNativeInterface<T> = T extends
  | boolean
  | number
  | string
  | null
  | undefined
  | ((...p: any[]) => any)
  | unknown[]
  ? T
  : {
      [key in keyof T as key extends `${PlatformPrefix}_${infer Rest}` ? Rest : key]: AsNativeInterface<T[key]>;
      // T[key] extends
      //     | Enumerations
      //     | Array<Enumerations>
      //     ? T[key]
      //     : AsNativeInterface<T[key]>;
    };

export type Values<T extends { [key: string]: any }> = T[keyof T];
