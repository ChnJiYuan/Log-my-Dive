import { Link } from 'react-router-dom';

// Placeholder — wire to DiveLogRepository in Milestone 3
const MOCK_LOGS = [
  { id: '1', locationName: 'Blue Corner, Palau', date: '2026-04-12', durationMinutes: 52, maxDepth: 28, source: 'manual' },
  { id: '2', locationName: 'Manta Point, Komodo', date: '2026-03-03', durationMinutes: 44, maxDepth: 22, source: 'csv' },
];

export function Home() {
  return (
    <div style={styles.container}>
      {MOCK_LOGS.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: 48 }}>🤿</span>
          <p style={styles.emptyTitle}>No dives yet</p>
          <p style={styles.emptySubtitle}>Tap + to log your first dive</p>
        </div>
      ) : (
        <div style={styles.list}>
          {MOCK_LOGS.map((log) => (
            <Link key={log.id} to={`/log/${log.id}`} style={styles.cardLink}>
              <div style={styles.card}>
                <p style={styles.cardLocation}>{log.locationName}</p>
                <p style={styles.cardDate}>{log.date}</p>
                <div style={styles.cardRow}>
                  {log.maxDepth && <span style={styles.cardStat}>↓ {log.maxDepth}m</span>}
                  <span style={styles.cardStat}>⏱ {log.durationMinutes}min</span>
                </div>
                <p style={styles.cardSource}>{log.source}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link to="/log/create" style={styles.fab}>+</Link>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { flex: 1, padding: 16, position: 'relative', minHeight: 'calc(100dvh - 120px)' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: '#0A2342' },
  emptySubtitle: { fontSize: 14, color: '#8FA3B1' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  cardLink: { textDecoration: 'none' },
  card: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardLocation: { fontSize: 16, fontWeight: 600, color: '#0A2342' },
  cardDate: { fontSize: 13, color: '#8FA3B1' },
  cardRow: { display: 'flex', gap: 12, marginTop: 4 },
  cardStat: { fontSize: 13, color: '#4FC3F7', fontWeight: 500 },
  cardSource: { fontSize: 11, color: '#B0C4D4', textTransform: 'uppercase', marginTop: 6 },
  fab: {
    position: 'fixed',
    bottom: 72,
    right: 'calc(50% - 224px)',
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#FF6B6B',
    color: '#FFFFFF',
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(255,107,107,0.45)',
    lineHeight: 1,
  },
};
