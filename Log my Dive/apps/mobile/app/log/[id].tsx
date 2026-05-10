/**
 * Log Detail Screen (M5)
 * Read-only view of a single dive log with diary section.
 */
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDiveLog } from '../../src/hooks/useDiveLogs';

export default function LogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { log, isLoading } = useDiveLog(id);

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0A2342" /></View>;
  }

  if (!log) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Dive log not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete dive log',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO (M4): wire to DiveLogRepository.delete(id)
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.location}>{log.locationName}</Text>
        <Text style={styles.date}>{log.date}</Text>
      </View>

      {/* Key stats row */}
      <View style={styles.statsRow}>
        <StatChip label="Duration" value={`${log.durationMinutes} min`} />
        {log.maxDepth != null && <StatChip label="Max Depth" value={`${log.maxDepth} m`} />}
        {log.waterTemperature != null && <StatChip label="Temp" value={`${log.waterTemperature}°C`} />}
      </View>

      {/* Sections */}
      <Section title="Dive Data">
        <Field label="Entry time" value={log.entryTime} />
        <Field label="Exit time" value={log.exitTime} />
        <Field label="Duration" value={`${log.durationMinutes} minutes`} />
        <Field label="Max depth" value={log.maxDepth != null ? `${log.maxDepth} m` : null} />
        <Field label="Avg depth" value={log.averageDepth != null ? `${log.averageDepth} m` : null} />
        <Field label="Water temp" value={log.waterTemperature != null ? `${log.waterTemperature}°C` : null} />
        <Field label="Visibility" value={log.visibility != null ? `${log.visibility} m` : null} />
        <Field label="Dive type" value={log.diveType} />
        <Field label="Sea condition" value={log.seaCondition} />
      </Section>

      <Section title="Equipment">
        <Field label="Tank type" value={log.tankType} />
        <Field label="Start pressure" value={log.startPressure != null ? `${log.startPressure} bar` : null} />
        <Field label="End pressure" value={log.endPressure != null ? `${log.endPressure} bar` : null} />
        <Field label="Weight" value={log.weight != null ? `${log.weight} kg` : null} />
      </Section>

      <Section title="People">
        <Field label="Buddy" value={log.buddy} />
        <Field label="Instructor / Guide" value={log.instructor} />
      </Section>

      {/* Diary */}
      {log.notes && (
        <Section title="Dive Diary">
          <Text style={styles.notes}>{log.notes}</Text>
        </Section>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Source: {log.source}</Text>
        <Text style={styles.footerText}>Logged: {log.createdAt.slice(0, 10)}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/log/edit/${id}`)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => Alert.alert('Share', 'Share card — coming in Milestone 8!')}
        >
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statChipValue}>{value}</Text>
      <Text style={styles.statChipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FA' },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#666', fontSize: 16 },
  hero: {
    backgroundColor: '#0A2342',
    borderRadius: 16,
    padding: 24,
    gap: 4,
  },
  location: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  date: { fontSize: 14, color: '#4FC3F7' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statChipValue: { fontSize: 16, fontWeight: '700', color: '#0A2342' },
  statChipLabel: { fontSize: 11, color: '#8FA3B1', marginTop: 2 },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8FA3B1', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  field: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  fieldLabel: { fontSize: 14, color: '#8FA3B1', flex: 1 },
  fieldValue: { fontSize: 14, color: '#0A2342', fontWeight: '500', flex: 1, textAlign: 'right' },
  notes: { fontSize: 14, color: '#333', lineHeight: 22 },
  footer: { gap: 4, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#B0C4D4' },
  actions: { flexDirection: 'row', gap: 10 },
  editButton: {
    flex: 1,
    backgroundColor: '#0A2342',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  editButtonText: { color: '#FFFFFF', fontWeight: '600' },
  shareButton: {
    flex: 1,
    backgroundColor: '#4FC3F7',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  shareButtonText: { color: '#FFFFFF', fontWeight: '600' },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  deleteButtonText: { color: '#FF6B6B', fontWeight: '600' },
});
