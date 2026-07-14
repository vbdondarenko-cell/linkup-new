import { EntityId } from '../../../domain/shared/types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
}

export interface QueryOptions {
  select?: string;
  eq?: Record<string, unknown>;
  neq?: Record<string, unknown>;
  gt?: Record<string, unknown>;
  gte?: Record<string, unknown>;
  lt?: Record<string, unknown>;
  lte?: Record<string, unknown>;
  in?: Record<string, unknown[]>;
  like?: Record<string, string>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  range?: { from: number; to: number };
}

export interface SupabaseResponse<T> {
  data: T | T[] | null;
  error: SupabaseError | null;
  count?: number;
}

export interface SupabaseError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

export interface ISupabaseClient {
  select<T>(table: string, options?: QueryOptions): Promise<SupabaseResponse<T>>;
  insert<T>(table: string, data: Partial<T>): Promise<SupabaseResponse<T>>;
  update<T>(table: string, data: Partial<T>, options?: QueryOptions): Promise<SupabaseResponse<T>>;
  upsert<T>(table: string, data: Partial<T>): Promise<SupabaseResponse<T>>;
  delete(table: string, options?: QueryOptions): Promise<SupabaseResponse<void>>;
  rpc<T>(fn: string, params?: Record<string, unknown>): Promise<SupabaseResponse<T>>;
}

export interface ISupabaseStorage {
  upload(path: string, file: Blob | File, options?: { contentType?: string; upsert?: boolean }): Promise<{ path: string; url: string }>;
  download(path: string): Promise<Blob>;
  delete(path: string): Promise<void>;
  getPublicUrl(path: string): string;
}

export interface ISupabaseRealtime {
  subscribe(channel: string, callback: (payload: unknown) => void): () => void;
  unsubscribe(channel: string): void;
}
