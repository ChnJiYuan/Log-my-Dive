import type { CreateDiveLogInput } from '@log-my-dive/core';

// ─────────────────────────────────────────────────────────────────────────────
// DiveLogAdapter — base interface every import source must implement.
//
// The adapter pattern keeps all source-specific parsing logic isolated.
// Adding a new source (Garmin, Subsurface, PADI) means adding one file
// that implements this interface — no changes elsewhere in the app.
// ─────────────────────────────────────────────────────────────────────────────

export interface ParseResult {
  records: Partial<CreateDiveLogInput>[];
  errors: { row: number; message: string }[];
}

export interface DiveLogAdapter {
  /** Human-readable name, shown in the Import screen. */
  readonly sourceName: string;

  /** Machine key stored on each DiveLog record. */
  readonly sourceKey: string;

  /** Whether this adapter is implemented and ready to use. */
  readonly isAvailable: boolean;

  /**
   * Parse raw input (string for file-based sources, object for API sources)
   * and return an array of partial DiveLog records.
   * The caller is responsible for deduplication and DB writes.
   */
  parse(rawData: string | object): Promise<ParseResult>;

  /**
   * Validate a single parsed record.
   * Returns true if the record has enough data to be saved.
   */
  validate(record: Partial<CreateDiveLogInput>): boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared validation helper used by all adapters
// ─────────────────────────────────────────────────────────────────────────────

export function isValidPartialLog(record: Partial<CreateDiveLogInput>): boolean {
  return (
    typeof record.date === 'string' &&
    record.date.length === 10 &&
    typeof record.entryTime === 'string' &&
    typeof record.exitTime === 'string' &&
    typeof record.locationName === 'string' &&
    record.locationName.trim().length > 0
  );
}
