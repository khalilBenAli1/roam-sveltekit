import { demoPlans } from './fixtures';
import { parsePlans, type Plans, type Trip } from './domain';
import { loadPlans, savePlans, type StorageState } from './storage';
export class Planner {
  plans = $state<Plans>(demoPlans());
  state = $state<StorageState>('ready');
  warning = $state('');
  status = $state('');
  loaded = $state(false);
  history = $state<Plans[]>([]);
  private storage?: Storage;
  load() {
    try {
      this.storage = window.localStorage;
      const result = loadPlans(this.storage);
      this.plans = result.plans;
      this.state = result.state;
      this.warning = result.message;
    } catch {
      this.state = 'blocked';
      this.warning =
        'Browser storage is unavailable. Export plans to keep your changes.';
    }
    this.loaded = true;
  }
  private persist() {
    if (this.state === 'corrupt') return;
    if (!this.storage || !savePlans(this.storage, this.plans)) {
      this.state = 'blocked';
      this.warning =
        'Changes are kept for this visit only. Browser storage is unavailable or full; export a copy to keep your plans.';
    }
  }
  commit(plans: Plans, message: string) {
    this.history = [
      ...this.history.slice(-19),
      structuredClone($state.snapshot(this.plans))
    ];
    this.plans = plans;
    this.status = message;
    this.persist();
  }
  update(trip: Trip, message: string) {
    this.commit(
      {
        ...this.plans,
        trips: this.plans.trips.map((t) => (t.id === trip.id ? trip : t))
      },
      message
    );
  }
  undo() {
    const previous = this.history.at(-1);
    if (!previous) return;
    this.history = this.history.slice(0, -1);
    this.plans = previous;
    this.status = 'Last change undone.';
    this.persist();
  }
  import(raw: string) {
    const plans = parsePlans(raw);
    this.commit(plans, 'All three plans imported. You can undo this change.');
  }
  reset() {
    this.commit(demoPlans(), 'Demo plans restored. You can undo this change.');
    if (this.state === 'corrupt') this.recover();
  }
  recover() {
    this.state = 'ready';
    this.warning = '';
    this.persist();
    this.status =
      this.state === 'ready'
        ? 'Unreadable data replaced with your current plans.'
        : 'Storage is still unavailable. Export your plans to keep a copy.';
  }
}
export const PLANNER = Symbol('roam-planner');
