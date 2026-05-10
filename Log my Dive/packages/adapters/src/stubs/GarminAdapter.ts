import type { DiveLogAdapter, ParseResult } from '../DiveLogAdapter';
import type { CreateDiveLogInput } from '@log-my-dive/core';

/**
 * GarminAdapter — STUB (not yet implemented).
 *
 * Future implementation will parse Garmin Descent dive exports
 * (FIT files or CSV from Garmin Connect).
 *
 * To implement: replace parse() with real FIT/CSV parsing logic
 * and set isAvailable = true.
 */
export class GarminAdapter implements DiveLogAdapter {
  readonly sourceName = 'Garmin Descent';
  readonly sourceKey = 'garmin';
  readonly isAvailable = false;

  async parse(_rawData: string | object): Promise<ParseResult> {
    throw new Error('GarminAdapter is not yet implemented.');
  }

  validate(_record: Partial<CreateDiveLogInput>): boolean {
    return false;
  }
}
