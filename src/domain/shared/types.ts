export type EntityId = string;

export type EntityStatus = 'active' | 'archived' | 'deleted';

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
}

export type AsyncResult<T> = Promise<{
  success: boolean;
  data?: T;
  error?: Error;
}>;
