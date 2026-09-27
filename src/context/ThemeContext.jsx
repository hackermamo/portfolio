"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
  mounted: false,
});

// Helper: apply theme class to <html> element
function applyThemeToDOM(newTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (newTheme === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);
  // Keep a ref so toggleTheme never has a stale closure
  const themeRef = useRef('light');

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('portfolio-theme');
      let initialTheme = 'light';

      if (savedTheme === 'dark' || savedTheme === 'light') {
        initialTheme = savedTheme;
      } else {
        const prefersDark =
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialTheme = prefersDark ? 'dark' : 'light';
      }

      themeRef.current = initialTheme;
      setTheme(initialTheme);
      applyThemeToDOM(initialTheme);
    } catch (e) {
      console.error('Theme detection error:', e);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = themeRef.current === 'dark' ? 'light' : 'dark';
    themeRef.current = nextTheme;
    setTheme(nextTheme);
    applyThemeToDOM(nextTheme);
    try {
      localStorage.setItem('portfolio-theme', nextTheme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, []);

  const setThemeMode = useCallback((newTheme) => {
    themeRef.current = newTheme;
    setTheme(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem('portfolio-theme', newTheme);
    } catch (e) {}
  }, []);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
