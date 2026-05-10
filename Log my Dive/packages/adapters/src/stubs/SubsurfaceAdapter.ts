import type { DiveLogAdapter, ParseResult } from '../DiveLogAdapter';
import type { CreateDiveLogInput } from '@log-my-dive/core';

/**
 * SubsurfaceAdapter — STUB (not yet implemented).
 *
 * Future implementation will parse Subsurface XML export files (.ssrf).
 *
 * To implement: replace parse() with XML parsing logic for the Subsurface format
 * and set isAvailable = true.
 */
export class SubsurfaceAdapter implements DiveLogAdapter {
  readonly sourceName = 'Subsurface';
  readonly sourceKey = 'subsurface';
  readonly isAvailable = false;

  async parse(_rawData: string | object): Promise<ParseResult> {
    throw new Error('SubsurfaceAdapter is not yet implemented.');
  }

  validate(_record: Partial<CreateDiveLogInput>): boolean {
    return false;
  }
}
