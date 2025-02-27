import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePreferences } from '../components/PreferencesContext';

type ButtonProps = {
  mode: 'system' | 'light' | 'dark' | 'portrait' | 'landscape';
  label: string;
  isActive: boolean;
  onPress: () => void;
  theme: any;
};

const PreferenceButton = ({ mode, label, isActive, onPress, theme }: ButtonProps) => (
  <TouchableOpacity
    style={[
      styles.button,
      {
        backgroundColor: isActive ? theme.card : 'transparent',
        borderColor: theme.border
      }
    ]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, { color: theme.text }]}>{label}</Text>
  </TouchableOpacity>
);

export default function Settings() {
  const {
    theme,
    themePreference,
    setThemePreference,
    orientationPreference,
    setOrientationPreference
  } = usePreferences();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Thème</Text>
        <View style={styles.buttonGroup}>
          <PreferenceButton
            mode="system"
            label="Système"
            isActive={themePreference === 'system'}
            onPress={() => setThemePreference('system')}
            theme={theme}
          />
          <PreferenceButton
            mode="light"
            label="Clair"
            isActive={themePreference === 'light'}
            onPress={() => setThemePreference('light')}
            theme={theme}
          />
          <PreferenceButton
            mode="dark"
            label="Sombre"
            isActive={themePreference === 'dark'}
            onPress={() => setThemePreference('dark')}
            theme={theme}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Orientation</Text>
        <View style={styles.buttonGroup}>
          <PreferenceButton
            mode="system"
            label="Système"
            isActive={orientationPreference === 'system'}
            onPress={() => setOrientationPreference('system')}
            theme={theme}
          />
          <PreferenceButton
            mode="portrait"
            label="Portrait"
            isActive={orientationPreference === 'portrait'}
            onPress={() => setOrientationPreference('portrait')}
            theme={theme}
          />
          <PreferenceButton
            mode="landscape"
            label="Paysage"
            isActive={orientationPreference === 'landscape'}
            onPress={() => setOrientationPreference('landscape')}
            theme={theme}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});