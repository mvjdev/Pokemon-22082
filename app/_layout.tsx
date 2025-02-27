import { Stack } from 'expo-router';
import { PreferencesProvider } from '../components/PreferencesContext';

export default function Layout() {
  return (
    <PreferencesProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Pokédex',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="pokemon/[id]"
          options={{
            title: 'Détails',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Paramètres',
            headerShown: true
          }}
        />
      </Stack>
    </PreferencesProvider>
  );
}