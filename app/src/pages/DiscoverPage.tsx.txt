import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
import { AnimeCard } from '@/components/AnimeCard';
import { SEARCH_QUERY } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';

interface SearchData {
  Page: { pageInfo: { total: number }; media: AniListMedia[] };
}

const GENRES  = ['Action','Adventure','Comedy','Drama','Fantasy','Horror','Mecha','Mystery','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'];
const YEARS   = [2026,2025,2024,2023,2022,2021,2020];
const FORMATS = [{ label: 'TV', value: 'TV' },{ label: 'Movie', value: 'MOVIE' },{ label: 'OVA', value: 'OVA' },{ label: 'ONA', value: 'ONA' }];

const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
      ${active
        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
        : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}>
    {label}
  </button>
);

export const DiscoverPage = () => {
  const [input,       setInput]       = useState('');
  const [search,      setSearch]      = useState('');
  const [genre,       setGenre]       = useState<string | null>(null);
  const [year,        setYear]        = useState<number | null>(null);
  const [format,      setFormat]      = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(debounceRef.current as ReturnType<typeof setTimeout>);
    debounceRef.current = setTimeout(() => setSearch(input), 500);
    return () => clearTimeout(debounceRef.current as ReturnType<typeof setTimeout>);
  }, [input]);

  const { data, loading, error, refetch } = useAniList<SearchData>(SEARCH_QUERY, {
    search: search || undefined,
    genre:  genre  || undefined,
    year:   year   || undefined,
    format: format || undefined,
    page: 1, perPage: 30,
  });

  const results    = data?.Page.media ?? [];
  const total      = data?.Page.pageInfo.total ?? 0;
  const hasFilters = !!genre || !!year || !!format;

  return (
    <div className="space-y-6">

      {/* Header with ghost text */}
      <div className="relative">
        <div className="ghost-number absolute -top-4 -left-2 text-[6rem] leading-none hidden md:block"
          style={{ opacity: 0.07 }}>DISC</div>
        <div className="relative">
          <h1 className="cinematic-title text-2xl md:text-3xl">
            Dis<span className="title-accent">cover</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Browse and find your next favourite anime
          </p>
        </div>
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
        <div className="stats-card space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Filters</p>
            {hasFilters && (
              <button onClick={() => { setGenre(null); setYear(null); setFormat(null); }}
                className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div>
            <p className="label-text mb-2">Genre</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => <Chip key={g} label={g} active={genre === g} onClick={() => setGenre(genre === g ? null : g)} />)}
            </div>
          </div>
          <div>
            <p className="label-text mb-2">Year</p>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => <Chip key={y} label={String(y)} active={year === y} onClick={() => setYear(year === y ? null : y)} />)}
            </div>
          </div>
          <div>
            <p className="label-text mb-2">Format</p>
            <div className="flex flex-wrap gap-2">
              {FORMATS.map(({ label, value }) => <Chip key={value} label={label} active={format === value} onClick={() => setFormat(format === value ? null : value)} />)}
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {total.toLocaleString()} result{total !== 1 ? 's' : ''}{search && ` for "${search}"`}
        </p>
      )}

      {loading ? <Spinner message="Searching..." /> : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger">
          {results.map((media) => <AnimeCard key={media.id} media={media} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>No results found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          {hasFilters && <button onClick={() => { setGenre(null); setYear(null); setFormat(null); }} className="btn-secondary mt-4">Clear Filters</button>}
        </div>
      )}

    </div>
  );
};
