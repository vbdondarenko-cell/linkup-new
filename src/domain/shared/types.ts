export type EntityId = string;

export type Timestamp = Date;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type EntityStatus = 'active' | 'inactive' | 'deleted' | 'archived';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
} as const;

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-ddTHH:mm:ss.SSSZ';
