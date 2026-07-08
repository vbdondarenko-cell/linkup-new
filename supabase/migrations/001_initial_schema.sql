-- =====================================================
-- LINKUP V6 - INITIAL DATABASE SCHEMA
-- Supabase PostgreSQL with PostGIS
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        UPDATE OLD SET deleted_at = NOW();
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM (
    'guest',
    'user',
    'organizer',
    'business',
    'moderator',
    'admin',
    'super_admin'
);

CREATE TYPE event_status AS ENUM (
    'draft',
    'published',
    'ongoing',
    'completed',
    'cancelled'
);

CREATE TYPE request_status AS ENUM (
    'pending',
    'accepted',
    'declined'
);

CREATE TYPE premium_plan AS ENUM (
    'monthly',
    'yearly'
);

CREATE TYPE premium_status AS ENUM (
    'active',
    'expired',
    'cancelled',
    'trial'
);

CREATE TYPE notification_type AS ENUM (
    'join_request',
    'request_accepted',
    'request_declined',
    'new_message',
    'upcoming_event',
    'event_reminder',
    'event_started',
    'event_finished',
    'achievement_earned',
    'badge_unlocked',
    'level_up',
    'trust_increased',
    'organizer_promotion',
    'business_verified',
    'premium_activated',
    'reward_premium_ready',
    'system_announcement'
);

CREATE TYPE report_status AS ENUM (
    'pending',
    'reviewed',
    'resolved',
    'dismissed'
);

CREATE TYPE report_reason AS ENUM (
    'spam',
    'fake_profile',
    'harassment',
    'inappropriate_content',
    'dangerous_behavior',
    'other'
);

CREATE TYPE business_rank AS ENUM (
    'verified',
    'featured',
    'premium',
    'hub',
    'ambassador'
);

CREATE TYPE organizer_rank AS ENUM (
    'newcomer',
    'rising',
    'pro',
    'community',
    'elite',
    'legend'
);

-- =====================================================
-- PROFILES
-- =====================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_id VARCHAR(255) UNIQUE,
    telegram_username VARCHAR(255),
    display_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Location
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),
    current_city VARCHAR(255),
    
    -- Engagement
    radius INTEGER DEFAULT 5, -- in km
    trust_score DECIMAL(5,2) DEFAULT 50.00,
    xp_total INTEGER DEFAULT 0,
    xp_current INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    
    -- Flags
    is_premium BOOLEAN DEFAULT FALSE,
    is_organizer BOOLEAN DEFAULT FALSE,
    is_business BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Membership
    member_since TIMESTAMPTZ DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id)
);

-- Indexes for profiles
CREATE INDEX idx_profiles_telegram_id ON profiles(telegram_id);
CREATE INDEX idx_profiles_location ON profiles USING GIST(location);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- ROLES & PERMISSIONS (RBAC)
-- =====================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name user_role NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0, -- Higher = more privileged
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(100) NOT NULL, -- e.g., 'events', 'users', 'business'
    action VARCHAR(50) NOT NULL, -- e.g., 'create', 'read', 'update', 'delete'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES profiles(id),
    PRIMARY KEY (user_id, role_id)
);

-- Indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- =====================================================
-- INTERESTS
-- =====================================================

CREATE TABLE interest_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES interest_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_interests (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, interest_id)
);

-- Indexes
CREATE INDEX idx_interests_category ON interests(category_id);
CREATE INDEX idx_user_interests_user ON user_interests(user_id);

-- =====================================================
-- EVENT CATEGORIES
-- =====================================================

CREATE TABLE event_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EVENTS
-- =====================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    
    -- Category
    category_id UUID REFERENCES event_categories(id),
    
    -- Timing
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    
    -- Location
    location_name VARCHAR(255),
    location_address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),
    
    -- Capacity
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    min_participants INTEGER DEFAULT 1,
    is_full BOOLEAN GENERATED ALWAYS AS (current_participants >= max_participants) STORED,
    
    -- Pricing
    price DECIMAL(10,2) DEFAULT 0,
    is_free BOOLEAN GENERATED ALWAYS AS (price = 0) STORED,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Organizer
    organizer_id UUID REFERENCES profiles(id) NOT NULL,
    
    -- Business (if official event)
    business_id UUID, -- Reference to business_profiles
    
    -- Status
    status event_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- Trust & Quality
    average_rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    
    -- Settings
    requires_approval BOOLEAN DEFAULT TRUE,
    allow_cancelled BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id),
    
    -- Check constraints
    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_participants CHECK (current_participants >= 0 AND (max_participants IS NULL OR current_participants <= max_participants))
);

