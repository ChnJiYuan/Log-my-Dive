// ─────────────────────────────────────────────────────────────────────────────
// DiveLog — the canonical data model for a single dive record.
// All depth values are stored in metres; all temperature in °C; pressure in bar;
// weight in kg. Display layers are responsible for unit conversion.
// ─────────────────────────────────────────────────────────────────────────────

export type DiveSource =
  | 'manual'
  | 'csv'
  | 'json'
  | 'garmin'
  | 'subsurface'
  | 'padi'
  | string;

export type DiveType =
  | 'recreational'
  | 'night'
  | 'drift'
  | 'deep'
  | 'cave'
  | 'wreck'
  | 'shore'
  | 'boat'
  | 'other';

export type SeaCondition =
  | 'calm'
  | 'light_chop'
  | 'choppy'
  | 'strong_current'
  | 'surge'
  | 'other';

export type TankType =
  | 'aluminium_80'
  | 'steel_12'
  | 'steel_15'
  | 'twin_set'
  | 'sidemount'
  | 'other';

export interface DiveLog {
  id: string;              // UUID v4
  userId: string;

  // Source tracking
  source: DiveSource;
  sourceRecordId?: string; // Original ID from external source (for deduplication)

  // ── Time ──────────────────────────────────────────────────────────────────
  date: string;            // ISO 8601 date only: "YYYY-MM-DD"
  entryTime: string;       // 24-hour time: "HH:MM"
  exitTime: string;        // 24-hour time: "HH:MM"
  durationMinutes: number; // Computed from entryTime/exitTime; stored for fast queries

  // ── Location ──────────────────────────────────────────────────────────────
  locationName: string;
  latitude?: number;
  longitude?: number;

  // ── Dive data ─────────────────────────────────────────────────────────────
  maxDepth?: number;          // metres
  averageDepth?: number;      // metres
  waterTemperature?: number;  // °C
  visibility?: number;        // metres

  // ── Equipment ─────────────────────────────────────────────────────────────
  tankType?: TankType;
  startPressure?: number;     // bar
  endPressure?: number;       // bar
  weight?: number;            // kg

  // ── People ────────────────────────────────────────────────────────────────
  buddy?: string;
  instructor?: string;

  // ── Conditions & type ─────────────────────────────────────────────────────
  diveType?: DiveType;
  seaCondition?: SeaCondition;

  // ── Personal diary ────────────────────────────────────────────────────────
  moodRating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  photos?: string[];           // Local file URIs; never base64 in DB

  // ── Metadata ──────────────────────────────────────────────────────────────
  createdAt: string;           // ISO 8601 datetime
  updatedAt: string;           // ISO 8601 datetime
  deletedAt?: string;          // Soft delete — set to mark as deleted
}

// Omit computed / auto-assigned fields when creating a new log
export type CreateDiveLogInput = Omit<
  DiveLog,
  'id' | 'durationMinutes' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateDiveLogInput = Partial<
  Omit<DiveLog, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'>
>;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates dive duration in minutes from HH:MM entry and exit times.
 * Handles dives that cross midnight (e.g. entry 23:45, exit 00:10 → 25 min).
 */
export function calcDurationMinutes(
  entryTime: string,
  exitTime: string
): number {
  const [entryH, entryM] = entryTime.split(':').map(Number);
  const [exitH, exitM] = exitTime.split(':').map(Number);
  const entryTotal = entryH * 60 + entryM;
  let exitTotal = exitH * 60 + exitM;
  if (exitTotal < entryTotal) exitTotal += 24 * 60; // crossed midnight
  return exitTotal - entryTotal;
}

/**
 * Deduplication key — two records with the same key are considered the same dive.
 * Based on: date + entryTime + exitTime + locationName + maxDepth.
 */
export function dedupKey(log: Pick<DiveLog, 'date' | 'entryTime' | 'exitTime' | 'locationName' | 'maxDepth'>): string {
  return [
    log.date,
    log.entryTime,
    log.exitTime,
    log.locationName.trim().toLowerCase(),
    log.maxDepth ?? 'nd',
  ].join('|');
}
