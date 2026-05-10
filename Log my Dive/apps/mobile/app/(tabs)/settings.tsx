/**
 * Settings Screen (M9)
 */
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [isMetric, setIsMetric] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear all data',
      'This will permanently delete all dive logs. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete everything',
          style: 'destructive',
          onPress: () => {
            // TODO (M9): wire to DiveLogRepository clear
            Alert.alert('Cleared', 'All data has been deleted.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Units */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>{isMetric ? 'Metric' : 'Imperial'}</Text>
            <Text style={styles.rowSub}>
              {isMetric ? 'Metres, °C, bar, kg' : 'Feet, °F, psi, lbs'}
            </Text>
          </View>
          <Switch
            value={isMetric}
            onValueChange={setIsMetric}
            trackColor={{ false: '#4FC3F7', true: '#0A2342' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Log my Dive</Text>
          <Text style={styles.rowSub}>v1.0.0</Text>
        </View>
      </View>

      {/* Data management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Text style={styles.dangerButtonText}>Clear all dive data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FA' },
  content: { padding: 16, gap: 16 },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#8FA3B1', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 15, color: '#0A2342', fontWeight: '500' },
  rowSub: { fontSize: 13, color: '#8FA3B1', marginTop: 2 },
  dangerButton: {
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dangerButtonText: { color: '#FF6B6B', fontWeight: '600', fontSize: 14 },
});
