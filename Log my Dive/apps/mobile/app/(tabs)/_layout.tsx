import { Tabs } from 'expo-router';

// Simple SVG-free icon names — replace with a proper icon library (e.g. @expo/vector-icons)
const tabConfig = [
  { name: 'index',    title: 'Logs',     icon: '🌊' },
  { name: 'import',  title: 'Import',   icon: '📥' },
  { name: 'stats',   title: 'Stats',    icon: '📊' },
  { name: 'settings',title: 'Settings', icon: '⚙️' },
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',   // coral accent
        tabBarInactiveTintColor: '#8FA3B1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8EFF4',
        },
        headerStyle: { backgroundColor: '#0A2342' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Dives',
          tabBarLabel: 'Logs',
          tabBarIcon: ({ color }) => <TabIcon icon="🌊" color={color} />,
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: 'Import',
          tabBarIcon: ({ color }) => <TabIcon icon="📥" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistics',
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color }) => <TabIcon icon="📊" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon icon="⚙️" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Placeholder icon — swap for @expo/vector-icons once installed
function TabIcon({ icon, color }: { icon: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
}
