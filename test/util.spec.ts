import { tryAsString, tryAsArray, tryAsStringArray, tryAsObject } from '../src/util';

describe('tryAsString', () => {
  it('should return true for string values', () => {
    const stringValue = 'hello';
    const [isString, resolvedValue] = tryAsString(stringValue);
    expect(isString).toBe(true);
    if (isString) {
      expect(typeof resolvedValue).toBe('string');
    }
  });

  it('should return false for non-string values', () => {
    const nonStringValue = 123;
    const [isString] = tryAsString(nonStringValue);
    expect(isString).toBe(false);
  });

  it('should return the same string value for valid inputs', () => {
    const stringValue = 'hello';
    const [isString, resolvedValue] = tryAsString(stringValue);
    expect(isString).toBe(true);
    if (isString) {
      expect(resolvedValue).toBe(stringValue);
    }
  });

  it('should return isType false for null and undefined', () => {
    const [isNull] = tryAsString(null);
    const [isUndefined] = tryAsString(undefined);
    expect(isNull).toBe(false);
    expect(isUndefined).toBe(false);
  });

  it('should return isType false for array and object inputs', () => {
    const [isArray] = tryAsString([]);
    const [isObject] = tryAsString({});
    expect(isArray).toBe(false);
    expect(isObject).toBe(false);
  });
});

describe('tryAsArray', () => {
  it('should return true for array values', () => {
    const arrayValue = [1, 2, 3];
    const [isArray, resolvedValue] = tryAsArray(arrayValue);
    expect(isArray).toBe(true);
    if (isArray) {
      expect(Array.isArray(resolvedValue)).toBe(true);
    }
  });

  it('should return false for non-array values', () => {
    const nonArrayValue = 'not an array';
    const [isArray] = tryAsArray(nonArrayValue);
    expect(isArray).toBe(false);
  });

  it('should return the same array value for valid inputs', () => {
    const arrayValue = [1, 'two', true];
    const [isArray, resolvedValue] = tryAsArray(arrayValue);
    expect(isArray).toBe(true);
    if (isArray) {
      expect(resolvedValue).toEqual(arrayValue);
    }
  });

  it('should return isType false for null and undefined', () => {
    const [isNull] = tryAsArray(null);
    const [isUndefined] = tryAsArray(undefined);
    expect(isNull).toBe(false);
    expect(isUndefined).toBe(false);
  });

  it('should return isType false for non-array object inputs', () => {
    const objectValue = { key: 'value' };
    const [isArray] = tryAsArray(objectValue);
    expect(isArray).toBe(false);
  });
});

describe('tryAsStringArray', () => {
  it('should return true for valid string arrays', () => {
    const validStringArray = ['hello', 'world'];
    const [isStringArray, resolvedArray] = tryAsStringArray(validStringArray);
    expect(isStringArray).toBe(true);
    if (isStringArray) {
      expect(resolvedArray).toEqual(validStringArray);
    }
  });

  it('should return false if the input is not an array', () => {
    const nonArrayValue = 'not an array';
    const [isStringArray] = tryAsStringArray(nonArrayValue);
    expect(isStringArray).toBe(false);
  });

  it('should return false if the input array is empty', () => {
    const emptyArray: any[] = [];
    const [isStringArray] = tryAsStringArray(emptyArray);
    expect(isStringArray).toBe(false);
  });

  it('should return false if the input array contains non-string values', () => {
    const mixedArray = ['hello', 123, true];
    const [isStringArray] = tryAsStringArray(mixedArray);
    expect(isStringArray).toBe(false);
  });

  it('should return false if the input array contains null or undefined values', () => {
    const arrayWithNull = ['hello', null, 'world'];
    const arrayWithUndefined = ['hello', undefined, 'world'];
    const [isStringArrayWithNull] = tryAsStringArray(arrayWithNull);
    const [isStringArrayWithUndefined] = tryAsStringArray(arrayWithUndefined);
    expect(isStringArrayWithNull).toBe(false);
    expect(isStringArrayWithUndefined).toBe(false);
  });
});

describe('tryAsObject', () => {
  it('should return true for object values', () => {
    const objectValue = { key: 'value' };
    const [isObject, resolvedValue] = tryAsObject(objectValue);
    expect(isObject).toBe(true);
    if (isObject) {
      expect(typeof resolvedValue).toBe('object');
    }
  });

  it('should return false for non-object values', () => {
    const nonObjectValue = 'not an object';
    const [isObject] = tryAsObject(nonObjectValue);
    expect(isObject).toBe(false);
  });

  it('should return the same object value for valid inputs', () => {
    const objectValue = { key: 'value' };
    const [isObject, resolvedValue] = tryAsObject(objectValue);
    expect(isObject).toBe(true);
    if (isObject) {
      expect(resolvedValue).toEqual(objectValue);
    }
  });

  it('should return false for null input', () => {
    const [isObject] = tryAsObject(null);
    expect(isObject).toBe(false);
  });

  it('should return false for undefined input', () => {
    const [isObject] = tryAsObject(undefined);
    expect(isObject).toBe(false);
  });

  it('should return false for non-object array input', () => {
    const arrayValue = ['hello', 'world'];
    const [isObject] = tryAsObject(arrayValue);
    expect(isObject).toBe(false);
  });
});
