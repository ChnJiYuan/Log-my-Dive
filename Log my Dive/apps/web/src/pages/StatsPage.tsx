import { computeStats, formatDiveTime } from '@log-my-dive/core';
import type { DiveLog } from '@log-my-dive/core';

// Placeholder — replace with real data from DiveLogRepository in Milestone 7
const MOCK_LOGS: DiveLog[] = [];

export function StatsPage() {
  const stats = computeStats(MOCK_LOGS);

  if (MOCK_LOGS.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={{ fontSize: 48 }}>📊</span>
        <p style={{ fontSize: 20, fontWeight: 600, color: '#0A2342' }}>No stats yet</p>
        <p style={{ fontSize: 14, color: '#8FA3B1' }}>Start logging dives to see your stats</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <StatCard label="Total Dives" value={String(stats.totalDives)} unit="dives" />
        <StatCard label="Dive Time" value={formatDiveTime(stats.totalDiveTimeMinutes)} unit="total" />
        <StatCard label="Max Depth" value={stats.maxDepthEver != null ? `${stats.maxDepthEver}m` : '—'} unit="record" />
        <StatCard label="Last Dive" value={stats.lastDive?.date ?? '—'} unit={stats.lastDive?.locationName ?? ''} />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div style={styles.card}>
      <p style={styles.value}>{value}</p>
      <p style={styles.unit}>{unit}</p>
      <p style={styles.label}>{label}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 16 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 80 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  card: { background: '#FFF', borderRadius: 12, padding: 16, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  value: { fontSize: 28, fontWeight: 700, color: '#0A2342' },
  unit: { fontSize: 12, color: '#4FC3F7', fontWeight: 600, marginTop: 2 },
  label: { fontSize: 12, color: '#8FA3B1', marginTop: 4 },
};