-- Indexes for events
CREATE INDEX idx_events_location ON events USING GIST(location);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_featured ON events(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_events_trending ON events(is_trending) WHERE is_trending = TRUE;

-- Full text search
CREATE INDEX idx_events_search ON events USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- Trigger
CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- EVENT PARTICIPANTS
-- =====================================================

CREATE TABLE event_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Status
    status request_status DEFAULT 'accepted',
    
    -- Attendance
    checked_in_at TIMESTAMPTZ,
    checked_out_at TIMESTAMPTZ,
    was_present BOOLEAN DEFAULT FALSE,
    
    -- Rating
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    rating_given_at TIMESTAMPTZ,
    
    -- Timestamps
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    
    -- Constraints
    UNIQUE (event_id, user_id)
);

-- Indexes
CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);
CREATE INDEX idx_event_participants_status ON event_participants(status);

-- =====================================================
-- EVENT REQUESTS
-- =====================================================

CREATE TABLE event_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Request details
    message TEXT,
    status request_status DEFAULT 'pending',
    
    -- Resolution
    responded_at TIMESTAMPTZ,
    responded_by UUID REFERENCES profiles(id),
    response_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE (event_id, user_id)
);

-- Indexes
CREATE INDEX idx_event_requests_event ON event_requests(event_id);
CREATE INDEX idx_event_requests_user ON event_requests(user_id);
CREATE INDEX idx_event_requests_status ON event_requests(status) WHERE status = 'pending';

-- =====================================================
-- BUSINESS PROFILES
-- =====================================================

CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) UNIQUE,
    
    -- Business Info
    business_name VARCHAR(255) NOT NULL,
    business_email VARCHAR(255),
    business_phone VARCHAR(50),
    business_website TEXT,
    
    -- Location
    address TEXT,
    city VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),
    
    -- Category
    category_id UUID REFERENCES interest_categories(id),
    
    -- Verification & Ranking
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    rank business_rank DEFAULT 'verified',
    
    -- Stats
    total_events INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_business_profiles_location ON business_profiles USING GIST(location);
CREATE INDEX idx_business_profiles_category ON business_profiles(category_id);
CREATE INDEX idx_business_profiles_rank ON business_profiles(rank);

-- =====================================================
-- ORGANIZER PROFILES
-- =====================================================

CREATE TABLE organizer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) UNIQUE,
    
    -- Profile
    display_name VARCHAR(255),
    bio TEXT,
    
    -- Ranking
    rank organizer_rank DEFAULT 'newcomer',
    promoted_at TIMESTAMPTZ,
    
    -- Stats
    total_events INTEGER DEFAULT 0,
    total_participants INTEGER DEFAULT 0,
    completed_events INTEGER DEFAULT 0,
    cancelled_events INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Streaks
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_event_date TIMESTAMPTZ,
    
    -- Trust
    trust_score DECIMAL(5,2) DEFAULT 50.00,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_organizer_profiles_rank ON organizer_profiles(rank);
CREATE INDEX idx_organizer_profiles_trust ON organizer_profiles(trust_score DESC);

-- =====================================================
-- CHATS & MESSAGES
-- =====================================================

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) DEFAULT 'direct', -- 'direct', 'event', 'group'
    
    -- For event chats
    event_id UUID REFERENCES events(id),
    
    -- For group chats
    name VARCHAR(255),
    description TEXT,
    avatar_url TEXT,
    
    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE TABLE chat_members (
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- 'owner', 'admin', 'member'
    
    -- Notifications
    notifications_enabled BOOLEAN DEFAULT TRUE,
    last_read_at TIMESTAMPTZ,
    unread_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    
    PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id),
    
    -- Content
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'file', 'system'
    media_url TEXT,
    
    -- Reply
    reply_to_id UUID REFERENCES messages(id),
    
    -- Reactions
    reactions JSONB DEFAULT '[]',
    
    -- Status
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for chats
CREATE INDEX idx_chat_members_chat ON chat_members(chat_id);
CREATE INDEX idx_chat_members_user ON chat_members(user_id);
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    body TEXT,
    image_url TEXT,
    deep_link TEXT,
    data JSONB DEFAULT '{}',
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Delivery
    push_sent BOOLEAN DEFAULT FALSE,
    push_sent_at TIMESTAMPTZ,
    
    -- Expiration
    expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE is_read = FALSE AND is_archived = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- =====================================================
