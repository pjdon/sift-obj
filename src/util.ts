import { KeyMatcher } from './types';

export type tryAsTypeFunction<T> = (value: any) => [true, T] | [false, undefined];

export const tryAsString: tryAsTypeFunction<string> = (value: any) => {
  if (typeof value === 'string' || value instanceof String) {
    return [true, value as string];
  } else {
    return [false, undefined];
  }
}

export const tryAsArray: tryAsTypeFunction<Array<any>> = (value: any) => {
  if (Array.isArray(value)) {
    return [true, value as Array<any>];
  } else {
    return [false, undefined];
  }
}

export const tryAsStringArray: tryAsTypeFunction<string[]> = (value: any) => {
  if (tryAsArray(value)[0] && value.length > 0 && value.every((v: any) => tryAsString(v)[0])) {
    return [true, value as string[]];
  } else {
    return [false, undefined];
  }
}

export const tryAsObject: tryAsTypeFunction<Object> = (value: any) => {
  if (!tryAsArray(value)[0] && typeof value === 'object' && value !== null) {
    return [true, value as Object];
  } else {
    return [false, undefined];
  }
};

export const tryAsKeyMatcher: tryAsTypeFunction<KeyMatcher> = (value: any) => {
  if (
    value.hasOwnProperty('pattern')
    && value['pattern'] instanceof RegExp
    && value.hasOwnProperty('filters')
    && tryAsArray(value['filters'])[0]
  ) {
    return [true, value as KeyMatcher];
  } else {
    return [false, undefined];
  }
}
