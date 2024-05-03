import { ObjectFilter, KeyMatcher, Filter } from './types';
import { tryAsKeyMatcher, tryAsObject, tryAsStringArray } from './util';

export const All: unique symbol = Symbol('All');

export function match(
  pattern: RegExp,
  ...filters: Filter[]
): KeyMatcher {
  return { pattern, filters };
}

function isAnyFilterAll(...filters: Filter[]): boolean {
  return filters.some(f => f === All);
}

function siftKeyMatcher<TSource extends Object>(
  source: TSource,
  matcher: KeyMatcher
): Partial<TSource> {
  const result = {} as any;

  for (const key in source) {

    if (matcher.pattern.exec(key)) {
      // shortcut out if any of the filters are All
      // this way we don't have to ensure that source[key] is an Object for filter
      if (isAnyFilterAll(...matcher.filters)) {
        result[key] = source[key];
        continue;
      }

      const [isValueObject, objectValue] = tryAsObject(source[key]);

      if (isValueObject) {
        result[key] = sift(objectValue, ...matcher.filters);
      }
    }
  }

  return result;
}

function siftObject<TSource extends Object>(
  source: TSource,
  filter: ObjectFilter
): Partial<TSource> {
  /* Returns a copy of `source` with the keys are in hierarchies expressed by `filter`*/

  const result = {} as any;

  for (const filterKey in filter) {
    const filterValue = filter[filterKey];

    // shortcut out if any of the filters are All
    // this way we don't have to ensure that source[key] is an Object for filter
    if (isAnyFilterAll(filterValue)) {
      result[filterKey] = (source as any)[filterKey];
      continue;
    }
    
    const [isValueObject, objectValue] = tryAsObject((source as any)[filterKey]);

    if (isValueObject) {
      result[filterKey] = sift(objectValue, filterValue);
    }
  }

  return result;
}


function siftKeyNames<TSource extends Object>(
  source: TSource,
  filter: string[]
): Partial<TSource> {
  /* Returns a copy of `source` with only the keys that are in `filter` */

  const result = {} as any;

  for (const filterKey of filter) {
    if (filterKey in source) {
      result[filterKey] = (source as any)[filterKey];
    }
  }

  return result as Partial<TSource>;
}

export function sift<TSource extends object>(
  source: TSource,
  ...filters: Filter[]
): Partial<TSource> {
  /* Returns a copy of `source` with all the keys hierarchies that are present in any filter of `filters` */

  const result = {};

  // if any of the filter is 'All' we don't have to bother with other filters
  // so we return a copy of the source
  if (isAnyFilterAll(...filters)) {
    return { ...source };
  }

  for (const filter of filters) {

    const [isStringArray, stringArrayFilter] = tryAsStringArray(filter);

    if (isStringArray) {
      Object.assign(result, siftKeyNames(source, stringArrayFilter));
      continue;
    }

    const [isKeyMatcher, keyMatcherFilter] = tryAsKeyMatcher(filter);

    if (isKeyMatcher) {
      Object.assign(result, siftKeyMatcher(source, keyMatcherFilter));
      continue;
    }

    const [isObject, objectFilterValue] = tryAsObject(filter);

    if (isObject) {
      Object.assign(result, siftObject(source, objectFilterValue as ObjectFilter));
      continue;
    }

  }

  return result;
}