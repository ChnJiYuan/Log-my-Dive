import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function SettingsPage() {
  const { isMetric, setIsMetric, repo, userId } = useApp();
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    if (!confirm('Delete ALL dive data? This cannot be undone.')) return;
    setClearing(true);
    await (repo as unknown as { clearAll: (u: string) => Promise<void> }).clearAll(userId);
    setClearing(false);
    alert('All dive data cleared.');
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={s.heading}>Settings</h1>

      {/* Units */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Units</p>
        <div style={s.row}>
          <div>
            <p style={s.rowLabel}>{isMetric ? 'Metric' : 'Imperial'}</p>
            <p style={s.rowSub}>{isMetric ? 'Metres, °C, bar, kg' : 'Feet, °F, psi, lbs'}</p>
          </div>
          <button
            style={{ ...s.toggle, background: isMetric ? '#0A2342' : '#4FC3F7' }}
            onClick={() => setIsMetric(!isMetric)}
          >
            {isMetric ? 'Imperial' : 'Metric'}
          </button>
        </div>
      </div>

      {/* Data */}
      <div style={s.section}>
        <p style={s.sectionTitle}>Data</p>
        <p style={{ fontSize: 13, color: '#8FA3B1', margin: 0 }}>
          All dive data is stored locally on this device using IndexedDB.
        </p>
        <button style={s.dangerBtn} onClick={handleClear} disabled={clearing}>
          {clearing ? 'Clearing…' : 'Clear all dive data'}
        </button>
      </div>

      {/* About */}
      <div style={s.section}>
        <p style={s.sectionTitle}>About</p>
        <div style={s.row}>
          <p style={s.rowLabel}>Log my Dive</p>
          <p style={s.rowSub}>v1.0.0 (MVP)</p>
        </div>
        <p style={{ fontSize: 12, color: '#B0C4D4', margin: 0 }}>
          All values are stored in metric (m, °C, bar, kg) and converted at display time.
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  heading: { fontSize: 18, color: '#0A2342', margin: 0 },
  section: {
    background: '#FFF', borderRadius: 12, padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 12,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, color: '#8FA3B1',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0,
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, color: '#0A2342', fontWeight: 500, margin: 0 },
  rowSub: { fontSize: 13, color: '#8FA3B1', marginTop: 2, marginBottom: 0 },
  toggle: {
    color: '#FFF', border: 'none', borderRadius: 8, padding: '8px 14px',
    cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap',
  },
  dangerBtn: {
    background: 'transparent', color: '#FF6B6B', border: '1px solid #FF6B6B',
    borderRadius: 8, padding: '10px 0', cursor: 'pointer', fontWeight: 600, fontSize: 14,
  },
};
