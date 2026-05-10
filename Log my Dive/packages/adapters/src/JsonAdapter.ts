import type { CreateDiveLogInput } from '@log-my-dive/core';
import type { DiveLogAdapter, ParseResult } from './DiveLogAdapter';
import { isValidPartialLog } from './DiveLogAdapter';

// ─────────────────────────────────────────────────────────────────────────────
// JsonAdapter — imports dive logs from a JSON file.
//
// Accepts either a single DiveLog object or an array.
// Supports camelCase and snake_case key names.
// All depth/temp/pressure/weight values must be in metric units.
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function get(obj: AnyRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    const camel = key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    if (obj[key] !== undefined && obj[key] !== '') return obj[key];
    if (obj[camel] !== undefined && obj[camel] !== '') return obj[camel];
  }
  return undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  }
  return undefined;
}

function mapRecord(obj: AnyRecord): Partial<CreateDiveLogInput> {
  return {
    source: 'json',
    date: str(get(obj, 'date')) ?? '',
    entryTime: str(get(obj, 'entry_time', 'entryTime')) ?? '',
    exitTime: str(get(obj, 'exit_time', 'exitTime')) ?? '',
    locationName: str(get(obj, 'location_name', 'locationName', 'location', 'site')) ?? '',
    latitude: num(get(obj, 'latitude', 'lat')),
    longitude: num(get(obj, 'longitude', 'lon', 'lng')),
    maxDepth: num(get(obj, 'max_depth', 'maxDepth')),
    averageDepth: num(get(obj, 'average_depth', 'averageDepth', 'avg_depth')),
    waterTemperature: num(get(obj, 'water_temperature', 'waterTemperature', 'temperature')),
    visibility: num(get(obj, 'visibility', 'vis')),
    tankType: str(get(obj, 'tank_type', 'tankType')) as CreateDiveLogInput['tankType'],
    startPressure: num(get(obj, 'start_pressure', 'startPressure')),
    endPressure: num(get(obj, 'end_pressure', 'endPressure')),
    weight: num(get(obj, 'weight')),
    buddy: str(get(obj, 'buddy', 'dive_buddy', 'diveBuddy')),
    instructor: str(get(obj, 'instructor', 'guide')),
    diveType: str(get(obj, 'dive_type', 'diveType')) as CreateDiveLogInput['diveType'],
    seaCondition: str(get(obj, 'sea_condition', 'seaCondition')) as CreateDiveLogInput['seaCondition'],
    moodRating: num(get(obj, 'mood_rating', 'moodRating')) as CreateDiveLogInput['moodRating'],
    notes: str(get(obj, 'notes', 'diary', 'comments')),
  };
}

export class JsonAdapter implements DiveLogAdapter {
  readonly sourceName = 'JSON File';
  readonly sourceKey = 'json';
  readonly isAvailable = true;

  async parse(rawData: string | object): Promise<ParseResult> {
    const errors: { row: number; message: string }[] = [];
    let parsed: unknown;

    if (typeof rawData === 'string') {
      try {
        parsed = JSON.parse(rawData);
      } catch {
        return { records: [], errors: [{ row: 0, message: 'Invalid JSON: could not parse the file.' }] };
      }
    } else {
      parsed = rawData;
    }

    const items: AnyRecord[] = Array.isArray(parsed) ? parsed : [parsed];
    const records: Partial<CreateDiveLogInput>[] = [];

    items.forEach((item, i) => {
      if (typeof item !== 'object' || item === null) {
        errors.push({ row: i + 1, message: `Row ${i + 1} is not an object.` });
        return;
      }
      records.push(mapRecord(item as AnyRecord));
    });

    return { records, errors };
  }

  validate(record: Partial<CreateDiveLogInput>): boolean {
    return isValidPartialLog(record);
  }
}
