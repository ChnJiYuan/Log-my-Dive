import { v4 as uuidv4 } from 'uuid';
import type { DiveLog, CreateDiveLogInput, UpdateDiveLogInput } from '@log-my-dive/core';
import type { DiveLogRepository, DiveLogFilter } from '@log-my-dive/core';
import { calcDurationMinutes, dedupKey } from '@log-my-dive/core';

const DB_NAME = 'log-my-dive';
const DB_VERSION = 1;
const STORE = 'diveLogs';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db: IDBDatabase, log: DiveLog): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(log);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbGet(db: IDBDatabase, id: string): Promise<DiveLog | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll(db: IDBDatabase): Promise<DiveLog[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as DiveLog[]);
    req.onerror = () => reject(req.error);
  });
}

function idbDelete(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export class IndexedDBRepository implements DiveLogRepository {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = openDB();
  }

  async create(input: CreateDiveLogInput): Promise<DiveLog> {
    const db = await this.dbPromise;
    const now = new Date().toISOString();
    const log: DiveLog = {
      ...input,
      id: uuidv4(),
      durationMinutes: calcDurationMinutes(input.entryTime, input.exitTime),
      createdAt: now,
      updatedAt: now,
    };
    await idbPut(db, log);
    return log;
  }

  async update(id: string, changes: UpdateDiveLogInput): Promise<DiveLog> {
    const db = await this.dbPromise;
    const existing = await idbGet(db, id);
    if (!existing) throw new Error(`DiveLog ${id} not found`);
    const merged: DiveLog = { ...existing, ...changes, id, updatedAt: new Date().toISOString() };
    const entryChanged = changes.entryTime !== undefined || changes.exitTime !== undefined;
    if (entryChanged) {
      merged.durationMinutes = calcDurationMinutes(merged.entryTime, merged.exitTime);
    }
    await idbPut(db, merged);
    return merged;
  }

  async delete(id: string): Promise<void> {
    const db = await this.dbPromise;
    const existing = await idbGet(db, id);
    if (!existing) return;
    await idbPut(db, { ...existing, deletedAt: new Date().toISOString() });
  }

  async hardDelete(id: string): Promise<void> {
    const db = await this.dbPromise;
    await idbDelete(db, id);
  }

  async getById(id: string): Promise<DiveLog | null> {
    const db = await this.dbPromise;
    return idbGet(db, id);
  }

  async getAll(userId: string, filter?: DiveLogFilter): Promise<DiveLog[]> {
    const db = await this.dbPromise;
    const all = await idbGetAll(db);
    let result = all.filter((l) => l.userId === userId && !l.deletedAt);

    if (filter?.locationName) {
      const q = filter.locationName.toLowerCase();
      result = result.filter((l) => l.locationName.toLowerCase().includes(q));
    }
    if (filter?.fromDate) result = result.filter((l) => l.date >= filter.fromDate!);
    if (filter?.toDate) result = result.filter((l) => l.date <= filter.toDate!);
    if (filter?.source) result = result.filter((l) => l.source === filter.source);

    return result.sort((a, b) =>
      `${b.date}T${b.entryTime}`.localeCompare(`${a.date}T${a.entryTime}`)
    );
  }

  async getByDateRange(userId: string, from: string, to: string): Promise<DiveLog[]> {
    return this.getAll(userId, { fromDate: from, toDate: to });
  }

  async findDuplicate(
    userId: string,
    log: Pick<DiveLog, 'date' | 'entryTime' | 'exitTime' | 'locationName' | 'maxDepth'>
  ): Promise<DiveLog | null> {
    const all = await this.getAll(userId);
    const key = dedupKey(log);
    return all.find((l) => dedupKey(l) === key) ?? null;
  }

  async bulkCreate(logs: CreateDiveLogInput[]): Promise<{ created: number; skipped: number }> {
    let created = 0;
    let skipped = 0;
    for (const input of logs) {
      const dup = await this.findDuplicate(input.userId, {
        date: input.date,
        entryTime: input.entryTime,
        exitTime: input.exitTime,
        locationName: input.locationName,
        maxDepth: input.maxDepth,
      });
      if (dup) {
        skipped++;
      } else {
        await this.create(input);
        created++;
      }
    }
    return { created, skipped };
  }

  async clearAll(userId: string): Promise<void> {
    const db = await this.dbPromise;
    const all = await idbGetAll(db);
    const userLogs = all.filter((l) => l.userId === userId);
    for (const log of userLogs) {
      await idbDelete(db, log.id);
    }
  }
}
