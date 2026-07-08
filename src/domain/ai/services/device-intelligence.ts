import { EntityId } from '../../shared/types';
import { DeviceInfoEntity } from '../entities/device-info';
import { SessionInfo } from '../types';
import { IDeviceRepository } from '../repositories/i-device-repository';
import { DeviceIntelligenceError } from '../errors/ai-errors';

export interface DeviceRepository {
  findByDeviceId(deviceId: string): Promise<DeviceInfoEntity | null>;
  findByUserId(userId: EntityId): Promise<DeviceInfoEntity[]>;
  save(device: DeviceInfoEntity): Promise<void>;
  deleteByDeviceId(deviceId: string): Promise<void>;
}

export interface DeviceRegistrationData {
  deviceId: string;
  fingerprint?: string;
  userId: EntityId;
  userAgent?: string;
  ipAddress: string;
  location?: { latitude: number; longitude: number; city?: string };
}

export interface SessionData {
  sessionId: EntityId;
  userId: EntityId;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  location?: { latitude: number; longitude: number };
  startedAt: Date;
}

export class DeviceIntelligenceService {
  private readonly TRUSTED_DEVICE_AGE_DAYS = 30;
  private readonly TRUSTED_SESSION_COUNT = 10;

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async registerDevice(data: DeviceRegistrationData): Promise<DeviceInfoEntity> {
    let device = await this.deviceRepository.findByDeviceId(data.deviceId);

    if (device) {
      // Update existing device
      device.recordSession(data.ipAddress, data.location);
      if (data.userId !== device.userId) {
        (device as any)._userId = data.userId;
      }
    } else {
      // Create new device
      device = DeviceInfoEntity.create({
        deviceId: data.deviceId,
        fingerprint: data.fingerprint,
        userId: data.userId,
        reputation: 30, // New devices start with low reputation
        isTrusted: false,
        firstSeen: new Date(),
        lastSeen: new Date(),
        riskScore: 40, // New devices have elevated risk
        sessionCount: 1,
        userAgent: data.userAgent,
        ipAddresses: [data.ipAddress],
        locations: data.location ? [data.location] : [],
      });
    }

    await this.deviceRepository.save(device);
    return device;
  }

  async recordSession(sessionData: SessionData): Promise<DeviceInfoEntity> {
    let device = await this.deviceRepository.findByDeviceId(sessionData.deviceId);

    if (!device) {
      // Auto-register if session exists without device
      device = await this.registerDevice({
        deviceId: sessionData.deviceId,
        userId: sessionData.userId,
        ipAddress: sessionData.ipAddress,
        location: sessionData.location,
        userAgent: sessionData.userAgent,
      });
    } else {
      device.recordSession(sessionData.ipAddress, sessionData.location);
    }

    await this.deviceRepository.save(device);
    return device;
  }

  async trustDevice(deviceId: string): Promise<void> {
    const device = await this.deviceRepository.findByDeviceId(deviceId);
    if (!device) {
      throw new DeviceIntelligenceError(`Device not found: ${deviceId}`);
    }

    device.trust();
    await this.deviceRepository.save(device);
  }

  async distrustDevice(deviceId: string, reason: string): Promise<void> {
    const device = await this.deviceRepository.findByDeviceId(deviceId);
    if (!device) {
      throw new DeviceIntelligenceError(`Device not found: ${deviceId}`);
    }

    device.distrust();
    await this.deviceRepository.save(device);
    
    // Log for security audit
    console.warn(`Device ${deviceId} distrusted: ${reason}`);
  }

  async getDeviceInfo(deviceId: string): Promise<DeviceInfoEntity | null> {
    return this.deviceRepository.findByDeviceId(deviceId);
  }

  async getUserDevices(userId: EntityId): Promise<DeviceInfoEntity[]> {
    return this.deviceRepository.findByUserId(userId);
  }

  async assessSessionRisk(sessionData: SessionData): Promise<{
    riskScore: number;
    isSuspicious: boolean;
    warnings: string[];
  }> {
    const device = await this.deviceRepository.findByDeviceId(sessionData.deviceId);
    const warnings: string[] = [];
    let riskScore = 30; // Base risk

    if (!device) {
      // New device - higher risk
      riskScore += 30;
      warnings.push('New device detected');
    } else {
      // Check for unusual activity
      if (device.userId && device.userId !== sessionData.userId) {
        riskScore += 40;
        warnings.push('Device used by different user');
      }

      // IP change
      if (!device.ipAddresses.includes(sessionData.ipAddress)) {
        riskScore += 15;
        warnings.push('New IP address detected');
      }

      // Location change (would need more sophisticated geo analysis)
      if (sessionData.location && device.locations.length > 0) {
        const lastLocation = device.locations[device.locations.length - 1];
        const distance = this.calculateDistance(
          lastLocation.latitude, lastLocation.longitude,
          sessionData.location.latitude, sessionData.location.longitude
        );
        
        if (distance > 500) { // More than 500km from last location
          riskScore += 25;
          warnings.push('Significant location change detected');
        }
      }

      // Unusual session frequency
      const hoursSinceLastSession = device.lastSeen 
        ? (Date.now() - device.lastSeen.getTime()) / (1000 * 60 * 60)
        : 24;
      
      if (hoursSinceLastSession < 1 && device.sessionCount > 5) {
        riskScore += 20;
        warnings.push('Unusual session frequency');
      }
    }

    // Device is new and has suspicious characteristics
    if (device?.isNew && riskScore > 50) {
      warnings.push('Exercise caution with new device');
    }

    return {
      riskScore: Math.min(100, riskScore),
      isSuspicious: riskScore >= 60,
      warnings,
    };
  }

  async cleanupOldDevices(userId: EntityId, keepTrusted: boolean = true): Promise<number> {
    const devices = await this.deviceRepository.findByUserId(userId);
    let cleaned = 0;

    for (const device of devices) {
      // Don't remove trusted devices if keepTrusted is true
      if (keepTrusted && device.isTrusted) continue;

      // Remove devices not seen in 90 days
      const daysSinceLastSeen = (Date.now() - device.lastSeen.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSeen > 90) {
        await this.deviceRepository.deleteByDeviceId(device.deviceId);
        cleaned++;
      }
    }

    return cleaned;
  }

  async getDeviceStats(): Promise<{
    totalDevices: number;
    trustedDevices: number;
    newDevices: number;
    suspiciousDevices: number;
    avgRiskScore: number;
  }> {
    // Would query repository for stats
    return {
      totalDevices: 0,
      trustedDevices: 0,
      newDevices: 0,
      suspiciousDevices: 0,
      avgRiskScore: 0,
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  // Passkey support (future)
  async registerPasskey(_deviceId: string, _passkeyId: string): Promise<void> {
    // Future implementation for passkey authentication
    console.log('Passkey registration - future feature');
  }
}