-- ACHIEVEMENTS & BADGES
-- =====================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50),
    
    -- Requirements
    requirement_type VARCHAR(50), -- 'count', 'streak', 'rating'
    requirement_value INTEGER NOT NULL,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    
    -- Flags
    is_secret BOOLEAN DEFAULT FALSE,
    is_limited_time BOOLEAN DEFAULT FALSE,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    PRIMARY KEY (user_id, achievement_id)
);

CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    type VARCHAR(50), -- 'community', 'verified', 'organizer', 'premium', etc.
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    
    -- Requirements
    requirement_type VARCHAR(50),
    requirement_value INTEGER,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    is_equipped BOOLEAN DEFAULT FALSE,
    
    PRIMARY KEY (user_id, badge_id)
);

-- =====================================================
-- XP & LEVELS
-- =====================================================

CREATE TABLE xp_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    source VARCHAR(50), -- 'event', 'achievement', 'badge', 'streak', etc.
    source_id UUID, -- Reference to the source entity
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_history_user ON xp_history(user_id);
CREATE INDEX idx_xp_history_created ON xp_history(created_at DESC);

-- =====================================================
-- REPUTATION
-- =====================================================

CREATE TABLE reputation_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    score_change DECIMAL(5,2) NOT NULL,
    new_score DECIMAL(5,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    source VARCHAR(50),
    source_id UUID,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reputation_history_user ON reputation_history(user_id);

-- =====================================================
-- REPORTS & BLOCKS
-- =====================================================

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    reporter_id UUID REFERENCES profiles(id) NOT NULL,
    reported_user_id UUID REFERENCES profiles(id),
    reported_event_id UUID REFERENCES events(id),
    reported_business_id UUID REFERENCES business_profiles(id),
    reported_chat_id UUID REFERENCES chats(id),
    
    reason report_reason NOT NULL,
    description TEXT,
    
    -- Evidence
    evidence_urls TEXT[],
    
    -- Status
    status report_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status) WHERE status = 'pending';

CREATE TABLE blocks (
    blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (blocker_id, blocked_id)
);

CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON blocks(blocked_id);

CREATE TABLE mutes (
    muter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    muted_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    PRIMARY KEY (muter_id, muted_id)
);

-- =====================================================
-- FAVORITES & SAVED PLACES
-- =====================================================

CREATE TABLE favorites (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    favorited_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    favorited_business_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    favorited_organizer_id UUID REFERENCES organizer_profiles(id) ON DELETE CASCADE,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CHECK (
        (favorited_event_id IS NOT NULL)::int +
        (favorited_business_id IS NOT NULL)::int +
        (favorited_organizer_id IS NOT NULL)::int = 1
    )
);

CREATE TABLE saved_places (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location GEOGRAPHY(POINT, 4326),
    is_default BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_places_location ON saved_places USING GIST(location);

-- =====================================================
-- PREMIUM & TRANSACTIONS
-- =====================================================

CREATE TABLE premium (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) UNIQUE,
    
    plan premium_plan NOT NULL,
    status premium_status DEFAULT 'active',
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Dates
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    
    -- Payment
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE premium_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    premium_id UUID REFERENCES premium(id) ON DELETE CASCADE,
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'completed',
    
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REWARD ADS
-- =====================================================

CREATE TABLE reward_ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    ads_watched_today INTEGER DEFAULT 0,
    last_watch_date DATE,
    last_reward_at TIMESTAMPTZ,
    
    -- Cooldown
    cooldown_until TIMESTAMPTZ,
    
    -- History
    total_rewards INTEGER DEFAULT 0,
    total_ads_watched INTEGER DEFAULT 0,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DEVICES & SESSIONS
-- =====================================================

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    device_type VARCHAR(50), -- 'ios', 'android', 'web', 'desktop'
    device_name VARCHAR(255),
    device_token TEXT, -- For push notifications
    
    -- Location
    last_ip VARCHAR(45),
    last_city VARCHAR(255),
    last_country VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    
    expires_at TIMESTAMPTZ NOT NULL,
    last_used_at TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);

