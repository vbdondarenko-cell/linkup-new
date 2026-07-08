import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';

export interface DeviceInfoProps {
  deviceId: string;
  fingerprint?: string;
  userId?: EntityId;
  reputation: number;
  isTrusted: boolean;
  firstSeen: Date;
  lastSeen: Date;
  riskScore: number;
  sessionCount: number;
  userAgent?: string;
  ipAddresses: string[];
  locations: Array<{ latitude: number; longitude: number; city?: string }>;
}

export class DeviceInfoEntity extends BaseEntity<string> {
  private _deviceId: string;
  private _fingerprint?: string;
  private _userId?: EntityId;
  private _reputation: number;
  private _isTrusted: boolean;
  private _firstSeen: Date;
  private _lastSeen: Date;
  private _riskScore: number;
  private _sessionCount: number;
  private _userAgent?: string;
  private _ipAddresses: string[];
  private _locations: Array<{ latitude: number; longitude: number; city?: string }>;

  constructor(props: DeviceInfoProps & { id: string }) {
    super(props.id);
    this._deviceId = props.deviceId;
    this._fingerprint = props.fingerprint;
    this._userId = props.userId;
    this._reputation = props.reputation;
    this._isTrusted = props.isTrusted;
    this._firstSeen = new Date(props.firstSeen);
    this._lastSeen = new Date(props.lastSeen);
    this._riskScore = props.riskScore;
    this._sessionCount = props.sessionCount;
    this._userAgent = props.userAgent;
    this._ipAddresses = [...props.ipAddresses];
    this._locations = [...props.locations];
  }

  static create(props: Omit<DeviceInfoProps, 'id'>): DeviceInfoEntity {
    return new DeviceInfoEntity({
      id: props.deviceId,
      ...props,
    });
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get fingerprint(): string | undefined {
    return this._fingerprint;
  }

  get userId(): EntityId | undefined {
    return this._userId;
  }

  get reputation(): number {
    return this._reputation;
  }

  get isTrusted(): boolean {
    return this._isTrusted;
  }

  get firstSeen(): Date {
    return new Date(this._firstSeen);
  }

  get lastSeen(): Date {
    return new Date(this._lastSeen);
  }

  get riskScore(): number {
    return this._riskScore;
  }

  get sessionCount(): number {
    return this._sessionCount;
  }

  get userAgent(): string | undefined {
    return this._userAgent;
  }

  get ipAddresses(): string[] {
    return [...this._ipAddresses];
  }

  get locations(): Array<{ latitude: number; longitude: number; city?: string }> {
    return [...this._locations];
  }

  get ageInDays(): number {
    return (Date.now() - this._firstSeen.getTime()) / (1000 * 60 * 60 * 24);
  }

  get isNew(): boolean {
    return this.ageInDays < 7;
  }

  get uniqueIpCount(): number {
    return new Set(this._ipAddresses).size;
  }

  get uniqueLocationCount(): number {
    return this._locations.length;
  }

  trust(): void {
    this._isTrusted = true;
    this._reputation = Math.min(100, this._reputation + 20);
    this.touch();
  }

  distrust(): void {
    this._isTrusted = false;
    this._reputation = Math.max(0, this._reputation - 30);
    this.touch();
  }

  recordSession(ipAddress: string, location?: { latitude: number; longitude: number; city?: string }): void {
    this._sessionCount++;
    this._lastSeen = new Date();
    
    if (ipAddress && !this._ipAddresses.includes(ipAddress)) {
      this._ipAddresses.push(ipAddress);
    }
    
    if (location && !this._locations.some(l => 
      l.latitude === location.latitude && l.longitude === location.longitude
    )) {
      this._locations.push(location);
    }

    // Recalculate risk
    this._riskScore = this.calculateRisk();
    this.touch();
  }

  private calculateRisk(): number {
    let risk = 0;

    // New devices have higher initial risk
    if (this.isNew) risk += 20;

    // Multiple IPs increase risk
    if (this.uniqueIpCount > 3) risk += 15;
    if (this.uniqueIpCount > 5) risk += 15;

    // Many locations in short time is suspicious
    if (this.uniqueLocationCount > 5) risk += 25;
    if (this.uniqueLocationCount > 10) risk += 20;

    // Low reputation increases risk
    if (this._reputation < 30) risk += 20;
    if (this._reputation < 10) risk += 15;

    // High session count with new device is suspicious
    if (this.isNew && this._sessionCount > 10) risk += 20;

    return Math.min(100, risk);
  }

  calculateReputation(): number {
    let rep = 50; // Base reputation

    // Trusted devices get bonus
    if (this._isTrusted) rep += 20;

    // Age increases reputation
    rep += Math.min(20, this.ageInDays / 30 * 20);

    // Consistent IP/location helps
    if (this.uniqueIpCount <= 2) rep += 10;

    // Many sessions on old device is good
    if (!this.isNew && this._sessionCount > 50) rep += 10;

    return Math.max(0, Math.min(100, rep));
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      deviceId: this._deviceId,
      fingerprint: this._fingerprint,
      userId: this._userId,
      reputation: this._reputation,
      isTrusted: this._isTrusted,
      firstSeen: this._firstSeen.toISOString(),
      lastSeen: this._lastSeen.toISOString(),
      riskScore: this._riskScore,
      sessionCount: this._sessionCount,
      userAgent: this._userAgent,
      ipAddresses: this._ipAddresses,
      locations: this._locations,
    };
  }
}
