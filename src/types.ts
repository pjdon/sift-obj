import { All } from './sift';

export type Filter = typeof All | string[] | ObjectFilter | KeyMatcher;

export type ObjectFilter = {
  [key: string]: Filter
};

export type KeyMatcher = { pattern: RegExp, filters: Filter[] };