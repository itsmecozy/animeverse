import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Star, Plus } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
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

const SeasonCard = ({ media }: { media: AniListMedia }) => (
  <div className="anime-card cursor-pointer group">
    <div className="relative aspect-[3/4] overflow-hidden">
      <img src={media.coverImage.large} alt={getTitle(media)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute top-2 right-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
          ${media.status === 'RELEASING'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-border)]'}`}>
          {media.status === 'RELEASING' ? 'Airing' : 'Upcoming'}
        </span>
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
      <div className="flex items-center gap-2 mt-1">
        <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getRating(media)}</span>
        <span style={{ color: 'var(--text-muted)' }}>•</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{media.episodes ?? '?'} EP</span>
      </div>
    </div>
  </div>
);

export const SeasonalPage = () => {
  const current = getCurrentSeason();
  const defaultIdx = SEASON_LIST.findIndex(
    (s) => s.season === current.season && s.year === current.year
  );
  const [seasonIdx, setSeasonIdx] = useState(defaultIdx >= 0 ? defaultIdx : 0);
  const [view, setView] = useState<'grid' | 'schedule'>('grid');

  const { season, year } = SEASON_LIST[seasonIdx];
  const { weekStart, weekEnd } = getWeekRange();

  const { data: seasonData, loading: seasonLoading, error: seasonError, refetch: refetchSeason } =
    useAniList<SeasonalData>(SEASONAL_QUERY, { season, year, page: 1, perPage: 30 });

  const { data: scheduleData, loading: scheduleLoading, error: scheduleError, refetch: refetchSchedule } =
    useAniList<ScheduleData>(SCHEDULE_QUERY, { weekStart, weekEnd });

  const seasonal  = seasonData?.Page.media ?? [];
  const schedules = scheduleData?.Page.airingSchedules ?? [];
  const byDay     = groupByDay(schedules);

  const seasonLabel = `${season[0]}${season.slice(1).toLowerCase()} ${year}`;

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
          <button onClick={() => setSeasonIdx(Math.min(SEASON_LIST.length - 1, seasonIdx + 1))}
            disabled={seasonIdx >= SEASON_LIST.length - 1}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-[var(--text-secondary)] disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold px-2" style={{ color: 'var(--text-primary)' }}>
            {seasonLabel}
          </span>
          <button onClick={() => setSeasonIdx(Math.max(0, seasonIdx - 1))}
            disabled={seasonIdx <= 0}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all text-[var(--text-secondary)] disabled:opacity-30">
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
                : 'bg-[var(--bg-secondary)] border border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {v === 'grid' ? 'Grid View' : 'Airing Schedule'}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        seasonLoading ? <Spinner message="Loading seasonal anime..." /> :
        seasonError   ? <ErrorState message={seasonError} onRetry={refetchSeason} /> :
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {seasonal.map((media) => <SeasonCard key={media.id} media={media} />)}
        </div>
      )}

      {/* Schedule View */}
      {view === 'schedule' && (
        scheduleLoading ? <Spinner message="Loading airing schedule..." /> :
        scheduleError   ? <ErrorState message={scheduleError} onRetry={refetchSchedule} /> :
        <div className="space-y-3">
          {DAYS_ORDER.map((day) => {
            const shows = byDay[day] ?? [];
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
                    {shows.map((s) => (
                      <div key={`${s.airingAt}-${s.media.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer">
                        <img src={s.media.coverImage.large} alt={getTitle(s.media)}
                          className="w-10 h-14 object-cover rounded-md shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                            {getTitle(s.media)}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {getStudio(s.media)} • EP {s.episode}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>
                            {new Date(s.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)] shrink-0" />
                        <span className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-primary)' }}>
                          {getRating(s.media)}
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
