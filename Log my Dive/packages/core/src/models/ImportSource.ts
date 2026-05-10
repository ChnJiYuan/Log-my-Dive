export type ImportSourceType = 'manual' | 'csv' | 'json' | 'api';
export type ImportSourceStatus = 'active' | 'error' | 'pending' | 'disabled';

export interface ImportSource {
  id: string;
  userId: string;
  name: string;               // Human-readable: "CSV Import – May 2026"
  type: ImportSourceType;
  status: ImportSourceStatus;
  recordCount: number;        // How many DiveLogs came from this source
  lastSyncedAt?: string;      // ISO 8601 datetime
  createdAt: string;
}

export interface ImportResult {
  sourceId: string;
  imported: number;
  skipped: number;            // Duplicates
  failed: number;
  errors: string[];           // Human-readable error messages
}
