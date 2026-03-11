import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Calendar, BookMarked, Users, Trophy, BarChart2 } from 'lucide-react';

const navItems = [
  { path: '/',           icon: Home,       label: 'Home'       },
  { path: '/discover',   icon: Compass,    label: 'Discover'   },
  { path: '/seasonal',   icon: Calendar,   label: 'Seasonal'   },
  { path: '/lists',      icon: BookMarked, label: 'Lists'      },
  { path: '/community',  icon: Users,      label: 'Community'  },
  { path: '/challenges', icon: Trophy,     label: 'Challenges' },
  { path: '/stats',      icon: BarChart2,  label: 'Stats'      },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-50
      border-r border-[var(--border)] bg-[var(--bg-secondary)] w-52">

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 shrink-0 rounded-lg bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white font-bold text-sm font-['Sora']">A</span>
        </div>
        <span className="font-bold text-base font-['Sora'] whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
          AnimeVerse
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1 mt-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button key={path} onClick={() => navigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left group
                ${active
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'}`}>
              <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              <span className="text-sm font-medium">{label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[var(--border)] flex items-center gap-3">
        <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
          io
        </div>
        <div>
          <p className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>itsmecozy</p>
          <p className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>View Profile</p>
        </div>
      </div>
    </aside>
  );
};
