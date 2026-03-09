import { useNavigate } from 'react-router-dom';
import { ChevronRight, TrendingUp, Plus } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
import { AnimeCard } from '@/components/AnimeCard';
import { TRENDING_QUERY, FEATURED_QUERY, getTitle, getRating } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';

interface TrendingData { Page: { media: AniListMedia[] } }
interface FeaturedData { Page: { media: AniListMedia[] } }

// Splits a title into [main, lastWord] for split-color rendering
function splitTitle(title: string): [string, string] {
  const words = title.trim().split(' ');
  if (words.length === 1) return ['', title];
  return [words.slice(0, -1).join(' ') + ' ', words[words.length - 1]];
}

export const HomePage = () => {
  const navigate = useNavigate();

  const { data: featuredData, loading: featuredLoading } =
    useAniList<FeaturedData>(FEATURED_QUERY);

  const { data: trendingData, loading: trendingLoading, error: trendingError, refetch } =
    useAniList<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 20 });

  const featured = featuredData?.Page.media[0];
  const trending = trendingData?.Page.media ?? [];
  const [titleMain, titleAccent] = featured ? splitTitle(getTitle(featured)) : ['', ''];

  if (trendingError) return <ErrorState message={trendingError} onRetry={refetch} />;

  return (
    <div className="space-y-14">

      {/* ── Hero Banner ───────────────────────────────────── */}
      {featuredLoading ? (
        <div className="rounded-2xl h-80 md:h-[440px] animate-pulse bg-[var(--bg-tertiary)]" />
      ) : featured && (
        <div className="relative rounded-2xl overflow-hidden h-80 md:h-[440px] animate-scale-in">
          {/* Background image */}
          <img
            src={featured.bannerImage ?? featured.coverImage.extraLarge}
            alt={getTitle(featured)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, var(--bg-primary) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)' }} />

          {/* Ghost year number */}
          <div className="absolute right-6 bottom-0 ghost-number text-[18rem] leading-none hidden md:block"
            style={{ opacity: 0.12 }}>
            {featured.seasonYear}
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-10 max-w-2xl">
            <span className="label-text mb-3 text-[var(--accent)]">Featured Spotlight</span>
            <h1 className="cinematic-title text-3xl md:text-5xl mb-3">
              {titleMain}<span className="title-accent">{titleAccent}</span>
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="pill">{featured.seasonYear}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{featured.genres[0]}</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>★ {getRating(featured)}</span>
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
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
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
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide stagger">
            {trending.slice(0, 10).map((media, i) => (
              <div key={media.id} className="shrink-0 w-36 md:w-44">
                <AnimeCard media={media} variant="compact" rank={i + 1} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Popular Right Now ─────────────────────────────── */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 stagger">
            {trending.slice(0, 8).map((media) => (
              <AnimeCard key={media.id} media={media} />
            ))}
          </div>
        )}
      </section>

      {/* ── Quick Links ───────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {[
          { label: 'My Watchlist', desc: 'Track your anime',  path: '/lists',      color: '#2563EB' },
          { label: 'Seasonal',     desc: 'Winter 2026',       path: '/seasonal',   color: '#38BDF8' },
          { label: 'Community',    desc: 'Reviews & feeds',   path: '/community',  color: '#A78BFA' },
          { label: 'Challenges',   desc: 'Earn badges',       path: '/challenges', color: '#F59E0B' },
        ].map(({ label, desc, path, color }) => (
          <button key={path} onClick={() => navigate(path)}
            className="stats-card text-left hover:border-[var(--accent-border)] transition-all group">
            <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center"
              style={{ background: `${color}18` }}>
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            </div>
            <p className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors"
              style={{ color: 'var(--text-primary)' }}>{label}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </button>
        ))}
      </section>

    </div>
  );
};
