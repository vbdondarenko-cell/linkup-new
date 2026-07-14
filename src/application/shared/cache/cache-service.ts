import { EntityId } from '../../../domain/shared/types';

export type CacheKey = string;
export type CacheValue = unknown;

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // For cache invalidation
}

export interface ICacheService {
  get<T>(key: CacheKey): Promise<T | null>;
  set<T>(key: CacheKey, value: T, options?: CacheOptions): Promise<void>;
  delete(key: CacheKey): Promise<void>;
  deleteByTags(tags: string[]): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryCacheService implements ICacheService {
  private cache = new Map<CacheKey, { value: unknown; expiresAt: number | null }>();
  private tagsIndex = new Map<string, Set<CacheKey>>();

  async get<T>(key: CacheKey): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: CacheKey, value: T, options?: CacheOptions): Promise<void> {
    const expiresAt = options?.ttl
      ? Date.now() + options.ttl * 1000
      : null;

    this.cache.set(key, { value, expiresAt });

    if (options?.tags) {
      for (const tag of options.tags) {
        if (!this.tagsIndex.has(tag)) {
          this.tagsIndex.set(tag, new Set());
        }
        this.tagsIndex.get(tag)!.add(key);
      }
    }
  }

  async delete(key: CacheKey): Promise<void> {
    this.cache.delete(key);
  }

  async deleteByTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      const keys = this.tagsIndex.get(tag);
      if (keys) {
        for (const key of keys) {
          this.cache.delete(key);
        }
        this.tagsIndex.delete(tag);
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.tagsIndex.clear();
  }
}

export class CacheKeys {
  static profile(userId: EntityId): string {
    return `profile:${userId}`;
  }

  static event(eventId: EntityId): string {
    return `event:${eventId}`;
  }

  static eventsNearby(latitude: number, longitude: number, radius: number): string {
    return `events:nearby:${latitude.toFixed(2)}:${longitude.toFixed(2)}:${radius}`;
  }

  static recommendations(userId: EntityId): string {
    return `recommendations:${userId}`;
  }

  static search(query: string): string {
    return `search:${query}`;
  }

  static userSettings(userId: EntityId): string {
    return `settings:${userId}`;
  }

  static staticData(key: string): string {
    return `static:${key}`;
  }

  static tags: {
    profile: string;
    event: string;
    recommendations: string;
    static: string;
  } = {
    profile: 'profile',
    event: 'event',
    recommendations: 'recommendations',
    static: 'static',
  };
}
