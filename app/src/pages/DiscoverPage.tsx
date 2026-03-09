import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, Star, Plus } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
import { SEARCH_QUERY, getTitle, getRating } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';

interface SearchData {
  Page: {
    pageInfo: { total: number; hasNextPage: boolean };
    media: AniListMedia[];
  };
}

const GENRES = ['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mecha','Mystery','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'];
const YEARS  = [2026,2025,2024,2023,2022,2021,2020];
const FORMATS: { label: string; value: string }[] = [
  { label: 'TV',    value: 'TV'    },
  { label: 'Movie', value: 'MOVIE' },
  { label: 'OVA',   value: 'OVA'   },
  { label: 'ONA',   value: 'ONA'   },
];

const MediaCard = ({ media }: { media: AniListMedia }) => (
  <div className="anime-card cursor-pointer group">
    <div className="relative aspect-[3/4] overflow-hidden">
      <img src={media.coverImage.large} alt={getTitle(media)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
        <Star className="w-2.5 h-2.5 fill-[var(--accent)] text-[var(--accent)]" />
        <span className="text-xs text-white font-semibold">{getRating(media)}</span>
      </div>
      <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white/25">
        <Plus className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
    <div className="p-3">
      <p className="font-semibold text-sm line-clamp-1 group-hover:text-[var(--accent)] transition-colors"
        style={{ color: 'var(--text-primary)' }}>
        {getTitle(media)}
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {media.format ?? 'TV'} • {media.episodes ?? '?'} EP • {media.seasonYear ?? ''}
      </p>
      <div className="flex flex-wrap gap-1 mt-2">
        {media.genres.slice(0, 2).map((g) => (
          <span key={g} className="pill text-[10px] px-2 py-0.5">{g}</span>
        ))}
      </div>
    </div>
  </div>
);

export const DiscoverPage = () => {
  const [input,       setInput]       = useState('');
  const [search,      setSearch]      = useState('');
  const [genre,       setGenre]       = useState<string | null>(null);
  const [year,        setYear]        = useState<number | null>(null);
  const [format,      setFormat]      = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(input), 500);
    return () => clearTimeout(debounceRef.current as ReturnType<typeof setTimeout>);
  }, [input]);

  const variables = {
    search:  search  || undefined,
    genre:   genre   || undefined,
    year:    year    || undefined,
    format:  format  || undefined,
    page:    1,
    perPage: 30,
  };

  const { data, loading, error, refetch } = useAniList<SearchData>(SEARCH_QUERY, variables);
  const results = data?.Page.media ?? [];
  const total   = data?.Page.pageInfo.total ?? 0;

  const hasFilters = !!genre || !!year || !!format;
  const clearFilters = () => { setGenre(null); setYear(null); setFormat(null); };

  const FilterChip = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
    <button onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
        ${active
          ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
          : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)]'}`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Discover</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Browse and find your next favourite anime
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search anime..."
            value={input} onChange={(e) => setInput(e.target.value)}
            className="search-input" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${hasFilters ? 'border-[var(--accent)] text-[var(--accent)]' : ''}`}>
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="stats-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div>
            <p className="label-text mb-2">Genre</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <FilterChip key={g} label={g} active={genre === g}
                  onClick={() => setGenre(genre === g ? null : g)} />
              ))}
            </div>
          </div>
          <div>
            <p className="label-text mb-2">Year</p>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <FilterChip key={y} label={String(y)} active={year === y}
                  onClick={() => setYear(year === y ? null : y)} />
              ))}
            </div>
          </div>
          <div>
            <p className="label-text mb-2">Format</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(({ label, value }) => (
                <FilterChip key={value} label={label} active={format === value}
                  onClick={() => setFormat(format === value ? null : value)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {total.toLocaleString()} result{total !== 1 ? 's' : ''}
          {search && ` for "${search}"`}
        </p>
      )}

      {/* Content */}
      {loading ? <Spinner message="Searching..." /> : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((media) => <MediaCard key={media.id} media={media} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>No results found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          {hasFilters && <button onClick={clearFilters} className="btn-secondary mt-4">Clear Filters</button>}
        </div>
      )}

    </div>
  );
};
