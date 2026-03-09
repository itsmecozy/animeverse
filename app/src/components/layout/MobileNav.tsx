import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Calendar, BookMarked, Users } from 'lucide-react';

const navItems = [
  { path: '/',          icon: Home,       label: 'Home'     },
  { path: '/discover',  icon: Compass,    label: 'Discover' },
  { path: '/seasonal',  icon: Calendar,   label: 'Seasonal' },
  { path: '/lists',     icon: BookMarked, label: 'Lists'    },
  { path: '/community', icon: Users,      label: 'Community'},
];

export const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-around px-2 py-2 safe-bottom">
      {navItems.map(({ path, icon: Icon, label }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200
              ${active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}
          >
            <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};
