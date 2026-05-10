export function ImportPage() {
  const adapters = [
    { label: 'CSV File', description: 'Import from any .csv dive export.', available: true },
    { label: 'JSON File', description: 'Import using the Log my Dive JSON schema.', available: true },
    { label: 'Garmin Descent', description: 'Import from Garmin Connect.', available: false },
    { label: 'Subsurface', description: 'Import .ssrf files.', available: false },
  ];

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1 style={{ fontSize: 18, color: '#0A2342', marginBottom: 4 }}>Import dive records</h1>
      <p style={{ fontSize: 14, color: '#8FA3B1' }}>Bring logs from other apps into one place.</p>

      {adapters.map((a) => (
        <div key={a.label} style={styles.card}>
          <div style={styles.cardHeader}>
            <strong style={{ color: '#0A2342' }}>{a.label}</strong>
            {!a.available && <span style={styles.badge}>Soon</span>}
          </div>
          <p style={{ fontSize: 13, color: '#666' }}>{a.description}</p>
          {a.available && (
            <button style={styles.btn} onClick={() => alert('File picker — coming in Milestone 6')}>
              Choose file
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#FFF', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 8 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { fontSize: 11, color: '#8FA3B1', background: '#E8EFF4', borderRadius: 6, padding: '2px 8px', fontWeight: 600 },
  btn: { background: '#0A2342', color: '#FFF', border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontWeight: 600, fontSize: 14, marginTop: 4 },
};
