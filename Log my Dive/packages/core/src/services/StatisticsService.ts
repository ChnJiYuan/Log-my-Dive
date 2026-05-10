import type { DiveLog } from '../models/DiveLog';

// ─────────────────────────────────────────────────────────────────────────────
// StatisticsService — computes derived stats from a collection of DiveLogs.
// Pure functions: no DB access, no side effects. Feed it whatever the
// repository returns and get stats back.
// ─────────────────────────────────────────────────────────────────────────────

export interface DiveStats {
  totalDives: number;
  totalDiveTimeMinutes: number;
  maxDepthEver: number | null;
  lastDive: DiveLog | null;
  mostVisitedSites: { locationName: string; count: number }[];
  divesPerYear: { year: number; count: number }[];
  sourceBreakdown: { source: string; count: number }[];
}

export function computeStats(logs: DiveLog[]): DiveStats {
  const active = logs.filter((l) => !l.deletedAt);

  // Total dives
  const totalDives = active.length;

  // Total dive time
  const totalDiveTimeMinutes = active.reduce(
    (sum, l) => sum + l.durationMinutes,
    0
  );

  // Max depth
  const depths = active.map((l) => l.maxDepth).filter((d): d is number => d != null);
  const maxDepthEver = depths.length > 0 ? Math.max(...depths) : null;

  // Last dive (most recent by date + entryTime)
  const sorted = [...active].sort((a, b) =>
    `${b.date}T${b.entryTime}`.localeCompare(`${a.date}T${a.entryTime}`)
  );
  const lastDive = sorted[0] ?? null;

  // Most visited sites
  const siteCounts = new Map<string, number>();
  for (const log of active) {
    siteCounts.set(log.locationName, (siteCounts.get(log.locationName) ?? 0) + 1);
  }
  const mostVisitedSites = [...siteCounts.entries()]
    .map(([locationName, count]) => ({ locationName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Dives per year
  const yearCounts = new Map<number, number>();
  for (const log of active) {
    const year = Number(log.date.slice(0, 4));
    yearCounts.set(year, (yearCounts.get(year) ?? 0) + 1);
  }
  const divesPerYear = [...yearCounts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => a.year - b.year);

  // Source breakdown
  const sourceCounts = new Map<string, number>();
  for (const log of active) {
    sourceCounts.set(log.source, (sourceCounts.get(log.source) ?? 0) + 1);
  }
  const sourceBreakdown = [...sourceCounts.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalDives,
    totalDiveTimeMinutes,
    maxDepthEver,
    lastDive,
    mostVisitedSites,
    divesPerYear,
    sourceBreakdown,
  };
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function formatDiveTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
