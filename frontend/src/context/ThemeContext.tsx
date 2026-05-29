import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('aimcf_theme');
    return (saved as ThemeMode) || 'dark'; // Dark theme default for stunning aesthetics
  });

  useEffect(() => {
    localStorage.setItem('aimcf_theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Synchronized MUI Theme matching HSL variables
  const muiTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6', // Blue 500
      },
      secondary: {
        main: '#10b981', // Emerald 500
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#020617',
        paper: mode === 'light' ? '#ffffff' : '#0b1329',
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#f8fafc',
        secondary: mode === 'light' ? '#475569' : '#94a3b8',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.08)'}`,
            boxShadow: mode === 'light' ? '0 8px 32px 0 rgba(148, 163, 184, 0.08)' : '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            backdropFilter: 'blur(12px)',
            background: mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(11, 19, 41, 0.75)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};
