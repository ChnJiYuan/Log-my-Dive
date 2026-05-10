import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { DiveLog } from '@log-my-dive/core';
import { DiveLogForm, formFromLog } from '../components/DiveLogForm';
import type { DiveLogFormValues } from '../components/DiveLogForm';
import { useApp } from '../context/AppContext';

export function EditLog() {
  const { repo, isMetric } = useApp();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [log, setLog] = useState<DiveLog | null>(null);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    repo.getById(id).then((l) => {
      if (!l) setNotFound(true);
      else setLog(l);
    });
  }, [repo, id]);

  const handleSave = async (values: DiveLogFormValues) => {
    if (!id) return;
    setSaving(true);
    try {
      await repo.update(id, {
        date: values.date,
        entryTime: values.entryTime,
        exitTime: values.exitTime,
        locationName: values.locationName.trim(),
        latitude: values.latitude ? Number(values.latitude) : undefined,
        longitude: values.longitude ? Number(values.longitude) : undefined,
        maxDepth: values.maxDepth ? toMetric(Number(values.maxDepth), 'depth', isMetric) : undefined,
        averageDepth: values.averageDepth ? toMetric(Number(values.averageDepth), 'depth', isMetric) : undefined,
        waterTemperature: values.waterTemperature ? toMetric(Number(values.waterTemperature), 'temp', isMetric) : undefined,
        visibility: values.visibility ? toMetric(Number(values.visibility), 'depth', isMetric) : undefined,
        tankType: (values.tankType || undefined) as DiveLog['tankType'],
        startPressure: values.startPressure ? toMetric(Number(values.startPressure), 'pressure', isMetric) : undefined,
        endPressure: values.endPressure ? toMetric(Number(values.endPressure), 'pressure', isMetric) : undefined,
        weight: values.weight ? toMetric(Number(values.weight), 'weight', isMetric) : undefined,
        buddy: values.buddy.trim() || undefined,
        instructor: values.instructor.trim() || undefined,
        diveType: (values.diveType || undefined) as DiveLog['diveType'],
        seaCondition: (values.seaCondition || undefined) as DiveLog['seaCondition'],
        moodRating: values.moodRating ? (Number(values.moodRating) as 1 | 2 | 3 | 4 | 5) : undefined,
        notes: values.notes.trim() || undefined,
      });
      navigate(`/log/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return <div style={{ padding: 16, color: '#FF6B6B' }}>Dive log not found.</div>;
  }

  if (!log) {
    return <div style={{ padding: 16, color: '#8FA3B1' }}>Loading…</div>;
  }

  return (
    <DiveLogForm
      title="Edit Dive Log"
      initialValues={formFromLog(log)}
      saving={saving}
      onSave={handleSave}
      cancelTo={`/log/${id}`}
    />
  );
}

function toMetric(value: number, type: 'depth' | 'temp' | 'pressure' | 'weight', isMetric: boolean): number {
  if (isMetric) return value;
  switch (type) {
    case 'depth': return value / 3.28084;
    case 'temp': return ((value - 32) * 5) / 9;
    case 'pressure': return value / 14.5038;
    case 'weight': return value / 2.20462;
  }
}
