import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Calendar, BookMarked, Users, Trophy, BarChart2 } from 'lucide-react';

const navItems = [
  { path: '/',          icon: Home,       label: 'Home'      },
  { path: '/discover',  icon: Compass,    label: 'Discover'  },
  { path: '/seasonal',  icon: Calendar,   label: 'Seasonal'  },
  { path: '/lists',     icon: BookMarked, label: 'Lists'     },
  { path: '/community', icon: Users,      label: 'Community' },
  { path: '/challenges',icon: Trophy,     label: 'Challenges'},
  { path: '/stats',     icon: BarChart2,  label: 'Stats'     },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`hidden md:flex flex-col fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out
        border-r border-[var(--border)] bg-[var(--bg-secondary)]
        ${hovered ? 'w-52' : 'w-16'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)] overflow-hidden">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white font-bold text-sm font-['Sora']">A</span>
        </div>
        <span className={`font-bold text-base font-['Sora'] text-[var(--text-primary)] whitespace-nowrap transition-all duration-300
          ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
          AnimeVerse
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 overflow-hidden w-full text-left
                ${active
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300
                ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom user avatar */}
      <div className={`p-3 border-t border-[var(--border)] flex items-center gap-3 overflow-hidden`}>
        <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
        <div className={`transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">AnimeFan</p>
          <p className="text-xs text-[var(--text-muted)] whitespace-nowrap">View Profile</p>
        </div>
      </div>
    </aside>
  );
};
