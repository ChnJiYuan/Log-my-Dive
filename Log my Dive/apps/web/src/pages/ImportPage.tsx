import { useRef, useState } from 'react';
import type { CreateDiveLogInput } from '@log-my-dive/core';
import { CsvAdapter, JsonAdapter } from '@log-my-dive/adapters';
import { useApp } from '../context/AppContext';

type AdapterType = 'csv' | 'json';

interface Preview {
  records: Partial<CreateDiveLogInput>[];
  errors: { row: number; message: string }[];
  adapterType: AdapterType;
  rawData: string;
}

const csvAdapter = new CsvAdapter();
const jsonAdapter = new JsonAdapter();

export function ImportPage() {
  const { repo, userId } = useApp();
  const csvInput = useRef<HTMLInputElement>(null);
  const jsonInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);

  const handleFile = async (file: File, type: AdapterType) => {
    setResult(null);
    const rawData = await file.text();
    const adapter = type === 'csv' ? csvAdapter : jsonAdapter;
    const { records, errors } = await adapter.parse(rawData);
    setPreview({ records, errors, adapterType: type, rawData });
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    try {
      const valid = preview.records
        .filter((r) => r.date && r.entryTime && r.exitTime && r.locationName)
        .map((r) => ({ ...r, userId, source: preview.adapterType } as CreateDiveLogInput));
      const res = await repo.bulkCreate(valid);
      setResult(res);
      setPreview(null);
    } finally {
      setImporting(false);
    }
  };

  const stubs = [
    { label: 'Garmin Descent', description: 'Import from Garmin Connect.' },
    { label: 'Subsurface', description: 'Import .ssrf files.' },
    { label: 'PADI', description: 'Import from PADI eLearning export.' },
  ];

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={s.heading}>Import dive records</h1>
      <p style={s.sub}>Bring logs from other apps into one place.</p>

      {/* Result banner */}
      {result && (
        <div style={s.banner}>
          ✅ Imported {result.created} record{result.created !== 1 ? 's' : ''}.
          {result.skipped > 0 && ` ${result.skipped} duplicate${result.skipped !== 1 ? 's' : ''} skipped.`}
        </div>
      )}

      {/* Live adapters */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <strong style={{ color: '#0A2342' }}>CSV File</strong>
        </div>
        <p style={s.desc}>Import from any .csv dive export. Columns: date, entry_time, exit_time, location_name, max_depth, …</p>
        <input
          ref={csvInput}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, 'csv'); e.target.value = ''; }}
        />
        <button style={s.btn} onClick={() => csvInput.current?.click()}>Choose CSV file</button>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <strong style={{ color: '#0A2342' }}>JSON File</strong>
        </div>
        <p style={s.desc}>Import using the Log my Dive JSON schema — an array of dive log objects.</p>
        <input
          ref={jsonInput}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f, 'json'); e.target.value = ''; }}
        />
        <button style={s.btn} onClick={() => jsonInput.current?.click()}>Choose JSON file</button>
      </div>

      {/* Preview panel */}
      {preview && (
        <div style={s.preview}>
          <p style={s.previewTitle}>
            Preview — {preview.records.length} record{preview.records.length !== 1 ? 's' : ''} found
            {preview.errors.length > 0 && `, ${preview.errors.length} parse error${preview.errors.length !== 1 ? 's' : ''}`}
          </p>

          {preview.errors.length > 0 && (
            <div style={s.errors}>
              {preview.errors.slice(0, 5).map((e, i) => (
                <p key={i} style={{ color: '#FF6B6B', fontSize: 12, margin: 0 }}>
                  Row {e.row}: {e.message}
                </p>
              ))}
            </div>
          )}

          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {preview.records.slice(0, 20).map((r, i) => (
              <div key={i} style={s.previewRow}>
                <span style={{ fontWeight: 600, color: '#0A2342' }}>{r.locationName || '(no location)'}</span>
                <span style={{ color: '#8FA3B1', fontSize: 12 }}>{r.date} {r.entryTime}–{r.exitTime}</span>
              </div>
            ))}
            {preview.records.length > 20 && (
              <p style={{ fontSize: 12, color: '#8FA3B1', margin: 0 }}>
                …and {preview.records.length - 20} more
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button style={s.importBtn} onClick={handleImport} disabled={importing}>
              {importing ? 'Importing…' : `Import ${preview.records.filter((r) => r.date && r.entryTime && r.exitTime && r.locationName).length} valid records`}
            </button>
            <button style={s.cancelBtn} onClick={() => setPreview(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Coming-soon stubs */}
      {stubs.map((a) => (
        <div key={a.label} style={{ ...s.card, opacity: 0.6 }}>
          <div style={s.cardHeader}>
            <strong style={{ color: '#0A2342' }}>{a.label}</strong>
            <span style={s.badge}>Soon</span>
          </div>
          <p style={s.desc}>{a.description}</p>
        </div>
      ))}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  heading: { fontSize: 18, color: '#0A2342', margin: 0 },
  sub: { fontSize: 14, color: '#8FA3B1', margin: 0 },
  banner: {
    background: '#E8F5E9', border: '1px solid #81C784', borderRadius: 10,
    padding: '12px 16px', fontSize: 14, color: '#2E7D32',
  },
  card: {
    background: '#FFF', borderRadius: 12, padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 8,
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  desc: { fontSize: 13, color: '#666', margin: 0 },
  badge: {
    fontSize: 11, color: '#8FA3B1', background: '#E8EFF4',
    borderRadius: 6, padding: '2px 8px', fontWeight: 600,
  },
  btn: {
    background: '#0A2342', color: '#FFF', border: 'none', borderRadius: 8,
    padding: '10px 0', cursor: 'pointer', fontWeight: 600, fontSize: 14, marginTop: 4,
  },
  preview: {
    background: '#FFF', borderRadius: 12, padding: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 10,
    border: '2px solid #4FC3F7',
  },
  previewTitle: { fontSize: 14, fontWeight: 700, color: '#0A2342', margin: 0 },
  errors: { display: 'flex', flexDirection: 'column', gap: 4 },
  previewRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#F5F8FA', borderRadius: 8, padding: '8px 12px',
  },
  importBtn: {
    flex: 1, background: '#FF6B6B', color: '#FFF', border: 'none',
    borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
  cancelBtn: {
    background: '#E8EFF4', color: '#0A2342', border: 'none',
    borderRadius: 8, padding: '12px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
};
