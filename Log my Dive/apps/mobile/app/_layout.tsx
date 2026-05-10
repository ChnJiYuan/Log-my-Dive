import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0A2342" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0A2342' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#F5F8FA' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="log/create"
          options={{ title: 'New Dive Log', presentation: 'modal' }}
        />
        <Stack.Screen
          name="log/[id]"
          options={{ title: 'Dive Detail' }}
        />
        <Stack.Screen
          name="log/edit/[id]"
          options={{ title: 'Edit Dive Log', presentation: 'modal' }}
        />
      </Stack>
    </>
  );
}
