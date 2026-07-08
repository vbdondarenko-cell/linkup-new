import '@testing-library/jest-dom';

// Test utilities
export const generateId = (): string => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const createMockUserId = (): string => generateId();
export const createMockEventId = (): string => generateId();
export const createMockProfileId = (): string => generateId();
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock environment
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
};

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithTelegram: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({ data: [], error: null })),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
        order: jest.fn(() => ({ data: [], error: null })),
        limit: jest.fn(() => ({ data: [], error: null })),
        data: [],
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: null, error: null }),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: '' }, error: null }),
        download: jest.fn().mockResolvedValue({ data: null, error: null }),
        remove: jest.fn().mockResolvedValue({ error: null }),
        list: jest.fn().mockResolvedValue({ data: [], error: null }),
      })),
    },
    realtime: {
      channel: jest.fn(() => ({
        on: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockResolvedValue({ data: { channel: {} } }),
        unsubscribe: jest.fn().mockResolvedValue({ data: {} }),
      })),
      removeChannel: jest.fn(),
    },
    rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
  })),
}));

// Mock React Native
jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (obj: Record<string, unknown>) => obj.ios || obj.default },
  StyleSheet: { create: (styles: Record<string, unknown>) => styles },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  TouchableOpacity: 'TouchableOpacity',
  TouchableHighlight: 'TouchableHighlight',
  ScrollView: 'ScrollView',
  FlatList: ({ data }: { data: unknown[] }) => data?.map((_, i) => i),
  Image: 'Image',
  TextInput: 'TextInput',
  Alert: { alert: jest.fn() },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
  useColorScheme: () => 'light',
  useWindowDimensions: () => ({ width: 375, height: 812, scale: 2, fontScale: 1 }),
}));

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Map(),
  })
) as jest.Mock;

// Console error filtering
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Warning:') ||
        message.includes('ReactDOM.render') ||
        message.includes('act(...)'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Cleanup
afterEach(() => {
  jest.clearAllMocks();
});

// Testing utilities
export const mockDate = (date: Date) => {
  jest.useFakeTimers();
  jest.setSystemTime(date);
};

export const unmockDate = () => {
  jest.useRealTimers();
};

export const createMockUser = (overrides = {}) => ({
  id: createMockUserId(),
  telegram_id: '123456789',
  username: 'testuser',
  display_name: 'Test User',
  avatar_url: null,
  trust_score: 50,
  verification_level: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockEvent = (overrides = {}) => ({
  id: createMockEventId(),
  organizer_id: createMockUserId(),
  title: 'Test Event',
  description: 'Test Description',
  category: 'social',
  status: 'draft',
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 3600000).toISOString(),
  capacity: null,
  is_free: true,
  visibility: 'public',
  interests: ['social', 'networking'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockProfile = (overrides = {}) => ({
  id: createMockProfileId(),
  user_id: createMockUserId(),
  bio: 'Test Bio',
  language: 'en',
  location: null,
  radius: 50,
  interests: ['social', 'networking'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});
