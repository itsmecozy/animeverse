import { useState, useEffect } from 'react';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { currentUser } from '@/data/mockData';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export const Header = ({ onNavigate, currentSection }: HeaderProps) => {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const [isDark, setIsDark]               = useState(false);

  // Persist theme preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'discover',  label: 'Discover'  },
    { id: 'seasonal',  label: 'Seasonal'  },
    { id: 'lists',     label: 'Lists'     },
    { id: 'community', label: 'Community' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-secondary)]/90 backdrop-blur-md border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-[6vw] py-4">

        {/* Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-bold text-sm font-['Sora']">A</span>
          </div>
          <span className="text-lg font-bold font-['Sora'] tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
            AnimeVerse
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentSection === item.id
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
            <Search className="w-4 h-4" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
            aria-label="Toggle theme"
          >
            {isDark
              ? <Sun  className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          {/* User / Sign In */}
          {currentUser ? (
            <button className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-full border border-[var(--border-strong)] bg-[var(--bg-secondary)] hover:border-[var(--accent-border)] transition-all">
              <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                {currentUser.displayName[0]}
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button className="btn-primary hidden sm:flex">Sign In</button>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all"
            onClick={() => setMobileMenu(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen
              ? <X    className="w-4 h-4" />
              : <Menu className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] shadow-lg py-3">
          <nav className="flex flex-col gap-1 px-[6vw]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenu(false); }}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium text-left transition-all ${
                  currentSection === item.id
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
