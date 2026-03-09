import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react';
import { animeData } from '@/data/mockData';

const SEASONS = ['Winter 2026', 'Fall 2025', 'Summer 2025', 'Spring 2025'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const scheduleMap: Record<string, typeof animeData> = {
  Monday:    [animeData[0]],
  Tuesday:   [animeData[7], animeData[6]],
  Wednesday: [animeData[1]],
  Thursday:  [animeData[4]],
  Friday:    [animeData[2]],
  Saturday:  [animeData[3]],
  Sunday:    [animeData[9]],
};

export const SeasonalPage = () => {
  const [seasonIdx, setSeasonIdx] = useState(0);
  const [view, setView] = useState<'grid' | 'schedule'>('grid');
  const seasonal = animeData.slice(0, 12);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Seasonal</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Currently airing and upcoming anime
          </p>
        </div>

        {/* Season picker */}
        <div className="flex items-center gap-2 p-1 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-secondary)]">
          <button
            onClick={() => setSeasonIdx(Math.min(SEASONS.length - 1, seasonIdx + 1))}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-[var(--text-secondary)]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold px-2" style={{ color: 'var(--text-primary)' }}>
            {SEASONS[seasonIdx]}
          </span>
          <button
            onClick={() => setSeasonIdx(Math.max(0, seasonIdx - 1))}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-[var(--text-secondary)]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(['grid', 'schedule'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
              ${view === v
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-secondary)] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {v === 'grid' ? 'Grid View' : 'Schedule'}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {seasonal.map((anime) => (
            <div key={anime.id} className="anime-card cursor-pointer group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={anime.coverImage} alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                    ${anime.status === 'Ongoing'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]'}`}>
                    {anime.status === 'Ongoing' ? 'Airing' : 'Upcoming'}
                  </span>
                </div>
                <button className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                  {anime.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{anime.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{anime.episodes || '?'} EP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule View */}
      {view === 'schedule' && (
        <div className="space-y-3">
          {DAYS.map((day) => {
            const shows = scheduleMap[day] || [];
            return (
              <div key={day} className="stats-card">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-4 h-4 text-[var(--accent)]" />
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{day}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)]"
                    style={{ color: 'var(--text-muted)' }}>
                    {shows.length} show{shows.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {shows.length > 0 ? (
                  <div className="space-y-2">
                    {shows.map((anime) => (
                      <div key={anime.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer">
                        <img src={anime.coverImage} alt={anime.title}
                          className="w-10 h-14 object-cover rounded-md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                            {anime.title}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {anime.studios[0]} • {anime.episodes || '?'} EP
                          </p>
                        </div>
                        <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)] shrink-0" />
                        <span className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-primary)' }}>
                          {anime.rating}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No shows airing</p>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
