import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightPalette, highContrastPalette, SETTINGS_STORAGE_KEY } from '../constants/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [highContrast, setHighContrast] = useState(false);
  const [autoArchiveDone, setAutoArchiveDone] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setHighContrast(!!parsed.highContrast);
          setAutoArchiveDone(!!parsed.autoArchiveDone);
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ highContrast, autoArchiveDone }));
  }, [highContrast, autoArchiveDone, isLoaded]);

  const palette = highContrast ? highContrastPalette : lightPalette;

  return (
    <ThemeContext.Provider value={{
      highContrast,
      setHighContrast,
      autoArchiveDone,
      setAutoArchiveDone,
      palette,
      isLoaded
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
