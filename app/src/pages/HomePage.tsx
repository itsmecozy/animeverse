import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, TrendingUp, Plus } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
import {
  TRENDING_QUERY, FEATURED_QUERY,
  AniListMedia, getTitle, getRating,
} from '@/lib/anilist';

interface TrendingData { Page: { media: AniListMedia[] } }
interface FeaturedData { Page: { media: AniListMedia[] } }

const MediaCard = ({ media, rank }: { media: AniListMedia; rank?: number }) => (
  <div className="anime-card cursor-pointer group shrink-0 w-36 md:w-44">
    <div className="relative aspect-[3/4] overflow-hidden">
      <img src={media.coverImage.large} alt={getTitle(media)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {rank && (
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
          <span className="text-white text-xs font-bold">{rank}</span>
        </div>
      )}
      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm">
        <Star className="w-2.5 h-2.5 fill-[var(--accent)] text-[var(--accent)]" />
        <span className="text-xs text-white font-semibold">{getRating(media)}</span>
      </div>
    </div>
    <div className="p-2">
      <p className="font-semibold text-xs line-clamp-2" style={{ color: 'var(--text-primary)' }}>
        {getTitle(media)}
      </p>
    </div>
  </div>
);

const GridCard = ({ media }: { media: AniListMedia }) => (
  <div className="anime-card cursor-pointer group">
    <div className="relative aspect-[3/4] overflow-hidden">
      <img src={media.coverImage.large} alt={getTitle(media)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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

export const HomePage = () => {
  const navigate = useNavigate();

  const { data: featuredData, loading: featuredLoading, error: featuredError } =
    useAniList<FeaturedData>(FEATURED_QUERY);

  const { data: trendingData, loading: trendingLoading, error: trendingError, refetch } =
    useAniList<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 20 });

  const featured  = featuredData?.Page.media[0];
  const trending  = trendingData?.Page.media ?? [];
  const newRelease = trending.slice(0, 8);

  if (trendingError) return <ErrorState message={trendingError} onRetry={refetch} />;

  return (
    <div className="space-y-12">

      {/* ── Hero Banner ───────────────────────────────────── */}
      {featuredLoading ? (
        <div className="rounded-2xl h-80 md:h-[420px] animate-pulse bg-[var(--bg-tertiary)]" />
      ) : featuredError || !featured ? null : (
        <div className="relative rounded-2xl overflow-hidden h-80 md:h-[420px]">
          <img
            src={featured.bannerImage ?? featured.coverImage.extraLarge}
            alt={getTitle(featured)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, var(--bg-primary) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)' }} />
          <div className="relative h-full flex flex-col justify-end p-8 md:p-10 max-w-xl">
            <span className="label-text mb-3 text-[var(--accent)]">Featured Spotlight</span>
            <h1 className="text-3xl md:text-4xl font-bold font-['Sora'] leading-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              {getTitle(featured)}
            </h1>
            <div className="flex items-center gap-3 mb-5">
              <span className="pill">{featured.seasonYear}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {featured.genres[0]}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {getRating(featured)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary"><Plus className="w-4 h-4" /> Add to List</button>
              <button className="btn-secondary" onClick={() => navigate('/discover')}>Explore More</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Trending ──────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Trending This Week
            </h2>
          </div>
          <button onClick={() => navigate('/discover')}
            className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {trendingLoading ? <Spinner /> : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trending.slice(0, 10).map((media, i) => (
              <MediaCard key={media.id} media={media} rank={i + 1} />
            ))}
          </div>
        )}
      </section>

      {/* ── New Releases ──────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
            Popular Right Now
          </h2>
          <button onClick={() => navigate('/seasonal')}
            className="flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline">
            See seasonal <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {trendingLoading ? <Spinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newRelease.map((media) => <GridCard key={media.id} media={media} />)}
          </div>
        )}
      </section>

      {/* ── Quick Links ───────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'My Watchlist', desc: 'Track your anime',  path: '/lists',      color: '#4A6FA5' },
          { label: 'Seasonal',     desc: 'Winter 2026',       path: '/seasonal',   color: '#38BDF8' },
          { label: 'Community',    desc: 'Reviews & feeds',   path: '/community',  color: '#A78BFA' },
          { label: 'Challenges',   desc: 'Earn badges',       path: '/challenges', color: '#F59E0B' },
        ].map(({ label, desc, path, color }) => (
          <button key={path} onClick={() => navigate(path)}
            className="stats-card text-left hover:border-[var(--accent-border)] transition-all">
            <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
              style={{ background: `${color}20` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            </div>
            <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </button>
        ))}
      </section>

    </div>
  );
};
