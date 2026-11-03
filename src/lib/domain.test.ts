import { describe, expect, it } from 'vitest';
import {
  conflicts,
  toCents,
  summary,
  tripCost,
  reorder,
  move,
  parsePlans,
  MAX_BYTES
} from './domain';
import { demoPlans } from './fixtures';
import { loadPlans, savePlans } from './storage';
describe('schedule and budget', () => {
  it('keeps decimal money exact and rejects malformed amounts', () => {
    expect(toCents('12.34')).toBe(1234);
    expect(toCents('0.1')).toBe(10);
    expect(toCents('99999.99')).toBe(9999999);
    for (const value of ['-1', '1.234', 'NaN', '1e3', '100000', ' 2'])
      expect(toCents(value)).toBeNull();
  });
  it('detects nested and unsorted overlaps while allowing touching endpoints', () => {
    const [a, b, c] = demoPlans().trips[0].days[0].activities;
    expect([
      ...conflicts([
        { ...a, start: 600, duration: 180 },
        { ...b, start: 620, duration: 10 },
        { ...c, start: 780, duration: 30 }
      ])
    ]).toEqual([a.id, b.id]);
    expect(
      conflicts([
        { ...a, start: 600, duration: 60 },
        { ...b, start: 660, duration: 10 }
      ]).size
    ).toBe(0);
  });
  it('sums cents and durations and finds the real latest end independent of visit order', () => {
    const activities = demoPlans().trips[0].days[0].activities;
    expect(summary([...activities].reverse())).toEqual({
      cents: 6400,
      minutes: 315,
      end: 960
    });
    expect(summary([])).toEqual({ cents: 0, minutes: 0, end: null });
  });
  it('reorders without mutating the source or losing explicit times', () => {
    const day = demoPlans().trips[0].days[0];
    const next = reorder(day, 'k1', 1);
    expect(next.activities.map((a) => a.id)).toEqual(['k2', 'k1', 'k3', 'k4']);
    expect(day.activities[0].id).toBe('k1');
    expect(next.activities[1].start).toBe(540);
    expect(reorder(day, 'k1', -1)).toBe(day);
    expect(reorder(day, 'missing', 1)).toBe(day);
  });
  it('moves between days, recomputes both day summaries, and preserves the trip total', () => {
    const trip = demoPlans().trips[0],
      before = tripCost(trip);
    const next = move(trip, 'kyoto-1', 'kyoto-3', 'k3');
    expect(summary(next.days[0].activities).cents).toBe(3200);
    expect(summary(next.days[2].activities)).toEqual({
      cents: 3200,
      minutes: 60,
      end: 825
    });
    expect(tripCost(next)).toBe(before);
    expect(trip.days[2].activities).toHaveLength(0);
    expect(move(trip, 'kyoto-1', 'missing', 'k1')).toBe(trip);
  });
  it('does not move into a full day', () => {
    const trip = demoPlans().trips[0];
    trip.days[2].activities = Array.from({ length: 50 }, (_, i) => ({
      ...trip.saved[0],
      id: String(i)
    }));
    expect(move(trip, 'kyoto-1', 'kyoto-3', 'k1')).toBe(trip);
  });
});
describe('bounded versioned imports', () => {
  it('roundtrips all fixtures exactly', () =>
    expect(parsePlans(JSON.stringify(demoPlans()))).toEqual(demoPlans()));
  it.each([
    '{',
    'null',
    '[]',
    '{"version":2,"trips":[]}',
    '{"version":1,"trips":[]}'
  ])('rejects malformed or unsupported input %s', (raw) =>
    expect(() => parsePlans(raw)).toThrow()
  );
  it('rejects oversized bytes before parsing', () =>
    expect(() => parsePlans(' '.repeat(MAX_BYTES + 1))).toThrow('300 KB'));
  it('validates numeric and text fields, calendar dates, duplicates, and categories', () => {
    const mutate = [
      (p: ReturnType<typeof demoPlans>) =>
        (p.trips[0].days[0].activities[0].cents = -1),
      (p: ReturnType<typeof demoPlans>) =>
        (p.trips[0].days[0].activities[0].duration = 1),
      (p: ReturnType<typeof demoPlans>) =>
        (p.trips[0].days[0].activities[0].start = 1430),
      (p: ReturnType<typeof demoPlans>) =>
        (p.trips[0].days[0].date = '2027-02-30'),
      (p: ReturnType<typeof demoPlans>) =>
        (p.trips[0].days[0].activities[0].title = 'a'.repeat(101)),
      (p: ReturnType<typeof demoPlans>) =>
        (p.trips[0].days[0].activities[0].id = 'k2')
    ];
    for (const change of mutate) {
      const plans = demoPlans();
      change(plans);
      expect(() => parsePlans(JSON.stringify(plans))).toThrow();
    }
  });
  it('strips unrecognized fields rather than trusting imported object structure', () => {
    const raw = JSON.stringify(demoPlans()).replace(
      '"version":1',
      '"version":1,"__proto__":{"polluted":true}'
    );
    expect(parsePlans(raw)).not.toHaveProperty('__proto__');
  });
});
describe('persistence recovery', () => {
  it('uses demo fixtures when storage is empty', () =>
    expect(loadPlans({ getItem: () => null, setItem: () => {} }).state).toBe(
      'ready'
    ));
  it('recovers valid stored edits', () => {
    const p = demoPlans();
    p.trips[0].days[0].activities[0].title = 'Changed';
    expect(
      loadPlans({ getItem: () => JSON.stringify(p), setItem: () => {} }).plans
    ).toEqual(p);
  });
  it('preserves unreadable storage without overwriting it', () => {
    let written = false;
    const loaded = loadPlans({
      getItem: () => '{broken',
      setItem: () => {
        written = true;
      }
    });
    expect(loaded.state).toBe('corrupt');
    expect(loaded.plans.trips).toHaveLength(3);
    expect(written).toBe(false);
  });
  it('reports blocked reads and writes instead of throwing', () => {
    const blocked = {
      getItem: () => {
        throw Error('denied');
      },
      setItem: () => {
        throw Error('quota');
      }
    };
    expect(loadPlans(blocked).state).toBe('blocked');
    expect(savePlans(blocked, demoPlans())).toBe(false);
  });
});
