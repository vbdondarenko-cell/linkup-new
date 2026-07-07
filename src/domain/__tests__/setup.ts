// Test setup and utilities
import { EntityId } from '../shared/types';

export const generateId = (): EntityId => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const createMockUserId = (): EntityId => generateId();
export const createMockEventId = (): EntityId => generateId();
export const createMockProfileId = (): EntityId => generateId();

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