-- =====================================================
-- ANALYTICS
-- =====================================================

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES profiles(id),
    session_id UUID,
    device_id UUID,
    
    -- Event data
    event_data JSONB DEFAULT '{}',
    
    -- Context
    platform VARCHAR(50),
    app_version VARCHAR(20),
    
    -- Location
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioned by date for performance
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    
    old_data JSONB,
    new_data JSONB,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================

CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id)
);

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default roles
INSERT INTO roles (name, display_name, description, priority) VALUES
    ('guest', 'Guest', 'Limited access for non-authenticated users', 0),
    ('user', 'User', 'Standard user with basic access', 10),
    ('organizer', 'Organizer', 'User who can create events', 20),
    ('business', 'Business', 'Verified business account', 25),
    ('moderator', 'Moderator', 'Community moderator', 50),
    ('admin', 'Admin', 'Administrator', 75),
    ('super_admin', 'Super Admin', 'Super administrator with full access', 100);

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
    -- Events
    ('events.create', 'events', 'create', 'Create new events'),
    ('events.read', 'events', 'read', 'View events'),
    ('events.update', 'events', 'update', 'Update own events'),
    ('events.update_any', 'events', 'update', 'Update any event'),
    ('events.delete', 'events', 'delete', 'Delete own events'),
    ('events.delete_any', 'events', 'delete', 'Delete any event'),
    ('events.approve', 'events', 'approve', 'Approve event requests'),
    
    -- Users
    ('users.read', 'users', 'read', 'View user profiles'),
    ('users.update', 'users', 'update', 'Update own profile'),
    ('users.update_any', 'users', 'update', 'Update any profile'),
    ('users.delete', 'users', 'delete', 'Delete own account'),
    ('users.delete_any', 'users', 'delete', 'Delete any account'),
    
    -- Business
    ('business.create', 'business', 'create', 'Create business profile'),
    ('business.read', 'business', 'read', 'View business profiles'),
    ('business.update', 'business', 'update', 'Update own business'),
    ('business.verify', 'business', 'verify', 'Verify business accounts'),
    
    -- Moderation
    ('moderation.read', 'moderation', 'read', 'View reports'),
    ('moderation.update', 'moderation', 'update', 'Handle reports'),
    ('moderation.ban', 'moderation', 'ban', 'Ban users'),
    
    -- Admin
    ('admin.settings', 'admin', 'settings', 'Manage system settings'),
    ('admin.roles', 'admin', 'roles', 'Manage roles and permissions'),
    ('admin.users', 'admin', 'users', 'Manage users');

-- Assign permissions to roles
-- Guest: read events, users
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'guest' AND p.name IN ('events.read', 'users.read');

-- User: all basic permissions
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'user' AND p.name IN (
    'events.create', 'events.read', 'events.update', 'events.delete',
    'users.read', 'users.update',
    'business.read'
);

-- Organizer: user + event management
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'organizer' AND p.name IN (
    'events.create', 'events.read', 'events.update', 'events.delete', 'events.approve',
    'users.read', 'users.update',
    'business.read', 'business.create'
);

-- Business: organizer + business management
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'business' AND p.name IN (
    'events.create', 'events.read', 'events.update', 'events.delete', 'events.approve',
    'users.read', 'users.update',
    'business.read', 'business.create', 'business.update'
);

-- Moderator: user + moderation
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'moderator' AND p.name IN (
    'events.read', 'events.update_any', 'events.delete_any',
    'users.read', 'users.update_any',
    'business.read', 'business.verify',
    'moderation.read', 'moderation.update', 'moderation.ban'
);

-- Admin: moderator + admin
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'admin' AND p.name IN (
    'events.read', 'events.update_any', 'events.delete_any',
    'users.read', 'users.update_any', 'users.delete_any',
    'business.read', 'business.verify',
    'moderation.read', 'moderation.update', 'moderation.ban',
    'admin.settings', 'admin.roles', 'admin.users'
);

-- Super Admin: all permissions
INSERT INTO role_permissions 
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'super_admin';

-- =====================================================
-- POSTGIS TRIGGERS
-- =====================================================

-- Auto-update location geography
CREATE OR REPLACE FUNCTION update_event_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_location_update
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_event_location();

CREATE TRIGGER profiles_location_update
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profile_location();

CREATE OR REPLACE FUNCTION update_profile_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- For Supabase auth (anon and authenticated roles)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reputation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
