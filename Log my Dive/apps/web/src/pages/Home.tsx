import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { DiveLog } from '@log-my-dive/core';
import { useApp } from '../context/AppContext';

export function Home() {
  const { repo, userId } = useApp();
  const [logs, setLogs] = useState<DiveLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    repo
      .getAll(userId, search ? { locationName: search } : undefined)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [repo, userId, search]);

  return (
    <div style={s.container}>
      {/* Search bar */}
      <div style={s.searchWrap}>
        <input
          style={s.search}
          type="search"
          placeholder="Search by location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={s.hint}>Loading…</p>
      ) : logs.length === 0 ? (
        <div style={s.empty}>
          <span style={{ fontSize: 52 }}>🤿</span>
          <p style={s.emptyTitle}>{search ? 'No results' : 'No dives yet'}</p>
          <p style={s.emptyHint}>
            {search ? 'Try a different location name' : 'Tap + to log your first dive'}
          </p>
        </div>
      ) : (
        <div style={s.list}>
          {logs.map((log) => (
            <DiveLogCard key={log.id} log={log} />
          ))}
        </div>
      )}

      <Link to="/log/create" style={s.fab} aria-label="New dive log">+</Link>
    </div>
  );
}

function DiveLogCard({ log }: { log: DiveLog }) {
  return (
    <Link to={`/log/${log.id}`} style={s.cardLink}>
      <div style={s.card}>
        <div style={s.cardTop}>
          <p style={s.location}>{log.locationName}</p>
          <span style={{ ...s.badge, background: sourceColor(log.source) }}>{log.source}</span>
        </div>
        <p style={s.date}>{formatDate(log.date)}</p>
        <div style={s.statsRow}>
          {log.maxDepth != null && (
            <span style={s.stat}>↓ {log.maxDepth}m</span>
          )}
          <span style={s.stat}>⏱ {log.durationMinutes}min</span>
          {log.waterTemperature != null && (
            <span style={s.stat}>🌡 {log.waterTemperature}°C</span>
          )}
          {log.buddy && <span style={s.stat}>👤 {log.buddy}</span>}
        </div>
        {log.notes && (
          <p style={s.notePreview}>{log.notes.slice(0, 80)}{log.notes.length > 80 ? '…' : ''}</p>
        )}
        {log.moodRating && (
          <div style={s.mood}>{'★'.repeat(log.moodRating)}{'☆'.repeat(5 - log.moodRating)}</div>
        )}
      </div>
    </Link>
  );
}

function sourceColor(source: string): string {
  switch (source) {
    case 'manual': return '#4FC3F7';
    case 'csv': return '#81C784';
    case 'json': return '#FFB74D';
    default: return '#B0C4D4';
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch {
    return iso;
  }
}

const s: Record<string, React.CSSProperties> = {
  container: { padding: 16, position: 'relative', minHeight: 'calc(100dvh - 120px)' },
  searchWrap: { marginBottom: 16 },
  search: {
    width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 10,
    border: '1px solid #E0EAF0', fontSize: 15, background: '#FFFFFF',
    color: '#0A2342', outline: 'none',
  },
  hint: { color: '#8FA3B1', textAlign: 'center', marginTop: 40 },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingTop: 60,
  },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: '#0A2342', margin: 0 },
  emptyHint: { fontSize: 14, color: '#8FA3B1', margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  cardLink: { textDecoration: 'none' },
  card: {
    background: '#FFFFFF', borderRadius: 12, padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  location: { fontSize: 16, fontWeight: 700, color: '#0A2342', margin: 0, flex: 1 },
  badge: {
    fontSize: 10, fontWeight: 700, color: '#FFF', borderRadius: 6,
    padding: '2px 7px', textTransform: 'uppercase', flexShrink: 0,
  },
  date: { fontSize: 13, color: '#8FA3B1', margin: 0 },
  statsRow: { display: 'flex', flexWrap: 'wrap', gap: 10 },
  stat: { fontSize: 13, color: '#4FC3F7', fontWeight: 600 },
  notePreview: { fontSize: 13, color: '#666', margin: 0, lineHeight: 1.4 },
  mood: { fontSize: 14, color: '#FF6B6B', letterSpacing: 1 },
  fab: {
    position: 'fixed', bottom: 72,
    right: 'max(16px, calc(50% - 224px))',
    width: 56, height: 56, borderRadius: '50%',
    background: '#FF6B6B', color: '#FFFFFF', fontSize: 28,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,107,107,0.45)',
    lineHeight: 1,
  },
};
