import type { DiveLog, CreateDiveLogInput, UpdateDiveLogInput } from '../models/DiveLog';

// ─────────────────────────────────────────────────────────────────────────────
// DiveLogRepository — platform-agnostic interface.
// Implement this once per platform (SQLite for mobile, IndexedDB for web).
// ─────────────────────────────────────────────────────────────────────────────

export interface DiveLogFilter {
  locationName?: string;
  fromDate?: string;   // YYYY-MM-DD
  toDate?: string;     // YYYY-MM-DD
  source?: string;
}

export interface DiveLogRepository {
  // ── Write ──────────────────────────────────────────────────────────────────
  create(input: CreateDiveLogInput): Promise<DiveLog>;
  update(id: string, changes: UpdateDiveLogInput): Promise<DiveLog>;
  delete(id: string): Promise<void>;       // Soft delete (sets deletedAt)
  hardDelete(id: string): Promise<void>;   // Permanent — use with caution

  // ── Read ───────────────────────────────────────────────────────────────────
  getById(id: string): Promise<DiveLog | null>;
  getAll(userId: string, filter?: DiveLogFilter): Promise<DiveLog[]>;
  getByDateRange(userId: string, from: string, to: string): Promise<DiveLog[]>;

  // ── Deduplication ──────────────────────────────────────────────────────────
  /** Returns the existing record if a duplicate is found, null otherwise. */
  findDuplicate(userId: string, log: Pick<DiveLog, 'date' | 'entryTime' | 'exitTime' | 'locationName' | 'maxDepth'>): Promise<DiveLog | null>;

  // ── Bulk import ────────────────────────────────────────────────────────────
  /** Inserts multiple records, skipping duplicates. Returns counts. */
  bulkCreate(logs: CreateDiveLogInput[]): Promise<{ created: number; skipped: number }>;
}
