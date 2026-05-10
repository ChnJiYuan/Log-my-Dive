import { useState } from 'react';

export function SettingsPage() {
  const [isMetric, setIsMetric] = useState(true);

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontSize: 18, color: '#0A2342' }}>Settings</h1>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>Units</p>
        <div style={styles.row}>
          <div>
            <p style={styles.rowLabel}>{isMetric ? 'Metric' : 'Imperial'}</p>
            <p style={styles.rowSub}>{isMetric ? 'Metres, °C, bar, kg' : 'Feet, °F, psi, lbs'}</p>
          </div>
          <button
            style={{ ...styles.toggle, background: isMetric ? '#0A2342' : '#4FC3F7' }}
            onClick={() => setIsMetric((v) => !v)}
          >
            {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>About</p>
        <div style={styles.row}>
          <p style={styles.rowLabel}>Log my Dive</p>
          <p style={styles.rowSub}>v1.0.0</p>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTitle}>Data</p>
        <button
          style={styles.dangerBtn}
          onClick={() => confirm('Delete all dive data? This cannot be undone.') && alert('Cleared.')}
        >
          Clear all dive data
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { background: '#FFF', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#8FA3B1', textTransform: 'uppercase', letterSpacing: '0.5px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, color: '#0A2342', fontWeight: 500 },
  rowSub: { fontSize: 13, color: '#8FA3B1', marginTop: 2 },
  toggle: { color: '#FFF', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' },
  dangerBtn: { background: 'transparent', color: '#FF6B6B', border: '1px solid #FF6B6B', borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
};
