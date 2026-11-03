export const categories = ['Explore', 'Food', 'Stay', 'Travel'] as const;
export type Category = (typeof categories)[number];
export type Destination = 'kyoto' | 'lisbon' | 'dolomites';
export interface Activity {
  id: string;
  title: string;
  place: string;
  category: Category;
  start: number;
  duration: number;
  cents: number;
  note: string;
}
export interface Day {
  id: string;
  date: string;
  title: string;
  activities: Activity[];
}
export interface Trip {
  id: Destination;
  title: string;
  country: string;
  intro: string;
  travelers: number;
  budgetCents: number;
  days: Day[];
  saved: Activity[];
}
export interface Plans {
  version: 1;
  trips: Trip[];
}
export const STORAGE_KEY = 'roam.plans.v1';
export const MAX_BYTES = 300_000;
export const money = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(cents / 100);
export const clock = (minutes: number) =>
  `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`;
export function toMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
}
export function toCents(value: string): number | null {
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
export function conflicts(activities: Activity[]): Set<string> {
  const result = new Set<string>();
  for (let i = 0; i < activities.length; i++)
    for (let j = i + 1; j < activities.length; j++) {
      const a = activities[i],
        b = activities[j];
      if (a.start < b.start + b.duration && b.start < a.start + a.duration) {
        result.add(a.id);
        result.add(b.id);
      }
    }
  return result;
}
export function summary(activities: Activity[]) {
  return {
    cents: activities.reduce((n, a) => n + a.cents, 0),
    minutes: activities.reduce((n, a) => n + a.duration, 0),
    end: activities.length
      ? Math.max(...activities.map((a) => a.start + a.duration))
      : null
  };
}
export function tripCost(trip: Trip): number {
  return trip.days.reduce((n, d) => n + summary(d.activities).cents, 0);
}
export function reorder(day: Day, id: string, delta: -1 | 1): Day {
  const activities = [...day.activities];
  const index = activities.findIndex((a) => a.id === id);
  if (index < 0 || index + delta < 0 || index + delta >= activities.length)
    return day;
  [activities[index], activities[index + delta]] = [
    activities[index + delta],
    activities[index]
  ];
  return { ...day, activities };
}
export function move(trip: Trip, from: string, to: string, id: string): Trip {
  const source = trip.days.find((d) => d.id === from),
    target = trip.days.find((d) => d.id === to);
  const activity = source?.activities.find((a) => a.id === id);
  if (!activity || !target || from === to || target.activities.length >= 50)
    return trip;
  return {
    ...trip,
    days: trip.days.map((d) =>
      d.id === from
        ? { ...d, activities: d.activities.filter((a) => a.id !== id) }
        : d.id === to
          ? { ...d, activities: [...d.activities, activity] }
          : d
    )
  };
}
const record = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
function text(v: unknown, max: number, allowEmpty = false): string {
  if (
    typeof v !== 'string' ||
    v.length > max ||
    (!allowEmpty && !v.trim()) ||
    [...v].some((character) => character.charCodeAt(0) < 32)
  )
    throw Error('A text field is missing or too long.');
  return v;
}
function integer(v: unknown, min: number, max: number): number {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min || v > max)
    throw Error('A numeric value is outside its allowed range.');
  return v;
}
function list(v: unknown, max: number): unknown[] {
  if (!Array.isArray(v) || v.length > max)
    throw Error('Too many items or a missing list.');
  return v;
}
function activity(v: unknown): Activity {
  if (!record(v) || !categories.some((c) => c === v.category))
    throw Error('Invalid activity category.');
  const category = categories.find((c) => c === v.category);
  if (!category) throw Error('Invalid category.');
  const result = {
    id: text(v.id, 80),
    title: text(v.title, 100),
    place: text(v.place, 120, true),
    note: text(v.note, 500, true),
    category,
    start: integer(v.start, 0, 1439),
    duration: integer(v.duration, 5, 720),
    cents: integer(v.cents, 0, 9999999)
  };
  if (result.start + result.duration > 1440)
    throw Error('Activities must end within the same day.');
  return result;
}
function unique(items: { id: string }[]) {
  if (new Set(items.map((a) => a.id)).size !== items.length)
    throw Error('Duplicate item identifiers.');
}
export function parsePlans(raw: string): Plans {
  if (new TextEncoder().encode(raw).byteLength > MAX_BYTES)
    throw Error('This file exceeds the 300 KB limit.');
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error('This is not valid JSON. Choose a Roam export.');
  }
  if (!record(value) || value.version !== 1)
    throw Error('Unsupported data version. Choose a version 1 Roam export.');
  const trips = list(value.trips, 3).map((v) => {
    if (
      !record(v) ||
      (v.id !== 'kyoto' && v.id !== 'lisbon' && v.id !== 'dolomites')
    )
      throw Error('Unknown destination.');
    const id: Destination = v.id;
    const days = list(v.days, 14).map((d) => {
      if (!record(d)) throw Error('Invalid day.');
      const date = text(d.date, 10);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        new Date(date + 'T12:00:00Z').toISOString().slice(0, 10) !== date
      )
        throw Error('Invalid calendar date.');
      const activities = list(d.activities, 50).map(activity);
      return {
        id: text(d.id, 80),
        date,
        title: text(d.title, 100),
        activities
      };
    });
    if (!days.length) throw Error('Each trip needs at least one day.');
    unique(days);
    unique(days.flatMap((d) => d.activities));
    const saved = list(v.saved, 30).map(activity);
    unique(saved);
    return {
      id,
      title: text(v.title, 100),
      country: text(v.country, 60),
      intro: text(v.intro, 300),
      travelers: integer(v.travelers, 1, 20),
      budgetCents: integer(v.budgetCents, 1, 99999999),
      days,
      saved
    };
  });
  if (trips.length !== 3)
    throw Error('An export must include all three trips.');
  unique(trips);
  return { version: 1, trips };
}
