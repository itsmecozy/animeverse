import { Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AniListMedia } from '@/lib/anilist';
import { getTitle, getRating } from '@/lib/anilist';

interface AnimeCardProps {
  media: AniListMedia;
  rank?: number;
  variant?: 'default' | 'compact' | 'horizontal';
  onClick?: () => void;
}

export const AnimeCard = ({ media, rank, variant = 'default', onClick }: AnimeCardProps) => {
  const navigate = useNavigate();
  const title  = getTitle(media);
  const rating = getRating(media);
  const cover  = media.coverImage.large;
  const status = media.status === 'RELEASING' ? 'Airing' : media.status === 'NOT_YET_RELEASED' ? 'Upcoming' : null;

  const handleClick = () => {
    if (onClick) { onClick(); return; }
    navigate(`/anime/${media.id}`);
  };

  if (variant === 'horizontal') {
    return (
      <div className="watchlist-row cursor-pointer" onClick={handleClick}>
        <img src={cover} alt={title} className="w-12 h-16 object-cover rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{title}</h4>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {media.format ?? 'TV'} • {media.episodes ?? '?'} EP
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{rating}</span>
          </div>
        </div>
        <Plus className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="anime-card cursor-pointer group" onClick={handleClick}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img src={cover} alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Rank ghost number */}
          {rank && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="ghost-number text-[6rem] opacity-60 group-hover:opacity-80 transition-opacity">
                {rank}
              </span>
            </div>
          )}

          {/* Top-left: ep count */}
          {media.episodes && <span className="card-meta-tl">{media.episodes} EP</span>}
          {/* Top-right: rating */}
          <span className="card-meta-tr">★ {rating}</span>

          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h4 className="text-white font-semibold text-xs line-clamp-1">{title}</h4>
          </div>
        </div>
      </div>
    );
  }

  // Default card
  return (
    <div className="anime-card cursor-pointer group" onClick={handleClick}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={cover} alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Metadata corners */}
        {media.episodes && <span className="card-meta-tl">{media.episodes} EP</span>}
        <span className="card-meta-tr">★ {rating}</span>
        {status && <span className="card-meta-bl">{status}</span>}
        {media.genres[0] && <span className="card-meta-br">{media.genres[0]}</span>}

        {/* Add button on hover */}
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-[var(--accent)] transition-colors"
          style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {media.format ?? 'TV'} • {media.seasonYear ?? ''}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {media.genres.slice(0, 2).map((g) => (
            <span key={g} className="pill text-[10px] px-2 py-0.5">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
