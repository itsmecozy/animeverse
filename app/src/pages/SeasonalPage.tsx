import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
import { AnimeCard } from '@/components/AnimeCard';
import {
  SEASONAL_QUERY, SCHEDULE_QUERY,
  getTitle, getRating, getStudio,
  getCurrentSeason, getWeekRange, groupByDay,
} from '@/lib/anilist';
import type { AniListMedia, AiringSchedule } from '@/lib/anilist';

interface SeasonalData { Page: { media: AniListMedia[] } }
interface ScheduleData { Page: { airingSchedules: AiringSchedule[] } }

const SEASON_LIST = [
  { season: 'WINTER', year: 2026 },
  { season: 'FALL',   year: 2025 },
  { season: 'SUMMER', year: 2025 },
  { season: 'SPRING', year: 2025 },
];
const DAYS_ORDER = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export const SeasonalPage = () => {
  const current    = getCurrentSeason();
  const defaultIdx = SEASON_LIST.findIndex((s) => s.season === current.season && s.year === current.year);
  const [seasonIdx, setSeasonIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const [view, setView] = useState<'grid' | 'schedule'>('grid');

  const { season, year } = SEASON_LIST[seasonIdx];
  const { weekStart, weekEnd } = getWeekRange();

  const { data: seasonData,   loading: seasonLoading,   error: seasonError,   refetch: refetchSeason }   = useAniList<SeasonalData>(SEASONAL_QUERY, { season, year, page: 1, perPage: 30 });
  const { data: scheduleData, loading: scheduleLoading, error: scheduleError, refetch: refetchSchedule } = useAniList<ScheduleData>(SCHEDULE_QUERY, { weekStart, weekEnd });

  const seasonal  = seasonData?.Page.media ?? [];
  const schedules = scheduleData?.Page.airingSchedules ?? [];
  const byDay     = groupByDay(schedules);
  const seasonLabel = `${season[0]}${season.slice(1).toLowerCase()} ${year}`;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="relative">
          <div className="ghost-number absolute -top-3 -left-1 text-[5rem] leading-none hidden md:block" style={{ opacity: 0.08 }}>
            {season.slice(0,3)}
          </div>
          <div className="relative">
            <h1 className="cinematic-title text-2xl md:text-3xl">
              Sea<span className="title-accent">sonal</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Currently airing and upcoming anime
            </p>
          </div>
        </div>

        {/* Season picker */}
        <div className="flex items-center gap-2 p-1 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-secondary)]">
          <button onClick={() => setSeasonIdx(Math.min(SEASON_LIST.length - 1, seasonIdx + 1))}
            disabled={seasonIdx >= SEASON_LIST.length - 1}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold px-2" style={{ color: 'var(--text-primary)' }}>{seasonLabel}</span>
          <button onClick={() => setSeasonIdx(Math.max(0, seasonIdx - 1))}
            disabled={seasonIdx <= 0}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(['grid', 'schedule'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${view === v
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-secondary)] border border-[var(--border-strong)] hover:text-[var(--text-primary)]'}`}
            style={{ color: view === v ? 'white' : 'var(--text-secondary)' }}>
            {v === 'grid' ? 'Grid View' : 'Airing Schedule'}
          </button>
        ))}
      </div>

      {/* Grid */}
      {view === 'grid' && (
        seasonLoading ? <Spinner message="Loading seasonal anime..." /> :
        seasonError   ? <ErrorState message={seasonError} onRetry={refetchSeason} /> :
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 stagger">
          {seasonal.map((media) => <AnimeCard key={media.id} media={media} />)}
        </div>
      )}

      {/* Schedule */}
      {view === 'schedule' && (
        scheduleLoading ? <Spinner message="Loading airing schedule..." /> :
        scheduleError   ? <ErrorState message={scheduleError} onRetry={refetchSchedule} /> :
        <div className="space-y-3">
          {DAYS_ORDER.map((day, dayIdx) => {
            const shows = byDay[day] ?? [];
            return (
              <div key={day} className="stats-card relative overflow-hidden">
                {/* Ghost day number */}
                <div className="ghost-number absolute right-4 top-1/2 -translate-y-1/2 text-[7rem] leading-none"
                  style={{ opacity: 0.05 }}>
                  {String(dayIdx + 1).padStart(2, '0')}
                </div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-4 h-4 text-[var(--accent)]" />
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{day}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)]"
                      style={{ color: 'var(--text-muted)' }}>
                      {shows.length} show{shows.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {shows.length > 0 ? (
                    <div className="space-y-2">
                      {shows.map((s) => (
                        <div key={`${s.airingAt}-${s.media.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer">
                          <img src={s.media.coverImage.large} alt={getTitle(s.media)}
                            className="w-10 h-14 object-cover rounded-md shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                              {getTitle(s.media)}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {getStudio(s.media)}
                            </p>
                          </div>
                          {/* Ep number */}
                          <div className="shrink-0 text-right">
                            <p className="text-lg font-black leading-none" style={{ color: 'var(--accent)' }}>
                              {String(s.episode).padStart(2, '0')}
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>EP</p>
                          </div>
                          {/* Air time */}
                          <div className="shrink-0 text-right hidden sm:block">
                            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {new Date(s.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              ★ {getRating(s.media)}
                            </p>
                          </div>
                          <button className="p-1.5 rounded-lg bg-[var(--accent-subtle)] shrink-0">
                            <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No shows airing</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
