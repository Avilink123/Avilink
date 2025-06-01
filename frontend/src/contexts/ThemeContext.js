import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Récupérer la préférence sauvegardée ou utiliser la préférence système
    const saved = localStorage.getItem('avimarche-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Sauvegarder la préférence
    localStorage.setItem('avimarche-theme', isDark ? 'dark' : 'light');
    
    // Appliquer la classe CSS au document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      // Couleurs principales Mali conservées
      primary: isDark ? '#22c55e' : '#16a34a', // Vert Mali
      primaryLight: isDark ? '#4ade80' : '#22c55e',
      secondary: '#fbbf24', // Jaune Mali
      
      // Couleurs adaptatives
      background: isDark ? '#111827' : '#ffffff',
      surface: isDark ? '#1f2937' : '#f9fafb',
      card: isDark ? '#374151' : '#ffffff',
      
      // Texte adaptatif
      text: isDark ? '#f9fafb' : '#111827',
      textSecondary: isDark ? '#d1d5db' : '#6b7280',
      textMuted: isDark ? '#9ca3af' : '#9ca3af',
      
      // Bordures
      border: isDark ? '#4b5563' : '#e5e7eb',
      borderLight: isDark ? '#374151' : '#f3f4f6',
      
      // États
      success: isDark ? '#34d399' : '#10b981',
      warning: isDark ? '#fbbf24' : '#f59e0b',
      error: isDark ? '#f87171' : '#ef4444',
      info: isDark ? '#60a5fa' : '#3b82f6'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};