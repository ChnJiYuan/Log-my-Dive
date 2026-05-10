import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { DiveLog } from '@log-my-dive/core';
import { metresToDisplay, celsiusToDisplay, barToDisplay, kgToDisplay } from '@log-my-dive/core';
import { useApp } from '../context/AppContext';

export function LogDetail() {
  const { id } = useParams<{ id: string }>();
  const { repo, isMetric } = useApp();
  const navigate = useNavigate();
  const [log, setLog] = useState<DiveLog | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const units = isMetric ? 'metric' : 'imperial';

  useEffect(() => {
    if (!id) return;
    repo.getById(id).then((l) => {
      if (!l || l.deletedAt) setNotFound(true);
      else setLog(l);
    });
  }, [repo, id]);

  const handleDelete = async () => {
    if (!log) return;
    if (!confirm('Delete this dive log? This cannot be undone.')) return;
    setDeleting(true);
    await repo.delete(log.id);
    navigate('/');
  };

  if (notFound) return (
    <div style={{ padding: 16 }}>
      <Link to="/" style={s.back}>← Back</Link>
      <p style={{ color: '#FF6B6B', marginTop: 16 }}>Dive log not found.</p>
    </div>
  );

  if (!log) return (
    <div style={{ padding: 16 }}>
      <Link to="/" style={s.back}>← Back</Link>
      <p style={{ color: '#8FA3B1', marginTop: 16 }}>Loading…</p>
    </div>
  );

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={s.back}>← Back</Link>
        <Link to={`/log/${log.id}/edit`} style={s.editBtn}>Edit</Link>
      </div>

      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroLocation}>{log.locationName}</h1>
        <p style={s.heroDate}>{formatDate(log.date)}</p>
        <div style={s.heroStats}>
          {log.maxDepth != null && (
            <HeroStat value={fmt(metresToDisplay(log.maxDepth, units))} label="Max depth" />
          )}
          <HeroStat value={`${log.durationMinutes}m`} label="Duration" />
          {log.waterTemperature != null && (
            <HeroStat value={fmt(celsiusToDisplay(log.waterTemperature, units))} label="Water temp" />
          )}
        </div>
      </div>

      {/* When */}
      <Section title="Time">
        <Row label="Entry" value={log.entryTime} />
        <Row label="Exit" value={log.exitTime} />
        <Row label="Duration" value={`${log.durationMinutes} min`} />
      </Section>

      {/* Dive data */}
      {anyOf(log, ['maxDepth','averageDepth','waterTemperature','visibility']) && (
        <Section title="Dive Data">
          {log.maxDepth != null && <Row label="Max depth" value={fmtStr(metresToDisplay(log.maxDepth, units))} />}
          {log.averageDepth != null && <Row label="Avg depth" value={fmtStr(metresToDisplay(log.averageDepth, units))} />}
          {log.waterTemperature != null && <Row label="Water temp" value={fmtStr(celsiusToDisplay(log.waterTemperature, units))} />}
          {log.visibility != null && <Row label="Visibility" value={fmtStr(metresToDisplay(log.visibility, units))} />}
        </Section>
      )}

      {/* Equipment */}
      {anyOf(log, ['tankType','startPressure','endPressure','weight']) && (
        <Section title="Equipment">
          {log.tankType && <Row label="Tank" value={log.tankType.replace('_', ' ')} />}
          {log.startPressure != null && <Row label="Start pressure" value={fmtStr(barToDisplay(log.startPressure, units))} />}
          {log.endPressure != null && <Row label="End pressure" value={fmtStr(barToDisplay(log.endPressure, units))} />}
          {log.weight != null && <Row label="Weight" value={fmtStr(kgToDisplay(log.weight, units))} />}
        </Section>
      )}

      {/* People */}
      {anyOf(log, ['buddy','instructor']) && (
        <Section title="People">
          {log.buddy && <Row label="Buddy" value={log.buddy} />}
          {log.instructor && <Row label="Instructor" value={log.instructor} />}
        </Section>
      )}

      {/* Conditions */}
      {anyOf(log, ['diveType','seaCondition']) && (
        <Section title="Conditions">
          {log.diveType && <Row label="Dive type" value={log.diveType} />}
          {log.seaCondition && <Row label="Sea condition" value={log.seaCondition.replace('_', ' ')} />}
        </Section>
      )}

      {/* Location */}
      {(log.latitude != null || log.longitude != null) && (
        <Section title="Location">
          {log.latitude != null && <Row label="Latitude" value={String(log.latitude)} />}
          {log.longitude != null && <Row label="Longitude" value={String(log.longitude)} />}
        </Section>
      )}

      {/* Diary */}
      {(log.notes || log.moodRating) && (
        <Section title="Diary">
          {log.moodRating && (
            <div>
              <p style={s.rowLabel}>Mood</p>
              <p style={{ fontSize: 22, letterSpacing: 2, color: '#FF6B6B' }}>
                {'★'.repeat(log.moodRating)}{'☆'.repeat(5 - log.moodRating)}
              </p>
            </div>
          )}
          {log.notes && (
            <p style={s.notes}>{log.notes}</p>
          )}
        </Section>
      )}

      {/* Metadata */}
      <Section title="Record">
        <Row label="Source" value={log.source} />
        <Row label="Created" value={new Date(log.createdAt).toLocaleString()} />
        <Row label="Updated" value={new Date(log.updatedAt).toLocaleString()} />
      </Section>

      {/* Delete */}
      <button
        style={s.deleteBtn}
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? 'Deleting…' : 'Delete dive log'}
      </button>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 22, fontWeight: 700, color: '#FFF', margin: 0 }}>{value}</p>
      <p style={{ fontSize: 11, color: '#A8D8EA', margin: 0, marginTop: 2 }}>{label}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={s.section}>
      <p style={s.sectionTitle}>{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.rowWrap}>
      <p style={s.rowLabel}>{label}</p>
      <p style={s.rowValue}>{value}</p>
    </div>
  );
}

function fmt({ value, label }: { value: number; label: string }): string {
  return `${value} ${label}`;
}

function fmtStr(d: { value: number; label: string }): string {
  return fmt(d);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function anyOf(log: DiveLog, fields: (keyof DiveLog)[]): boolean {
  return fields.some((f) => log[f] != null && log[f] !== '');
}

const s: Record<string, React.CSSProperties> = {
  back: { color: '#4FC3F7', fontSize: 14, textDecoration: 'none' },
  editBtn: {
    color: '#0A2342', background: '#E8EFF4', borderRadius: 8,
    padding: '6px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none',
  },
  hero: {
    background: '#0A2342', borderRadius: 16, padding: 20,
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  heroLocation: { fontSize: 22, fontWeight: 700, color: '#FFFFFF', margin: 0 },
  heroDate: { fontSize: 13, color: '#8FA3B1', margin: 0 },
  heroStats: { display: 'flex', gap: 24, marginTop: 12 },
  section: {
    background: '#FFF', borderRadius: 12, padding: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 10,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, color: '#8FA3B1',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0,
  },
  rowWrap: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: '#8FA3B1', margin: 0 },
  rowValue: { fontSize: 14, fontWeight: 600, color: '#0A2342', margin: 0 },
  notes: { fontSize: 15, color: '#333', lineHeight: 1.6, margin: 0 },
  deleteBtn: {
    background: 'transparent', color: '#FF6B6B',
    border: '1px solid #FF6B6B', borderRadius: 12,
    padding: '14px 0', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    marginTop: 4, marginBottom: 16,
  },
};
