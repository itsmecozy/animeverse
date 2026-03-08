import { Star, Play, Plus } from 'lucide-react';
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
      <div
        className="watchlist-row cursor-pointer"
        onClick={onClick}
      >
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="w-16 h-24 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{anime.title}</h4>
          <p className="text-sm text-[#A7ACB8]">{anime.type} • {anime.episodes || '?'} EP</p>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 text-[#7B61FF] fill-[#7B61FF]" />
            <span className="text-sm">{anime.rating}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToList?.();
          }}
          className="p-2 rounded-full bg-white/5 hover:bg-[#7B61FF]/20 transition-colors"
        >
          <Plus className="w-5 h-5 text-[#7B61FF]" />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className="anime-card cursor-pointer group"
        onClick={onClick}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={anime.coverImage}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h4 className="font-semibold text-white text-sm line-clamp-1">{anime.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-3 h-3 text-[#7B61FF] fill-[#7B61FF]" />
              <span className="text-xs text-[#A7ACB8]">{anime.rating}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="anime-card cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent opacity-80" />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#7B61FF]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
            <Play className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.();
            }}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#07070A]/80 backdrop-blur-sm">
          <Star className="w-3 h-3 text-[#7B61FF] fill-[#7B61FF]" />
          <span className="text-xs font-semibold">{anime.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-1 group-hover:text-[#7B61FF] transition-colors">
          {anime.title}
        </h3>
        <p className="text-sm text-[#A7ACB8] mt-1">
          {anime.type} • {anime.episodes || '?'} EP • {anime.year}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {anime.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="pill text-xs">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
