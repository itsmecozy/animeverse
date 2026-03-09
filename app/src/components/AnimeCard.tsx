import { Star, Plus } from 'lucide-react';
import type { Anime } from '@/types';

interface AnimeCardProps {
  anime: Anime;
  variant?: 'default' | 'compact' | 'horizontal';
  onClick?: () => void;
  onAddToList?: () => void;
}

export const AnimeCard = ({ anime, variant = 'default', onClick, onAddToList }: AnimeCardProps) => {

  if (variant === 'horizontal') {
    return (
      <div className="watchlist-row cursor-pointer" onClick={onClick}>
        <img src={anime.coverImage} alt={anime.title}
          className="w-14 h-20 object-cover rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{anime.title}</h4>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {anime.type} • {anime.episodes || '?'} EP
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{anime.rating}</span>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAddToList?.(); }}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all shrink-0"
          style={{ color: 'var(--text-muted)' }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="anime-card cursor-pointer group" onClick={onClick}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img src={anime.coverImage} alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h4 className="text-white font-semibold text-xs line-clamp-1">{anime.title}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-2.5 h-2.5 fill-[var(--accent)] text-[var(--accent)]" />
              <span className="text-xs text-white/80">{anime.rating}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="anime-card cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={anime.coverImage} alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
          <Star className="w-2.5 h-2.5 fill-[var(--accent)] text-[var(--accent)]" />
          <span className="text-xs text-white font-semibold">{anime.rating}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onAddToList?.(); }}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white/25">
          <Plus className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-[var(--accent)] transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {anime.title}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {anime.type} • {anime.episodes || '?'} EP • {anime.year}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {anime.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="pill text-[10px] px-2 py-0.5">{genre}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
