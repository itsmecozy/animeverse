import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { currentUser } from '@/data/mockData';

interface HeaderProps {
  onNavigate: (section: string) => void;
  currentSection: string;
}

export const Header = ({ onNavigate, currentSection }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'discover', label: 'Discover' },
    { id: 'seasonal', label: 'Seasonal' },
    { id: 'lists', label: 'Lists' },
    { id: 'community', label: 'Community' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
        isScrolled
          ? 'bg-[#07070A]/90 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-[7vw] py-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl font-bold font-['Sora'] tracking-tight text-white group-hover:text-[#7B61FF] transition-colors">
            AnimeVerse
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`accent-text transition-colors ${
                currentSection === item.id
                  ? 'text-[#7B61FF]'
                  : 'text-[#A7ACB8] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Search className="w-5 h-5 text-[#A7ACB8]" />
          </button>

          {currentUser ? (
            <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#4ECDC4] flex items-center justify-center text-sm font-bold">
                {currentUser.displayName[0]}
              </div>
              <span className="text-sm font-medium hidden sm:block">{currentUser.displayName}</span>
            </button>
          ) : (
            <button className="btn-primary hidden sm:flex">Sign In</button>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#A7ACB8]" />
            ) : (
              <Menu className="w-5 h-5 text-[#A7ACB8]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#07070A]/95 backdrop-blur-md border-b border-white/5 py-4">
          <nav className="flex flex-col gap-2 px-[7vw]">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`accent-text py-3 text-left transition-colors ${
                  currentSection === item.id
                    ? 'text-[#7B61FF]'
                    : 'text-[#A7ACB8] hover:text-white'
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
