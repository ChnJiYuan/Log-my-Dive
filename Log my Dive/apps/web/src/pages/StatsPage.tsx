import { useState, useEffect } from 'react';
import type { DiveLog } from '@log-my-dive/core';
import { computeStats, formatDiveTime } from '@log-my-dive/core';
import { useApp } from '../context/AppContext';

export function StatsPage() {
  const { repo, userId, isMetric } = useApp();
  const [logs, setLogs] = useState<DiveLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    repo.getAll(userId).then(setLogs).finally(() => setLoading(false));
  }, [repo, userId]);

  if (loading) {
    return <div style={{ padding: 16, color: '#8FA3B1' }}>Loading…</div>;
  }

  if (logs.length === 0) {
    return (
      <div style={s.empty}>
        <span style={{ fontSize: 48 }}>📊</span>
        <p style={s.emptyTitle}>No stats yet</p>
        <p style={s.emptyHint}>Start logging dives to see your stats</p>
      </div>
    );
  }

  const stats = computeStats(logs);
  const depthLabel = isMetric ? 'm' : 'ft';
  const maxDepthDisplay = stats.maxDepthEver != null
    ? isMetric
      ? `${stats.maxDepthEver}${depthLabel}`
      : `${Math.round(stats.maxDepthEver * 3.28084)}${depthLabel}`
    : '—';

  const maxBarValue = Math.max(...stats.divesPerYear.map((d) => d.count), 1);

  return (
    <div style={s.container}>
      {/* Top-line stats */}
      <div style={s.grid}>
        <StatCard label="Total Dives" value={String(stats.totalDives)} unit="dives" color="#4FC3F7" />
        <StatCard label="Dive Time" value={formatDiveTime(stats.totalDiveTimeMinutes)} unit="total" color="#81C784" />
        <StatCard label="Max Depth" value={maxDepthDisplay} unit="record" color="#FF6B6B" />
        <StatCard
          label="Last Dive"
          value={stats.lastDive?.date ?? '—'}
          unit={stats.lastDive?.locationName ?? ''}
          color="#FFB74D"
        />
      </div>

      {/* Most visited sites */}
      {stats.mostVisitedSites.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionTitle}>Top dive sites</p>
          {stats.mostVisitedSites.map((site, i) => (
            <div key={site.locationName} style={s.siteRow}>
              <span style={s.siteRank}>#{i + 1}</span>
              <span style={s.siteName}>{site.locationName}</span>
              <span style={s.siteCount}>{site.count} dive{site.count !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dives per year */}
      {stats.divesPerYear.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionTitle}>Dives per year</p>
          {stats.divesPerYear.map(({ year, count }) => (
            <div key={year} style={s.yearRow}>
              <span style={s.yearLabel}>{year}</span>
              <div style={s.barTrack}>
                <div
                  style={{
                    ...s.bar,
                    width: `${Math.round((count / maxBarValue) * 100)}%`,
                  }}
                />
              </div>
              <span style={s.yearCount}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Source breakdown */}
      {stats.sourceBreakdown.length > 0 && (
        <div style={s.section}>
          <p style={s.sectionTitle}>Data sources</p>
          {stats.sourceBreakdown.map(({ source, count }) => (
            <div key={source} style={s.siteRow}>
              <span style={s.siteName}>{source}</span>
              <span style={s.siteCount}>{count} record{count !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div style={{ ...s.card, borderTop: `3px solid ${color}` }}>
      <p style={s.cardValue}>{value}</p>
      {unit && <p style={{ ...s.cardUnit, color }}>{unit}</p>}
      <p style={s.cardLabel}>{label}</p>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingTop: 80,
  },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: '#0A2342', margin: 0 },
  emptyHint: { fontSize: 14, color: '#8FA3B1', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  card: {
    background: '#FFF', borderRadius: 12, padding: '14px 12px',
    textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  cardValue: { fontSize: 26, fontWeight: 700, color: '#0A2342', margin: 0 },
  cardUnit: { fontSize: 11, fontWeight: 700, marginTop: 2, marginBottom: 0 },
  cardLabel: { fontSize: 12, color: '#8FA3B1', marginTop: 4, marginBottom: 0 },
  section: {
    background: '#FFF', borderRadius: 12, padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 10,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, color: '#8FA3B1',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0,
  },
  siteRow: { display: 'flex', alignItems: 'center', gap: 8 },
  siteRank: { fontSize: 13, color: '#B0C4D4', width: 28, flexShrink: 0 },
  siteName: { fontSize: 14, color: '#0A2342', fontWeight: 500, flex: 1 },
  siteCount: { fontSize: 13, color: '#4FC3F7', fontWeight: 600 },
  yearRow: { display: 'flex', alignItems: 'center', gap: 10 },
  yearLabel: { fontSize: 13, color: '#8FA3B1', width: 40, flexShrink: 0 },
  barTrack: { flex: 1, background: '#E8EFF4', borderRadius: 4, height: 10, overflow: 'hidden' },
  bar: { background: '#4FC3F7', height: '100%', borderRadius: 4, transition: 'width 0.4s ease' },
  yearCount: { fontSize: 13, fontWeight: 700, color: '#0A2342', width: 24, textAlign: 'right' },
};
