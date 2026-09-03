'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const storageKey = 'coach-rickie-theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const next: Theme = saved === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(storageKey, next);
    setTheme(next);
  }

  const switchingToLight = theme === 'dark';
  return <button className="theme-toggle cut-corner" type="button" onClick={toggleTheme} aria-label={`Switch to ${switchingToLight ? 'light' : 'dark'} mode`} title={`Switch to ${switchingToLight ? 'light' : 'dark'} mode`}>
    {switchingToLight ? <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.4 15.5A8.5 8.5 0 0 1 8.5 3.6 8.5 8.5 0 1 0 20.4 15.5Z" /></svg>}
  </button>;
}
