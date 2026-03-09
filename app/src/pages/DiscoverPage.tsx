import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { animeData } from '@/data/mockData';
import { AnimeCard } from '@/components/AnimeCard';

const GENRES = ['All','Action','Adventure','Comedy','Drama','Fantasy','Romance','Sci-Fi','Supernatural','Sports','Suspense'];
const YEARS  = ['All','2026','2025','2024','2023','2022','2021'];
const TYPES  = ['All','TV','Movie','OVA','ONA'];

export const DiscoverPage = () => {
  const [search,      setSearch]      = useState('');
  const [genre,       setGenre]       = useState('All');
  const [year,        setYear]        = useState('All');
  const [type,        setType]        = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = animeData.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre  = genre === 'All' || a.genres.includes(genre);
    const matchYear   = year  === 'All' || String(a.year) === year;
    const matchType   = type  === 'All' || a.type === type;
    return matchSearch && matchGenre && matchYear && matchType;
  });

  const hasFilters = genre !== 'All' || year !== 'All' || type !== 'All';

  const clearFilters = () => { setGenre('All'); setYear('All'); setType('All'); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Discover</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Browse and find your next favourite anime or manga
        </p>
      </div>

      {/* Search + Filter row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search anime or manga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${hasFilters ? 'border-[var(--accent)] text-[var(--accent)]' : ''}`}
        >
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
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline">
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {/* Genre */}
          <div>
            <p className="label-text mb-2">Genre</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button key={g} onClick={() => setGenre(g)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${genre === g
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)]'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <p className="label-text mb-2">Year</p>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <button key={y} onClick={() => setYear(y)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${year === y
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)]'}`}>
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <p className="label-text mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${type === t
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--accent)]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        {search && ` for "${search}"`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>No results found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="btn-secondary mt-4">Clear Filters</button>
        </div>
      )}

    </div>
  );
};
