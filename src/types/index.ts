export * from './type.module';
export * from './type.call';
export * from './type.user';

type PlatformPrefix = 'android' | 'ios';
export type AsNativeInterface<T> = {
  [key in keyof T as key extends `${PlatformPrefix}_${infer T}` ? T : key]: T[key];
};
