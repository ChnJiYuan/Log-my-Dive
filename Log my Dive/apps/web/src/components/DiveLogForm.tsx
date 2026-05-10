import { useState } from 'react';
import { Link } from 'react-router-dom';
import { calcDurationMinutes } from '@log-my-dive/core';
import type { DiveLog, DiveType, SeaCondition, TankType } from '@log-my-dive/core';
import { useApp } from '../context/AppContext';

export interface DiveLogFormValues {
  date: string;
  entryTime: string;
  exitTime: string;
  locationName: string;
  latitude: string;
  longitude: string;
  maxDepth: string;
  averageDepth: string;
  waterTemperature: string;
  visibility: string;
  tankType: string;
  startPressure: string;
  endPressure: string;
  weight: string;
  buddy: string;
  instructor: string;
  diveType: string;
  seaCondition: string;
  moodRating: string;
  notes: string;
}

export const EMPTY_FORM: DiveLogFormValues = {
  date: '', entryTime: '', exitTime: '', locationName: '',
  latitude: '', longitude: '',
  maxDepth: '', averageDepth: '', waterTemperature: '', visibility: '',
  tankType: '', startPressure: '', endPressure: '', weight: '',
  buddy: '', instructor: '',
  diveType: '', seaCondition: '',
  moodRating: '', notes: '',
};

export function formFromLog(log: DiveLog): DiveLogFormValues {
  return {
    date: log.date,
    entryTime: log.entryTime,
    exitTime: log.exitTime,
    locationName: log.locationName,
    latitude: log.latitude != null ? String(log.latitude) : '',
    longitude: log.longitude != null ? String(log.longitude) : '',
    maxDepth: log.maxDepth != null ? String(log.maxDepth) : '',
    averageDepth: log.averageDepth != null ? String(log.averageDepth) : '',
    waterTemperature: log.waterTemperature != null ? String(log.waterTemperature) : '',
    visibility: log.visibility != null ? String(log.visibility) : '',
    tankType: log.tankType ?? '',
    startPressure: log.startPressure != null ? String(log.startPressure) : '',
    endPressure: log.endPressure != null ? String(log.endPressure) : '',
    weight: log.weight != null ? String(log.weight) : '',
    buddy: log.buddy ?? '',
    instructor: log.instructor ?? '',
    diveType: log.diveType ?? '',
    seaCondition: log.seaCondition ?? '',
    moodRating: log.moodRating != null ? String(log.moodRating) : '',
    notes: log.notes ?? '',
  };
}

interface Props {
  title: string;
  initialValues?: DiveLogFormValues;
  saving: boolean;
  onSave: (values: DiveLogFormValues) => void;
  cancelTo: string;
  extraAction?: React.ReactNode;
}

