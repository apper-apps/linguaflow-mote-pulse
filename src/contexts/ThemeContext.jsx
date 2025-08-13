import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '@/services/api/settingsService';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Detect system preference
  const getSystemPreference = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Initialize theme
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Try to get saved preference from settings
        const settings = await settingsService.getById(1);
        if (settings && typeof settings.darkMode === 'boolean') {
          setIsDarkMode(settings.darkMode);
        } else {
          // Fall back to localStorage
          const savedTheme = localStorage.getItem('darkMode');
          if (savedTheme !== null) {
            setIsDarkMode(JSON.parse(savedTheme));
          } else {
            // Fall back to system preference
            setIsDarkMode(getSystemPreference());
          }
        }
      } catch (error) {
        // Fall back to system preference if service fails
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        } else {
          setIsDarkMode(getSystemPreference());
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isLoading]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if no manual preference is set
      const hasManualPreference = localStorage.getItem('darkMode') !== null;
      if (!hasManualPreference) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Save to settings service
    try {
      await settingsService.update(1, { darkMode: newDarkMode });
    } catch (error) {
      console.warn('Failed to save dark mode preference to settings:', error);
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};