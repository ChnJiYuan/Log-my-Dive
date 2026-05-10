import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calcDurationMinutes } from '@log-my-dive/core';

export function CreateLog() {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [maxDepth, setMaxDepth] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const duration = entryTime && exitTime
    ? calcDurationMinutes(entryTime, exitTime)
    : null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Required';
    if (!entryTime) errs.entryTime = 'Required';
    if (!exitTime) errs.exitTime = 'Required';
    if (!locationName.trim()) errs.locationName = 'Required';
    if (duration !== null && duration <= 0) errs.exitTime = 'Must be after entry time';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO (M4): DiveLogRepository.create(...)
    navigate('/');
  };

  return (
    <div style={{ padding: 16 }}>
      <Link to="/" style={{ color: '#4FC3F7', fontSize: 14 }}>← Cancel</Link>
      <h1 style={{ marginTop: 12, marginBottom: 20, color: '#0A2342', fontSize: 20 }}>New Dive Log</h1>

      <form onSubmit={handleSave} style={styles.form}>
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>When & Where</legend>
          <label style={styles.label}>Date *
            <input style={s(styles.input, errors.date && styles.inputError)} type="date" value={date} onChange={e => setDate(e.target.value)} />
            {errors.date && <span style={styles.error}>{errors.date}</span>}
          </label>
          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>Entry time *
              <input style={s(styles.input, errors.entryTime && styles.inputError)} type="time" value={entryTime} onChange={e => setEntryTime(e.target.value)} />
              {errors.entryTime && <span style={styles.error}>{errors.entryTime}</span>}
            </label>
            <label style={{ ...styles.label, flex: 1 }}>Exit time *
              <input style={s(styles.input, errors.exitTime && styles.inputError)} type="time" value={exitTime} onChange={e => setExitTime(e.target.value)} />
              {errors.exitTime && <span style={styles.error}>{errors.exitTime}</span>}
            </label>
          </div>
          {duration !== null && (
            <p style={styles.duration}>⏱ Duration: {duration} minutes</p>
          )}
          <label style={styles.label}>Location *
            <input style={s(styles.input, errors.locationName && styles.inputError)} type="text" placeholder="e.g. Blue Corner, Palau" value={locationName} onChange={e => setLocationName(e.target.value)} />
            {errors.locationName && <span style={styles.error}>{errors.locationName}</span>}
          </label>
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Dive Data</legend>
          <label style={styles.label}>Max depth (m)
            <input style={styles.input} type="number" min="0" step="0.1" placeholder="0" value={maxDepth} onChange={e => setMaxDepth(e.target.value)} />
          </label>
        </fieldset>

        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>Diary</legend>
          <label style={styles.label}>Notes
            <textarea style={{ ...styles.input, minHeight: 100, resize: 'vertical' }} placeholder="What did you see? How did it feel?" value={notes} onChange={e => setNotes(e.target.value)} />
          </label>
        </fieldset>

        <button type="submit" style={styles.saveButton}>Save Dive Log</button>
      </form>
    </div>
  );
}

// merge style objects
function s(...objs: (React.CSSProperties | undefined | false)[]): React.CSSProperties {
  return Object.assign({}, ...objs.filter(Boolean));
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldset: { border: 'none', background: '#FFFFFF', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  legend: { fontSize: 13, fontWeight: 700, color: '#8FA3B1', textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: 4 },
  row: { display: 'flex', gap: 12 },
  label: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: '#555', fontWeight: 500 },
  input: { padding: '10px 14px', borderRadius: 8, border: '1px solid #E0EAF0', fontSize: 15, color: '#0A2342', background: '#FAFCFE', outline: 'none' },
  inputError: { borderColor: '#FF6B6B' },
  error: { fontSize: 12, color: '#FF6B6B' },
  duration: { fontSize: 13, color: '#4FC3F7', fontWeight: 600 },
  saveButton: { background: '#FF6B6B', color: '#FFFFFF', border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
};
