import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';

// Organizer Rank System
export type OrganizerRank = 
  | 'rising'      // Entry level organizer
  | 'pro'         // Proven organizer
  | 'community'   // Community leader
  | 'elite'       // Elite organizer
  | 'legend';     // Top tier organizer

export type OrganizerStatus = 'locked' | 'active' | 'suspended';

export interface OrganizerProps {
  userId: EntityId;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  status: OrganizerStatus;
  rank: OrganizerRank;
  totalEvents: number;
  successfulEvents: number;
  averageRating: number;
  totalParticipants: number;
  attendanceRate: number;
  currentStreak: number;
  longestStreak: number;
  isFeatured: boolean;
  featuredAt?: Date;
  rankProgress: number;
  level: number;
  xp: number;
  createdAt?: Date;
}

export const RANK_THRESHOLDS: Record<OrganizerRank, { events: number; rating: number; attendance: number }> = {
  rising: { events: 5, rating: 4.0, attendance: 70 },
  pro: { events: 25, rating: 4.5, attendance: 85 },
  community: { events: 50, rating: 4.5, attendance: 90 },
  elite: { events: 100, rating: 4.7, attendance: 92 },
  legend: { events: 250, rating: 4.8, attendance: 95 },
};

export const RANK_DISPLAY: Record<OrganizerRank, { label: string; color: string; icon: string }> = {
  rising: { label: 'Rising Organizer', color: '#9CA3AF', icon: '🌱' },
  pro: { label: 'Pro Organizer', color: '#3B82F6', icon: '⭐' },
  community: { label: 'Community Leader', color: '#8B5CF6', icon: '🎯' },
  elite: { label: 'Elite Organizer', color: '#F59E0B', icon: '💫' },
  legend: { label: 'Legend Organizer', color: '#10B981', icon: '👑' },
};

