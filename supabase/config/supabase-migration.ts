// ==============================================
// LinkUp Supabase Migration Configuration
// ==============================================

/**
 * Migration naming convention: YYYYMMDDHHMMSS_description
 * Example: 20260708093000_create_users_table.sql
 */

// Migration files should be in supabase/migrations/

/**
 * Example migration structure:
 * 
 * -- Migration: Create users table
 * -- Created: 2026-07-08 09:30:00
 * 
 * CREATE TABLE public.users (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   telegram_id VARCHAR(255) UNIQUE NOT NULL,
 *   username VARCHAR(255),
 *   display_name VARCHAR(255),
 *   avatar_url TEXT,
 *   trust_score INTEGER DEFAULT 50,
 *   verification_level INTEGER DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Indexes
 * CREATE INDEX idx_users_telegram_id ON public.users(telegram_id);
 * CREATE INDEX idx_users_trust_score ON public.users(trust_score);
 * 
 * -- RLS Policies
 * ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Users can view own profile"
 *   ON public.users FOR SELECT
 *   USING (auth.uid() = id);
 * 
 * CREATE POLICY "Users can update own profile"
 *   ON public.users FOR UPDATE
 *   USING (auth.uid() = id);
 */

export const MIGRATION_CONFIG = {
  // Migration settings
  maxMigrations: 100,
  migrationTable: '_prisma_migrations',
  
  // Transaction settings
  transactional: true,
  batchMode: false,
  
  // Logging
  logLevel: 'info',
  
  // Timeout settings (ms)
  timeouts: {
    acquireLock: 5000,
    startTransaction: 5000,
    statement: 30000,
  },
};

// Database extensions to enable
export const REQUIRED_EXTENSIONS = [
  'uuid-ossp',
  'pg_trgm',
  'postgis', // For geolocation
  'pgcrypto', // For encryption
];

// Row Level Security policies
export const RLS_CONFIG = {
  // Enable RLS on all tables
  enabled: true,
  
  // Default policies
  policies: {
    // Authenticated users can read their own data
    readOwn: true,
    
    // Authenticated users can update their own data
    updateOwn: true,
    
    // Only service role can insert/update all data
    serviceRoleAll: true,
    
    // Public read for events (for discovery)
    publicRead: ['events', 'categories'],
  },
};

// Index recommendations
export const RECOMMENDED_INDEXES = [
  // Users
  { table: 'users', columns: ['telegram_id'], unique: true },
  { table: 'users', columns: ['trust_score'] },
  { table: 'users', columns: ['created_at'] },
  
  // Events
  { table: 'events', columns: ['organizer_id'] },
  { table: 'events', columns: ['status'] },
  { table: 'events', columns: ['start_date'] },
  { table: 'events', columns: ['location', 'start_date'], type: 'geospatial' },
  
  // Attendances
  { table: 'attendances', columns: ['user_id', 'event_id'], unique: true },
  { table: 'attendances', columns: ['event_id'] },
  { table: 'attendances', columns: ['user_id'] },
  
  // Messages
  { table: 'messages', columns: ['event_id', 'created_at'] },
  { table: 'messages', columns: ['sender_id'] },
];

// Trigger definitions
export const TRIGGERS = [
  {
    name: 'update_updated_at',
    table: 'users',
    function: 'update_updated_at_column',
    event: 'BEFORE UPDATE',
  },
  {
    name: 'update_updated_at',
    table: 'events',
    function: 'update_updated_at_column',
    event: 'BEFORE UPDATE',
  },
  {
    name: 'event_status_change',
    table: 'events',
    function: 'handle_event_status_change',
    event: 'AFTER UPDATE',
  },
];
