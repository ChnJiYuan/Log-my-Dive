/**
 * Create Log Screen (M4)
 * Full dive log entry form. All fields; duration auto-calculated.
 */
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { calcDurationMinutes } from '@log-my-dive/core';

export default function CreateLogScreen() {
  const router = useRouter();

  // Required fields
  const [date, setDate] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [locationName, setLocationName] = useState('');

  // Optional dive data
  const [maxDepth, setMaxDepth] = useState('');
  const [averageDepth, setAverageDepth] = useState('');
  const [waterTemp, setWaterTemp] = useState('');
  const [visibility, setVisibility] = useState('');

  // Equipment
  const [startPressure, setStartPressure] = useState('');
  const [endPressure, setEndPressure] = useState('');
  const [weight, setWeight] = useState('');

  // People
  const [buddy, setBuddy] = useState('');
  const [instructor, setInstructor] = useState('');

  // Personal
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const duration =
    entryTime && exitTime ? calcDurationMinutes(entryTime, exitTime) : null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!date) errs.date = 'Date is required';
    if (!entryTime) errs.entryTime = 'Entry time is required';
    if (!exitTime) errs.exitTime = 'Exit time is required';
    if (!locationName.trim()) errs.locationName = 'Location is required';
    if (entryTime && exitTime && calcDurationMinutes(entryTime, exitTime) <= 0) {
      errs.exitTime = 'Exit time must be after entry time';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    // TODO (M4): wire to DiveLogRepository.create()
    Alert.alert('Saved', 'Dive log saved! (DB not wired yet — coming in Milestone 4)');
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      {/* ── When & Where ──────────────────────────────────────────────── */}
      <SectionHeader title="When & Where" />
      <Field label="Date *" error={errors.date}>
        <TextInput
          style={[styles.input, errors.date && styles.inputError]}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
        />
      </Field>
      <View style={styles.row}>
        <Field label="Entry time *" error={errors.entryTime} style={{ flex: 1 }}>
          <TextInput
            style={[styles.input, errors.entryTime && styles.inputError]}
            placeholder="HH:MM"
            value={entryTime}
            onChangeText={setEntryTime}
            keyboardType="numeric"
          />
        </Field>
        <Field label="Exit time *" error={errors.exitTime} style={{ flex: 1 }}>
          <TextInput
            style={[styles.input, errors.exitTime && styles.inputError]}
            placeholder="HH:MM"
            value={exitTime}
            onChangeText={setExitTime}
            keyboardType="numeric"
          />
        </Field>
      </View>
      {duration !== null && (
        <Text style={styles.duration}>⏱ Duration: {duration} minutes</Text>
      )}
      <Field label="Location *" error={errors.locationName}>
        <TextInput
          style={[styles.input, errors.locationName && styles.inputError]}
          placeholder="e.g. Blue Corner, Palau"
          value={locationName}
          onChangeText={setLocationName}
        />
      </Field>

      {/* ── Dive Data ─────────────────────────────────────────────────── */}
      <SectionHeader title="Dive Data" />
      <View style={styles.row}>
        <Field label="Max depth (m)" style={{ flex: 1 }}>
          <TextInput style={styles.input} placeholder="0" value={maxDepth} onChangeText={setMaxDepth} keyboardType="decimal-pad" />
        </Field>
        <Field label="Avg depth (m)" style={{ flex: 1 }}>
          <TextInput style={styles.input} placeholder="0" value={averageDepth} onChangeText={setAverageDepth} keyboardType="decimal-pad" />
        </Field>
      </View>
      <View style={styles.row}>
        <Field label="Water temp (°C)" style={{ flex: 1 }}>
          <TextInput style={styles.input} placeholder="0" value={waterTemp} onChangeText={setWaterTemp} keyboardType="decimal-pad" />
        </Field>
        <Field label="Visibility (m)" style={{ flex: 1 }}>
          <TextInput style={styles.input} placeholder="0" value={visibility} onChangeText={setVisibility} keyboardType="decimal-pad" />
        </Field>
      </View>

      {/* ── Equipment ─────────────────────────────────────────────────── */}
      <SectionHeader title="Equipment" />
      <View style={styles.row}>
        <Field label="Start pressure (bar)" style={{ flex: 1 }}>
          <TextInput style={styles.input} placeholder="200" value={startPressure} onChangeText={setStartPressure} keyboardType="decimal-pad" />
        </Field>
        <Field label="End pressure (bar)" style={{ flex: 1 }}>
          <TextInput style={styles.input} placeholder="50" value={endPressure} onChangeText={setEndPressure} keyboardType="decimal-pad" />
        </Field>
      </View>
      <Field label="Weight (kg)">
        <TextInput style={styles.input} placeholder="0" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
      </Field>

      {/* ── People ────────────────────────────────────────────────────── */}
      <SectionHeader title="People" />
      <Field label="Dive buddy">
        <TextInput style={styles.input} placeholder="Name" value={buddy} onChangeText={setBuddy} />
      </Field>
      <Field label="Instructor / Guide">
        <TextInput style={styles.input} placeholder="Name" value={instructor} onChangeText={setInstructor} />
      </Field>

      {/* ── Personal ──────────────────────────────────────────────────── */}
      <SectionHeader title="Diary" />
      <Field label="Notes">
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="What did you see? How did it feel?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </Field>

      {/* Save */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Dive Log</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Field({
  label,
  children,
  error,
  style,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  style?: object;
}) {
  return (
    <View style={[styles.fieldWrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FA' },
  content: { padding: 16, gap: 12, paddingBottom: 48 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8FA3B1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  row: { flexDirection: 'row', gap: 12 },
  fieldWrapper: { gap: 4 },
  label: { fontSize: 13, color: '#555', fontWeight: '500' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0EAF0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0A2342',
  },
  inputError: { borderColor: '#FF6B6B' },
  textarea: { minHeight: 100, paddingTop: 12 },
  errorText: { fontSize: 12, color: '#FF6B6B' },
  duration: { fontSize: 13, color: '#4FC3F7', fontWeight: '600', marginTop: -4 },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