export class Organizer extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _displayName: string;
  private _bio?: string;
  private _avatarUrl?: string;
  private _status: OrganizerStatus;
  private _rank: OrganizerRank;
  private _totalEvents: number;
  private _successfulEvents: number;
  private _averageRating: number;
  private _totalParticipants: number;
  private _attendanceRate: number;
  private _currentStreak: number;
  private _longestStreak: number;
  private _isFeatured: boolean;
  private _featuredAt?: Date;
  private _rankProgress: number;
  private _level: number;
  private _xp: number;

  constructor(props: OrganizerProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._displayName = props.displayName;
    this._bio = props.bio;
    this._avatarUrl = props.avatarUrl;
    this._status = props.status;
    this._rank = props.rank;
    this._totalEvents = props.totalEvents;
    this._successfulEvents = props.successfulEvents;
    this._averageRating = props.averageRating;
    this._totalParticipants = props.totalParticipants;
    this._attendanceRate = props.attendanceRate;
    this._currentStreak = props.currentStreak;
    this._longestStreak = props.longestStreak;
    this._isFeatured = props.isFeatured;
    this._featuredAt = props.featuredAt;
    this._rankProgress = props.rankProgress;
    this._level = props.level;
    this._xp = props.xp;
  }

  static create(userId: EntityId, displayName: string): Organizer {
    return new Organizer({
      id: `organizer_${userId}`,
      userId,
      displayName,
      status: 'locked',
      rank: 'rising',
      totalEvents: 0,
      successfulEvents: 0,
      averageRating: 0,
      totalParticipants: 0,
      attendanceRate: 100,
      currentStreak: 0,
      longestStreak: 0,
      isFeatured: false,
      rankProgress: 0,
      level: 1,
      xp: 0,
    });
  }

  get userId(): EntityId { return this._userId; }
  get displayName(): string { return this._displayName; }
  get bio(): string | undefined { return this._bio; }
  get avatarUrl(): string | undefined { return this._avatarUrl; }
  get status(): OrganizerStatus { return this._status; }
  get rank(): OrganizerRank { return this._rank; }
  get totalEvents(): number { return this._totalEvents; }
  get successfulEvents(): number { return this._successfulEvents; }
  get averageRating(): number { return this._averageRating; }
  get totalParticipants(): number { return this._totalParticipants; }
  get attendanceRate(): number { return this._attendanceRate; }
  get currentStreak(): number { return this._currentStreak; }
  get longestStreak(): number { return this._longestStreak; }
  get isFeatured(): boolean { return this._isFeatured; }
  get featuredAt(): Date | undefined { return this._featuredAt ? new Date(this._featuredAt) : undefined; }
  get rankProgress(): number { return this._rankProgress; }
  get level(): number { return this._level; }
  get xp(): number { return this._xp; }

  get isActive(): boolean { return this._status === 'active'; }
  get isLocked(): boolean { return this._status === 'locked'; }

  get successRate(): number {
    if (this._totalEvents === 0) return 0;
    return Math.round((this._successfulEvents / this._totalEvents) * 100);
  }

  get rankInfo() {
    return RANK_DISPLAY[this._rank];
  }

  get nextRank(): OrganizerRank | null {
    const ranks: OrganizerRank[] = ['rising', 'pro', 'community', 'elite', 'legend'];
    const currentIndex = ranks.indexOf(this._rank);
    return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
  }

  get nextRankInfo() {
    const next = this.nextRank;
    return next ? RANK_DISPLAY[next] : null;
  }

  get nextRankThreshold() {
    const next = this.nextRank;
    return next ? RANK_THRESHOLDS[next] : null;
  }

  canUnlock(): boolean {
    return (
      this._totalEvents >= RANK_THRESHOLDS.rising.events &&
      this._averageRating >= RANK_THRESHOLDS.rising.rating
    );
  }

  unlock(): void {
    if (!this.canUnlock()) return;
    this._status = 'active';
    this.touch();
  }

  suspend(): void {
    this._status = 'suspended';
    this.touch();
  }

  updateProfile(details: { displayName?: string; bio?: string; avatarUrl?: string }): void {
    if (details.displayName) this._displayName = details.displayName;
    if (details.bio !== undefined) this._bio = details.bio;
    if (details.avatarUrl !== undefined) this._avatarUrl = details.avatarUrl;
    this.touch();
  }

  recordEventCompletion(participantCount: number, rating?: number): void {
    this._totalEvents += 1;
    this._successfulEvents += 1;
    this._totalParticipants += participantCount;
    
    if (rating) {
      this._averageRating = this._averageRating === 0 
        ? rating 
        : (this._averageRating + rating) / 2;
    }
    
    this.incrementStreak();
    this.addXp(100 + participantCount * 10);
    this.updateRankProgress();
    this.checkRankPromotion();
    this.touch();
  }

  recordNoShow(): void {
    this._currentStreak = 0;
    this._attendanceRate = Math.max(0, this._attendanceRate - 5);
    this.touch();
  }

  private incrementStreak(): void {
    this._currentStreak += 1;
    if (this._currentStreak > this._longestStreak) {
      this._longestStreak = this._currentStreak;
    }
  }

  private addXp(amount: number): void {
    this._xp += amount;
    const xpPerLevel = 1000;
    const newLevel = Math.floor(this._xp / xpPerLevel) + 1;
    if (newLevel > this._level) {
      this._level = newLevel;
    }
  }

  private updateRankProgress(): void {
    const next = this.nextRank;
    if (!next) {
      this._rankProgress = 100;
      return;
    }
    
    const threshold = RANK_THRESHOLDS[next];
    const minEvents = RANK_THRESHOLDS[this._rank].events;
    const eventProgress = Math.min(1, (this._totalEvents - minEvents) / (threshold.events - minEvents));
    const ratingProgress = Math.min(1, (this._averageRating - RANK_THRESHOLDS[this._rank].rating) / (threshold.rating - RANK_THRESHOLDS[this._rank].rating));
    const attendanceProgress = Math.min(1, (this._attendanceRate - RANK_THRESHOLDS[this._rank].attendance) / (threshold.attendance - RANK_THRESHOLDS[this._rank].attendance));
    
    this._rankProgress = Math.round((eventProgress + ratingProgress + attendanceProgress) / 3 * 100);
  }

  private checkRankPromotion(): void {
    const next = this.nextRank;
    if (!next) return;
    
    const threshold = RANK_THRESHOLDS[next];
    if (
      this._totalEvents >= threshold.events &&
      this._averageRating >= threshold.rating &&
      this._attendanceRate >= threshold.attendance
    ) {
      this._rank = next;
      this._rankProgress = 0;
    }
  }

  feature(): void {
    this._isFeatured = true;
    this._featuredAt = new Date();
    this.touch();
  }

  unfeature(): void {
    this._isFeatured = false;
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      displayName: this._displayName,
      bio: this._bio,
      avatarUrl: this._avatarUrl,
      status: this._status,
      rank: this._rank,
      totalEvents: this._totalEvents,
      successfulEvents: this._successfulEvents,
      averageRating: this._averageRating,
      totalParticipants: this._totalParticipants,
      attendanceRate: this._attendanceRate,
      currentStreak: this._currentStreak,
      longestStreak: this._longestStreak,
      isFeatured: this._isFeatured,
      featuredAt: this._featuredAt?.toISOString(),
      rankProgress: this._rankProgress,
      level: this._level,
      xp: this._xp,
      successRate: this.successRate,
      rankInfo: this.rankInfo,
    };
  }
}
