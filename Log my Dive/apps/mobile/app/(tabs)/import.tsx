/**
 * Import Screen (M6)
 * Allows importing dive logs from CSV or JSON files.
 * Shows available adapters and stubs for future sources.
 */
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

type AdapterEntry = {
  label: string;
  description: string;
  available: boolean;
};

const ADAPTERS: AdapterEntry[] = [
  {
    label: 'CSV File',
    description: 'Import from a .csv export. Supports any app that can export to CSV.',
    available: true,
  },
  {
    label: 'JSON File',
    description: 'Import from a .json export using the Log my Dive schema.',
    available: true,
  },
  {
    label: 'Garmin Descent',
    description: 'Import from Garmin Connect CSV exports.',
    available: false,
  },
  {
    label: 'Subsurface',
    description: 'Import .ssrf files from the Subsurface desktop app.',
    available: false,
  },
];

export default function ImportScreen() {
  const handleImport = (label: string) => {
    // TODO (M6): wire up file picker → adapter → DiveLogRepository.bulkCreate()
    Alert.alert('Import', `${label} import coming in Milestone 6.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Import dive records</Text>
      <Text style={styles.sectionSubtitle}>
        Bring logs from other apps or dive computers into one place.
      </Text>

      {ADAPTERS.map((adapter) => (
        <View key={adapter.label} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>{adapter.label}</Text>
            {!adapter.available && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Soon</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardDescription}>{adapter.description}</Text>
          {adapter.available && (
            <TouchableOpacity
              style={styles.importButton}
              onPress={() => handleImport(adapter.label)}
            >
              <Text style={styles.importButtonText}>Choose file</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <Text style={styles.sectionTitle} style={{ marginTop: 32 }}>Import history</Text>
      <View style={styles.emptyHistory}>
        <Text style={styles.emptyHistoryText}>No imports yet</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FA' },
  content: { padding: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0A2342', marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: '#8FA3B1', marginBottom: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 16, fontWeight: '600', color: '#0A2342' },
  cardDescription: { fontSize: 13, color: '#666' },
  badge: {
    backgroundColor: '#E8EFF4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, color: '#8FA3B1', fontWeight: '600' },
  importButton: {
    marginTop: 4,
    backgroundColor: '#0A2342',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  importButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  emptyHistory: { padding: 24, alignItems: 'center' },
  emptyHistoryText: { color: '#B0C4D4', fontSize: 14 },
});
