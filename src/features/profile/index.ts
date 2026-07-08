/**
 * LinkUp Design System 2026
 * Profile Feature - Main Exports
 */

// Profile Screen
export { ProfileScreen } from './profile-screen';

// Header
export { ProfileHeader } from './header/profile-header';
export type { BadgeType } from './header/profile-header';

// Trust
export { TrustCard, TrustBadge } from './trust/trust-card';

// XP System
export { XPDisplay, LevelBadge, LevelProgress, LEVELS } from './xp/xp-system';
export type { Level, LevelName, XPDisplayProps } from './xp/xp-system';

// Statistics
export { Statistics, CompactStats } from './statistics/statistics';
export type { UserStatistics } from './statistics/statistics';

// Achievements
export { Achievements, AchievementBadge, RecentAchievements, SAMPLE_ACHIEVEMENTS } from './achievements/achievements';
export type { Achievement, AchievementCategory, AchievementStatus } from './achievements/achievements';
