/**
 * useDiveLogs / useDiveLog
 *
 * Placeholder hooks. Replace the in-memory store with a real
 * DiveLogRepository (SQLite) implementation in Milestone 1.
 */
import { useState, useEffect } from 'react';
import type { DiveLog } from '@log-my-dive/core';

// ── In-memory store (dev only) ────────────────────────────────────────────────
let _store: DiveLog[] = [];

export function useDiveLogs() {
  const [logs, setLogs] = useState<DiveLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async DB read
    const timeout = setTimeout(() => {
      setLogs([..._store].sort((a, b) =>
        `${b.date}T${b.entryTime}`.localeCompare(`${a.date}T${a.entryTime}`)
      ));
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, []);

  return { logs, isLoading };
}

export function useDiveLog(id: string | undefined) {
  const [log, setLog] = useState<DiveLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLog(_store.find((l) => l.id === id) ?? null);
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [id]);

  return { log, isLoading };
}
