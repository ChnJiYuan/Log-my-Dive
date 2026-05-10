/**
 * Home — Dive Log List (M3)
 * Displays all dive logs sorted by date descending.
 * FAB navigates to the Create Log screen.
 */
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDiveLogs } from '../../src/hooks/useDiveLogs';

export default function HomeScreen() {
  const router = useRouter();
  const { logs, isLoading } = useDiveLogs();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A2342" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {logs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤿</Text>
          <Text style={styles.emptyTitle}>No dives yet</Text>
          <Text style={styles.emptySubtitle}>Tap + to log your first dive</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/log/${item.id}`)}
            >
              <Text style={styles.cardLocation}>{item.locationName}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <View style={styles.cardRow}>
                {item.maxDepth != null && (
                  <Text style={styles.cardStat}>↓ {item.maxDepth}m</Text>
                )}
                <Text style={styles.cardStat}>⏱ {item.durationMinutes}min</Text>
                {item.buddy && (
                  <Text style={styles.cardStat}>👤 {item.buddy}</Text>
                )}
              </View>
              {item.notes ? (
                <Text style={styles.cardNote} numberOfLines={1}>{item.notes}</Text>
              ) : null}
              <Text style={styles.cardSource}>{item.source}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/log/create')}
        accessibilityLabel="Add new dive log"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, gap: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#0A2342' },
  emptySubtitle: { fontSize: 14, color: '#8FA3B1' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLocation: { fontSize: 16, fontWeight: '600', color: '#0A2342' },
  cardDate: { fontSize: 13, color: '#8FA3B1' },
  cardRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cardStat: { fontSize: 13, color: '#4FC3F7', fontWeight: '500' },
  cardNote: { fontSize: 13, color: '#555', marginTop: 4 },
  cardSource: {
    fontSize: 11,
    color: '#B0C4D4',
    textTransform: 'uppercase',
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { fontSize: 28, color: '#FFFFFF', lineHeight: 32 },
});
