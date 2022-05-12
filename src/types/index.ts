export * from './DirectCall';
export * from './Media';
export * from './Module';
export * from './Platform';
export * from './User';

type PlatformPrefix = 'android' | 'ios';
export type AsNativeInterface<T> = {
  [key in keyof T as key extends `${PlatformPrefix}_${infer T}` ? T : key]: T[key];
};

export type Values<T extends object> = T[keyof T];
