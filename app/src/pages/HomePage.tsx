import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, Eye, Play, Plus, Star } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { Spinner, ErrorState } from '@/components/Spinner';
import { AnimeCard } from '@/components/AnimeCard';
import { TRENDING_QUERY, FEATURED_QUERY, getTitle, getRating } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';

interface TrendingData { Page: { media: AniListMedia[] } }
interface FeaturedData { Page: { media: AniListMedia[] } }

function splitTitle(title: string): [string, string] {
  const words = title.trim().split(' ');
  if (words.length === 1) return ['', title];
  return [words.slice(0, -1).join(' ') + ' ', words[words.length - 1]];
}

function StarRating({ score }: { score: number | null }) {
  if (!score) return null;
  const stars = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s}
          className={`w-4 h-4 ${s <= stars ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-white/30'}`} />
      ))}
    </div>
  );
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  const { data: featuredData, loading: featuredLoading } =
    useAniList<FeaturedData>(FEATURED_QUERY);
  const { data: trendingData, loading: trendingLoading, error: trendingError, refetch } =
    useAniList<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 20 });

  const featured = featuredData?.Page.media.slice(0, 5) ?? [];
  const trending = trendingData?.Page.media ?? [];

  const goTo = useCallback((idx: number) => {
    if (animating || idx === slide) return;
    setAnimating(true);
    setSlide(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating, slide]);

  const prev = () => goTo((slide - 1 + featured.length) % featured.length);
  const next = useCallback(() => goTo((slide + 1) % featured.length), [goTo, slide, featured.length]);

  // Auto-advance every 5s
  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, featured.length]);

  const current = featured[slide];
  const [titleMain, titleAccent] = current ? splitTitle(getTitle(current)) : ['', ''];

  if (trendingError) return <ErrorState message={trendingError} onRetry={refetch} />;

  return (
    <div className="space-y-12">

      {/* ── Hero Carousel + Trending Sidebar ─────────────────── */}
      <div className="flex gap-4 items-stretch">

        {/* Carousel */}
        <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[420px] md:min-h-[500px]">

          {featuredLoading || !current ? (
            <div className="w-full h-full min-h-[420px] animate-pulse rounded-2xl bg-[var(--bg-tertiary)]" />
          ) : (
            <>
              {/* Slides — render all, show active */}
              {featured.map((media, i) => (
                <div key={media.id}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0 }}>
                  <img
                    src={media.bannerImage ?? media.coverImage.extraLarge}
                    alt={getTitle(media)}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Chainsaw-style: strong left + bottom gradient */}
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(105deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.20) 65%, transparent 100%)'
                  }} />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)'
                  }} />
                </div>
              ))}

              {/* Content — always on top */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-7 md:p-10 max-w-lg">
                {/* Rank badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--accent)', color: 'white' }}>
                    #{slide + 1} Most Popular
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {current.genres[0]} • {current.format ?? 'TV'}
                  </span>
                </div>

                {/* Title — split color */}
                <h1 className="font-black leading-none mb-3 text-white"
                  style={{ fontFamily: 'Sora', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}>
                  {titleMain}<span style={{ color: 'var(--accent)' }}>{titleAccent}</span>
                </h1>

                {/* Description */}
                {current.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3"
                    style={{ color: 'rgba(255,255,255,0.60)' }}
                    dangerouslySetInnerHTML={{ __html: current.description.replace(/<[^>]*>/g, '').slice(0, 200) + '...' }} />
                )}

                {/* Star rating */}
                <div className="flex items-center gap-3 mb-5">
                  <StarRating score={current.averageScore} />
                  <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {getRating(current)}/10
                  </span>
                  {current.episodes && (
                    <span className="text-xs px-2 py-0.5 rounded border"
                      style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>
                      {current.episodes} EP
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button className="btn-primary" onClick={() => navigate(`/anime/${current.id}`)}>
                    <Play className="w-4 h-4" /> Watch Now
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white', background: 'rgba(255,255,255,0.08)' }}
                    onClick={() => {}}>
                    <Plus className="w-4 h-4" /> Add to List
                  </button>
                </div>
              </div>

              {/* Slide counter bottom-right */}
              <div className="absolute bottom-6 right-6 z-10 flex items-center gap-3">
                <div className="flex gap-1.5">
                  {featured.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: i === slide ? '24px' : '6px',
                        height: '6px',
                        background: i === slide ? 'var(--accent)' : 'rgba(255,255,255,0.35)'
                      }} />
                  ))}
                </div>
                <span className="text-white font-black text-2xl font-['Sora'] opacity-60 hidden md:block">
                  {String(slide + 1).padStart(2, '0')}
                  <span className="text-sm opacity-50">/{String(featured.length).padStart(2, '0')}</span>
                </span>
              </div>

              {/* Prev/Next arrows */}
              <button onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button onClick={next}
                className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Trending Sidebar — desktop only */}
        <div className="hidden lg:flex flex-col w-60 xl:w-68 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-sm font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Trending</span>
            </div>
            <button onClick={() => navigate('/discover')}
              className="text-xs text-[var(--accent)] hover:underline">All</button>
          </div>

          <div className="flex-1 space-y-0.5 overflow-y-auto scrollbar-hide">
            {trendingLoading ? (
              <Spinner />
            ) : trending.slice(0, 8).map((media, i) => (
              <button key={media.id} onClick={() => navigate(`/anime/${media.id}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all group text-left">
                <span className="text-xl font-black w-7 shrink-0 leading-none font-['Sora']"
                  style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <img src={media.coverImage.large} alt={getTitle(media)}
                  className="w-10 h-14 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {getTitle(media)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Eye className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {(media.popularity ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Popular Right Now ─────────────────────────────────── */}
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
            {trending.slice(0, 8).map((media, i) => (
              <div key={media.id} className="relative">
                <div className="ghost-number absolute -left-2 -top-3 leading-none z-0 pointer-events-none"
                  style={{ fontSize: '5rem', opacity: 0.12 }}>
                  {i + 1}
                </div>
                <div className="relative z-10">
                  <AnimeCard media={media} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Mobile Trending ───────────────────────────────────── */}
      <section className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-base font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>Trending</h2>
          </div>
          <button onClick={() => navigate('/discover')}
            className="text-xs text-[var(--accent)] hover:underline">View all</button>
        </div>
        {trendingLoading ? <Spinner /> : (
          <div className="space-y-1">
            {trending.slice(0, 5).map((media, i) => (
              <button key={media.id} onClick={() => navigate(`/anime/${media.id}`)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-tertiary)] transition-all group text-left">
                <span className="text-xl font-black w-6 shrink-0 font-['Sora']"
                  style={{ color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <img src={media.coverImage.large} alt={getTitle(media)}
                  className="w-10 h-14 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{getTitle(media)}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{media.format ?? 'TV'} • ★ {getRating(media)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Quick Links ───────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {[
          { label: 'My Watchlist', desc: 'Track your anime', path: '/lists',      color: '#2563EB' },
          { label: 'Seasonal',     desc: 'Winter 2026',      path: '/seasonal',   color: '#38BDF8' },
          { label: 'Community',    desc: 'Reviews & feeds',  path: '/community',  color: '#A78BFA' },
          { label: 'Challenges',   desc: 'Earn badges',      path: '/challenges', color: '#F59E0B' },
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
