/**
 * Statistics Screen (M7)
 * Personal dive summary. Clean cards, not a dashboard.
 */
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useDiveLogs } from '../../src/hooks/useDiveLogs';
import { computeStats, formatDiveTime } from '@log-my-dive/core';

export default function StatsScreen() {
  const { logs, isLoading } = useDiveLogs();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A2342" />
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>No stats yet</Text>
        <Text style={styles.emptySubtitle}>Start logging dives to see your stats</Text>
      </View>
    );
  }

  const stats = computeStats(logs);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top-line stats */}
      <View style={styles.row}>
        <StatCard label="Total Dives" value={String(stats.totalDives)} unit="dives" />
        <StatCard
          label="Dive Time"
          value={formatDiveTime(stats.totalDiveTimeMinutes)}
          unit="total"
        />
      </View>
      <View style={styles.row}>
        <StatCard
          label="Max Depth"
          value={stats.maxDepthEver != null ? `${stats.maxDepthEver}` : '—'}
          unit="metres"
        />
        <StatCard
          label="Last Dive"
          value={stats.lastDive?.date ?? '—'}
          unit={stats.lastDive?.locationName ?? ''}
        />
      </View>

      {/* Most visited sites */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most visited sites</Text>
        {stats.mostVisitedSites.map((site, i) => (
          <View key={site.locationName} style={styles.siteRow}>
            <Text style={styles.siteRank}>#{i + 1}</Text>
            <Text style={styles.siteName} numberOfLines={1}>{site.locationName}</Text>
            <Text style={styles.siteCount}>{site.count} dive{site.count !== 1 ? 's' : ''}</Text>
          </View>
        ))}
      </View>

      {/* Dives per year */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dives by year</Text>
        {stats.divesPerYear.map((entry) => {
          const maxCount = Math.max(...stats.divesPerYear.map((e) => e.count));
          const barWidth = (entry.count / maxCount) * 100;
          return (
            <View key={entry.year} style={styles.yearRow}>
              <Text style={styles.yearLabel}>{entry.year}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${barWidth}%` }]} />
              </View>
              <Text style={styles.yearCount}>{entry.count}</Text>
            </View>
          );
        })}
      </View>

      {/* Source breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data sources</Text>
        {stats.sourceBreakdown.map((s) => (
          <View key={s.source} style={styles.siteRow}>
            <Text style={styles.siteName}>{s.source}</Text>
            <Text style={styles.siteCount}>{s.count} log{s.count !== 1 ? 's' : ''}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F8FA' },
  content: { padding: 16, gap: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#0A2342' },
  emptySubtitle: { fontSize: 14, color: '#8FA3B1' },
  row: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 28, fontWeight: '700', color: '#0A2342' },
  statUnit: { fontSize: 12, color: '#4FC3F7', fontWeight: '600', marginTop: 2 },
  statLabel: { fontSize: 12, color: '#8FA3B1', marginTop: 4 },
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0A2342', marginBottom: 4 },
  siteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  siteRank: { fontSize: 13, color: '#8FA3B1', width: 24 },
  siteName: { flex: 1, fontSize: 14, color: '#333' },
  siteCount: { fontSize: 13, color: '#8FA3B1' },
  yearRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  yearLabel: { fontSize: 13, color: '#333', width: 40 },
  barTrack: { flex: 1, height: 8, backgroundColor: '#E8EFF4', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#4FC3F7', borderRadius: 4 },
  yearCount: { fontSize: 13, color: '#8FA3B1', width: 24, textAlign: 'right' },
});
