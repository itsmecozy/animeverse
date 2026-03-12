import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
import { currentUser } from '@/data/mockData';

export const TopBar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved      = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark        = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    /* Left offset matches sidebar:
       no offset on mobile, md: 56px (w-14), lg: 208px (w-52) */
    <header className="fixed top-0 right-0 left-0 md:left-14 lg:left-52 z-40 h-14
      bg-[var(--bg-secondary)]/90 backdrop-blur-md border-b border-[var(--border)]
      flex items-center px-4 sm:px-5 gap-3">

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input type="text" placeholder="Search anime, manga, studios..."
          className="search-input py-2 text-sm" />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
        </button>
        <button onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="flex items-center gap-2 ml-1 py-1 pl-1 pr-3 rounded-full border border-[var(--border-strong)] hover:border-[var(--accent-border)] transition-all bg-[var(--bg-secondary)]">
          <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
            {currentUser.displayName[0]}
          </div>
          <span className="text-sm font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            {currentUser.displayName}
          </span>
        </button>
      </div>
    </header>
  );
};
