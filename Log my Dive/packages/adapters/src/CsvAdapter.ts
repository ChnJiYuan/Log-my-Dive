import Papa from 'papaparse';
import type { CreateDiveLogInput } from '@log-my-dive/core';
import type { DiveLogAdapter, ParseResult } from './DiveLogAdapter';
import { isValidPartialLog } from './DiveLogAdapter';

// ─────────────────────────────────────────────────────────────────────────────
// CsvAdapter — imports dive logs from a CSV file.
//
// Expected CSV columns (case-insensitive, snake_case or camelCase):
//   date, entry_time, exit_time, location_name,
//   max_depth, average_depth, water_temperature, visibility,
//   tank_type, start_pressure, end_pressure, weight,
//   buddy, instructor, dive_type, sea_condition,
//   mood_rating, notes
//
// All depth/temp/pressure/weight values must be in metric units (m, °C, bar, kg).
// ─────────────────────────────────────────────────────────────────────────────

type RawRow = Record<string, string>;

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[\s-]/g, '_');
}

function get(row: RawRow, ...keys: string[]): string | undefined {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [normalizeKey(k), v])
  );
  for (const key of keys) {
    const val = normalized[normalizeKey(key)];
    if (val !== undefined && val.trim() !== '') return val.trim();
  }
  return undefined;
}

function num(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
}

function mapRow(row: RawRow, rowIndex: number, userId: string): Partial<CreateDiveLogInput> {
  return {
    userId,
    source: 'csv',
    date: get(row, 'date') ?? '',
    entryTime: get(row, 'entry_time', 'entryTime', 'entry_time') ?? '',
    exitTime: get(row, 'exit_time', 'exitTime', 'exit_time') ?? '',
    locationName: get(row, 'location_name', 'locationName', 'location', 'site') ?? '',
    latitude: num(get(row, 'latitude', 'lat')),
    longitude: num(get(row, 'longitude', 'lon', 'lng')),
    maxDepth: num(get(row, 'max_depth', 'maxDepth', 'maximum_depth')),
    averageDepth: num(get(row, 'average_depth', 'averageDepth', 'avg_depth')),
    waterTemperature: num(get(row, 'water_temperature', 'waterTemperature', 'temp', 'temperature')),
    visibility: num(get(row, 'visibility', 'vis')),
    startPressure: num(get(row, 'start_pressure', 'startPressure', 'tank_start')),
    endPressure: num(get(row, 'end_pressure', 'endPressure', 'tank_end')),
    weight: num(get(row, 'weight', 'ballast')),
    buddy: get(row, 'buddy', 'dive_buddy', 'diveBuddy'),
    instructor: get(row, 'instructor', 'guide', 'dive_guide'),
    notes: get(row, 'notes', 'diary', 'comments', 'description'),
  };
}

export class CsvAdapter implements DiveLogAdapter {
  readonly sourceName = 'CSV File';
  readonly sourceKey = 'csv';
  readonly isAvailable = true;

  async parse(rawData: string | object): Promise<ParseResult> {
    if (typeof rawData !== 'string') {
      return { records: [], errors: [{ row: 0, message: 'CsvAdapter expects a string input.' }] };
    }

    const result = Papa.parse<RawRow>(rawData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
    });

    const records: Partial<CreateDiveLogInput>[] = [];
    const errors: { row: number; message: string }[] = [];

    // Carry userId from outside context — callers inject it before parsing
    const userId = 'pending'; // replaced by the import service at write time

    result.data.forEach((row, i) => {
      const record = mapRow(row, i + 2, userId); // row 1 is headers
      records.push(record);
    });

    result.errors.forEach((e) => {
      errors.push({ row: e.row ?? 0, message: e.message });
    });

    return { records, errors };
  }

  validate(record: Partial<CreateDiveLogInput>): boolean {
    return isValidPartialLog(record);
  }
}
