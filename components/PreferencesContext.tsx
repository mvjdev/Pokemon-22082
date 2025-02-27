import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOrientation } from '../hooks/useOrientation';

const portraitThemes = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    card: '#F5F5F5',
    border: '#E0E0E0',
  },
  dark: {
    background: '#1a1b2e',
    text: '#FFFFFF',
    card: '#2d2d4d',
    border: '#3f3f6d',
  },
};


const landscapeThemes = {
  light: {
    background: '#f0fdf4',
    text: '#166534',
    card: '#dcfce7',
    border: '#86efac',
  },
  dark: {
    background: '#052e16',
    text: '#ecfdf5',
    card: '#064e3b',
    border: '#059669',
  },
};

type ThemeType = {
  background: string;
  text: string;
  card: string;
  border: string;
};

type PreferencesContextType = {
  theme: ThemeType;
  setThemePreference: (theme: 'system' | 'light' | 'dark') => void;
  themePreference: 'system' | 'light' | 'dark';
  orientationPreference: 'system' | 'portrait' | 'landscape';
  setOrientationPreference: (orientation: 'system' | 'portrait' | 'landscape') => void;
};

const PreferencesContext = createContext<PreferencesContextType>({
  theme: portraitThemes.light,
  setThemePreference: () => {},
  themePreference: 'system',
  orientationPreference: 'system',
  setOrientationPreference: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<'system' | 'light' | 'dark'>('system');
  const [orientationPreference, setOrientationPreference] = useState<'system' | 'portrait' | 'landscape'>('system');
  const orientation = useOrientation(orientationPreference);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [savedTheme, savedOrientation] = await Promise.all([
        AsyncStorage.getItem('themePreference'),
        AsyncStorage.getItem('orientationPreference'),
      ]);

      if (savedTheme) setThemePreference(savedTheme as 'system' | 'light' | 'dark');
      if (savedOrientation) setOrientationPreference(savedOrientation as 'system' | 'portrait' | 'landscape');
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const saveThemePreference = async (newTheme: 'system' | 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem('themePreference', newTheme);
      setThemePreference(newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const saveOrientationPreference = async (newOrientation: 'system' | 'portrait' | 'landscape') => {
    try {
      await AsyncStorage.setItem('orientationPreference', newOrientation);
      setOrientationPreference(newOrientation);
    } catch (error) {
      console.error('Error saving orientation preference:', error);
    }
  };

  const currentColorScheme = themePreference === 'system'
    ? systemColorScheme || 'light'
    : themePreference;

  const themes = orientation === 'LANDSCAPE' ? landscapeThemes : portraitThemes;
  const theme = themes[currentColorScheme];

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        themePreference,
        setThemePreference: saveThemePreference,
        orientationPreference,
        setOrientationPreference: saveOrientationPreference,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => useContext(PreferencesContext);