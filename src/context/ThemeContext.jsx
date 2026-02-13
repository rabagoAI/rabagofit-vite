import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Preferences: 'light', 'dark', 'sepia', 'high-contrast', 'system'
    const [themePreference, setThemePreference] = useState(() => {
        return localStorage.getItem('rabago_theme_preference') || 'system';
    });

    // Resolved theme (actual visual state)
    const [activeTheme, setActiveTheme] = useState('light');

    // Per-page override
    const [forcedTheme, setForcedTheme] = useState(null);

    // Accessibility
    const [isReducedMotion, setIsReducedMotion] = useState(() =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    // 1. Resolve 'system' preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const resolveTheme = () => {
            if (forcedTheme) return forcedTheme;
            if (themePreference === 'system') {
                return mediaQuery.matches ? 'dark' : 'light';
            }
            return themePreference;
        };

        const updateTheme = () => setActiveTheme(resolveTheme());

        // Initial resolve
        updateTheme();

        // Listen for OS changes (only relevant if system)
        const handleSystemChange = (e) => {
            if (!forcedTheme && themePreference === 'system') {
                setActiveTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }, [themePreference, forcedTheme]);

    // 2. Apply theme classes to HTML
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all known theme classes
        root.classList.remove('light', 'dark', 'sepia', 'high-contrast');

        // Add active theme class
        root.classList.add(activeTheme);

        // Ensure Tailwind 'dark' class is present if theme is dark or high-contrast (usually dark-based)
        if (activeTheme === 'dark' || activeTheme === 'high-contrast') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Persist preference
        localStorage.setItem('rabago_theme_preference', themePreference);

    }, [activeTheme, themePreference]);

    // 3. Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'rabago_theme_preference') {
                setThemePreference(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // 4. Reduced Motion Listener
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const setTheme = (newTheme) => {
        setThemePreference(newTheme);
    };

    return (
        <ThemeContext.Provider value={{
            theme: themePreference,
            activeTheme,
            setTheme,
            setForcedTheme,
            isReducedMotion
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
