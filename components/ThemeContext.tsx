import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const themes = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    card: '#F5F5F5',
    border: '#E0E0E0',
  },
  dark: {
    background: '#121212',
    text: '#FFFFFF',
    card: '#1E1E1E',
    border: '#333333',
  },
};

const ThemeContext = createContext({
  theme: themes.light,
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);