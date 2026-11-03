import { parsePlans, STORAGE_KEY, type Plans } from './domain';
import { demoPlans } from './fixtures';
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export type StorageState = 'ready' | 'blocked' | 'corrupt';
export function loadPlans(storage: StoragePort): {
  plans: Plans;
  state: StorageState;
  message: string;
} {
  let raw: string | null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      plans: demoPlans(),
      state: 'blocked',
      message:
        'Browser storage is unavailable. Changes work for this visit; export a copy to keep them.'
    };
  }
  if (raw === null) return { plans: demoPlans(), state: 'ready', message: '' };
  try {
    return { plans: parsePlans(raw), state: 'ready', message: '' };
  } catch {
    return {
      plans: demoPlans(),
      state: 'corrupt',
      message:
        'Saved plans could not be read. Your original data has been left untouched. Working with a temporary demo; export it or choose “Replace unreadable data” to save here again.'
    };
  }
}
export function savePlans(storage: StoragePort, plans: Plans): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(plans));
    return true;
  } catch {
    return false;
  }
}
