/**
 * LinkUp Version Configuration
 * Semantic Versioning: MAJOR.MINOR.PATCH
 * 
 * - MAJOR: Breaking changes
 * - MINOR: New features (backward compatible)
 * - PATCH: Bug fixes (backward compatible)
 */

export const VERSION = {
  MAJOR: 1,
  MINOR: 0,
  PATCH: 0,
  PRERELEASE: undefined as string | undefined,
  BUILD: process.env.BUILD_NUMBER || undefined,
  
  // Human-readable version
  get full(): string {
    const version = `${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
    return this.PRERELEASE ? `${version}-${this.PRERELEASE}` : version;
  },
  
  // Compare versions
  static compare(v1: string, v2: string): number {
    const parts1 = v1.replace('-', '.').split('.').map(Number);
    const parts2 = v2.replace('-', '.').split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }
    return 0;
  },
};

// Application metadata
export const APP_INFO = {
  name: 'LinkUp',
  tagline: 'Discover real-life activities',
  description: 'A premium platform for discovering and organizing real-life activities with friends and communities.',
  version: VERSION.full,
  build: VERSION.BUILD,
  environment: process.env.NODE_ENV || 'development',
  locale: process.env.NEXT_PUBLIC_LOCALE || 'en',
  timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'UTC',
};

// Release channels
export const RELEASE_CHANNEL = {
  current: process.env.RELEASE_CHANNEL || 'stable',
  channels: ['stable', 'beta', 'alpha', 'internal'] as const,
} as const;

// API Versioning
export const API_VERSION = {
  current: 'v1',
  supported: ['v1'] as const,
  deprecated: [] as const,
  
  // Headers
  HEADER_NAME: 'X-API-Version',
  HEADER_MIN_VERSION: 'X-Min-API-Version',
};