export function DiveLogForm({ title, initialValues = EMPTY_FORM, saving, onSave, cancelTo, extraAction }: Props) {
  const { isMetric } = useApp();
  const depthUnit = isMetric ? 'm' : 'ft';
  const tempUnit = isMetric ? '°C' : '°F';
  const pressureUnit = isMetric ? 'bar' : 'psi';
  const weightUnit = isMetric ? 'kg' : 'lbs';

  const [v, setV] = useState<DiveLogFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: keyof DiveLogFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setV((prev) => ({ ...prev, [field]: e.target.value }));

  const duration =
    v.entryTime && v.exitTime ? calcDurationMinutes(v.entryTime, v.exitTime) : null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!v.date) errs.date = 'Required';
    if (!v.entryTime) errs.entryTime = 'Required';
    if (!v.exitTime) errs.exitTime = 'Required';
    if (!v.locationName.trim()) errs.locationName = 'Required';
    if (duration !== null && duration <= 0)
      errs.exitTime = 'Exit time must be after entry time';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(v);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Link to={cancelTo} style={{ color: '#4FC3F7', fontSize: 14 }}>← Cancel</Link>
        {extraAction}
      </div>
      <h1 style={{ marginBottom: 20, color: '#0A2342', fontSize: 20 }}>{title}</h1>

      <form onSubmit={handleSubmit} style={s.form}>
        {/* ── When & Where ───────────────────────────────── */}
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>When &amp; Where</legend>

          <label style={s.label}>Date *
            <input style={inp(errors.date)} type="date" value={v.date} onChange={set('date')} />
            {errors.date && <span style={s.err}>{errors.date}</span>}
          </label>

          <div style={s.row}>
            <label style={{ ...s.label, flex: 1 }}>Entry time *
              <input style={inp(errors.entryTime)} type="time" value={v.entryTime} onChange={set('entryTime')} />
              {errors.entryTime && <span style={s.err}>{errors.entryTime}</span>}
            </label>
            <label style={{ ...s.label, flex: 1 }}>Exit time *
              <input style={inp(errors.exitTime)} type="time" value={v.exitTime} onChange={set('exitTime')} />
              {errors.exitTime && <span style={s.err}>{errors.exitTime}</span>}
            </label>
          </div>

          {duration !== null && (
            <p style={{ fontSize: 13, color: '#4FC3F7', fontWeight: 600, margin: 0 }}>
              ⏱ Duration: {duration} min
            </p>
          )}

          <label style={s.label}>Location *
            <input style={inp(errors.locationName)} type="text" placeholder="e.g. Blue Corner, Palau"
              value={v.locationName} onChange={set('locationName')} />
            {errors.locationName && <span style={s.err}>{errors.locationName}</span>}
          </label>

          <div style={s.row}>
            <label style={{ ...s.label, flex: 1 }}>Latitude
              <input style={s.input} type="number" step="any" placeholder="–90 to 90"
                value={v.latitude} onChange={set('latitude')} />
            </label>
            <label style={{ ...s.label, flex: 1 }}>Longitude
              <input style={s.input} type="number" step="any" placeholder="–180 to 180"
                value={v.longitude} onChange={set('longitude')} />
            </label>
          </div>
        </fieldset>

        {/* ── Dive Data ──────────────────────────────────── */}
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>Dive Data</legend>
          <div style={s.row}>
            <label style={{ ...s.label, flex: 1 }}>Max depth ({depthUnit})
              <input style={s.input} type="number" min="0" step="0.1" placeholder="0"
                value={v.maxDepth} onChange={set('maxDepth')} />
            </label>
            <label style={{ ...s.label, flex: 1 }}>Avg depth ({depthUnit})
              <input style={s.input} type="number" min="0" step="0.1" placeholder="0"
                value={v.averageDepth} onChange={set('averageDepth')} />
            </label>
          </div>
          <div style={s.row}>
            <label style={{ ...s.label, flex: 1 }}>Water temp ({tempUnit})
              <input style={s.input} type="number" step="0.1" placeholder="—"
                value={v.waterTemperature} onChange={set('waterTemperature')} />
            </label>
            <label style={{ ...s.label, flex: 1 }}>Visibility ({depthUnit})
              <input style={s.input} type="number" min="0" step="0.5" placeholder="—"
                value={v.visibility} onChange={set('visibility')} />
            </label>
          </div>
        </fieldset>

        {/* ── Equipment ──────────────────────────────────── */}
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>Equipment</legend>
          <label style={s.label}>Tank type
            <select style={s.input} value={v.tankType} onChange={set('tankType')}>
              <option value="">— select —</option>
              <option value="aluminium_80">Aluminium 80</option>
              <option value="steel_12">Steel 12 L</option>
              <option value="steel_15">Steel 15 L</option>
              <option value="twin_set">Twin Set</option>
              <option value="sidemount">Sidemount</option>
              <option value="other">Other</option>
            </select>
          </label>
          <div style={s.row}>
            <label style={{ ...s.label, flex: 1 }}>Start pressure ({pressureUnit})
              <input style={s.input} type="number" min="0" placeholder="—"
                value={v.startPressure} onChange={set('startPressure')} />
            </label>
            <label style={{ ...s.label, flex: 1 }}>End pressure ({pressureUnit})
              <input style={s.input} type="number" min="0" placeholder="—"
                value={v.endPressure} onChange={set('endPressure')} />
            </label>
          </div>
          <label style={s.label}>Weight ({weightUnit})
            <input style={s.input} type="number" min="0" step="0.5" placeholder="—"
              value={v.weight} onChange={set('weight')} />
          </label>
        </fieldset>

        {/* ── People ─────────────────────────────────────── */}
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>People</legend>
          <label style={s.label}>Buddy
            <input style={s.input} type="text" placeholder="Name"
              value={v.buddy} onChange={set('buddy')} />
          </label>
          <label style={s.label}>Instructor / guide
            <input style={s.input} type="text" placeholder="Name"
              value={v.instructor} onChange={set('instructor')} />
          </label>
        </fieldset>

        {/* ── Conditions ─────────────────────────────────── */}
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>Conditions</legend>
          <div style={s.row}>
            <label style={{ ...s.label, flex: 1 }}>Dive type
              <select style={s.input} value={v.diveType} onChange={set('diveType')}>
                <option value="">— select —</option>
                {(['recreational','night','drift','deep','cave','wreck','shore','boat','other'] as DiveType[])
                  .map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label style={{ ...s.label, flex: 1 }}>Sea condition
              <select style={s.input} value={v.seaCondition} onChange={set('seaCondition')}>
                <option value="">— select —</option>
                {(['calm','light_chop','choppy','strong_current','surge','other'] as SeaCondition[])
                  .map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </label>
          </div>
        </fieldset>

        {/* ── Diary ──────────────────────────────────────── */}
        <fieldset style={s.fieldset}>
          <legend style={s.legend}>Diary</legend>
          <label style={s.label}>Mood rating
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setV((p) => ({ ...p, moodRating: String(n) }))}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    fontSize: 18,
                    background: v.moodRating === String(n) ? '#FF6B6B' : '#E8EFF4',
                    color: v.moodRating === String(n) ? '#FFF' : '#0A2342',
                    fontWeight: 700,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </label>
          <label style={s.label}>Notes
            <textarea
              style={{ ...s.input, minHeight: 100, resize: 'vertical' }}
              placeholder="What did you see? How did it feel?"
              value={v.notes}
              onChange={set('notes')}
            />
          </label>
        </fieldset>

        <button type="submit" disabled={saving} style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : 'Save Dive Log'}
        </button>
      </form>
    </div>
  );
}

function inp(err?: string): React.CSSProperties {
  return err ? { ...s.input, borderColor: '#FF6B6B' } : s.input;
}

const s: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldset: {
    border: 'none', background: '#FFFFFF', borderRadius: 12, padding: 16,
    display: 'flex', flexDirection: 'column', gap: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  legend: {
    fontSize: 13, fontWeight: 700, color: '#8FA3B1',
    textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: 4,
  },
  row: { display: 'flex', gap: 12 },
  label: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#555', fontWeight: 500 },
  input: {
    padding: '10px 14px', borderRadius: 8, border: '1px solid #E0EAF0',
    fontSize: 15, color: '#0A2342', background: '#FAFCFE', outline: 'none',
  },
  err: { fontSize: 12, color: '#FF6B6B' },
  saveBtn: {
    background: '#FF6B6B', color: '#FFFFFF', border: 'none', borderRadius: 12,
    padding: '14px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8,
  },
};
