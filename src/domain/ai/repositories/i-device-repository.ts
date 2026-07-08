import { EntityId } from '../../shared/types';
import { DeviceInfoEntity } from '../entities/device-info';

export interface IDeviceRepository {
  findByDeviceId(deviceId: string): Promise<DeviceInfoEntity | null>;
  findByUserId(userId: EntityId): Promise<DeviceInfoEntity[]>;
  findTrusted(userId: EntityId): Promise<DeviceInfoEntity[]>;
  findSuspicious(limit?: number): Promise<DeviceInfoEntity[]>;
  save(device: DeviceInfoEntity): Promise<void>;
  deleteByDeviceId(deviceId: string): Promise<void>;
  deleteByUserId(userId: EntityId): Promise<void>;
}
