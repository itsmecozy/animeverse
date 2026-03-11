import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, Eye, Play, Plus, Star, Flame } from 'lucide-react';
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
  const filled = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} style={{ width: 15, height: 15 }}
          className={s <= filled ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-white/25'} />
      ))}
    </div>
  );
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [slide, setSlide]       = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const { data: featuredData, loading: featuredLoading } =
    useAniList<FeaturedData>(FEATURED_QUERY);
  const { data: trendingData, loading: trendingLoading, error: trendingError, refetch } =
    useAniList<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 20 });

  const featured = featuredData?.Page.media ?? [];
  const trending = trendingData?.Page.media ?? [];

  const goTo = useCallback((idx: number) => {
    if (transitioning || featured.length === 0) return;
    setPrevSlide(slide);
    setTransitioning(true);
    setSlide(idx);
    setTimeout(() => { setPrevSlide(null); setTransitioning(false); }, 700);
  }, [transitioning, slide, featured.length]);

  const prev = useCallback(() => goTo((slide - 1 + featured.length) % featured.length), [goTo, slide, featured.length]);
  const next = useCallback(() => goTo((slide + 1) % featured.length), [goTo, slide, featured.length]);

  useEffect(() => {
    if (featured.length === 0) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, featured.length]);

  const current = featured[slide];
  const [titleMain, titleAccent] = current ? splitTitle(getTitle(current)) : ['', ''];

  if (trendingError) return <ErrorState message={trendingError} onRetry={refetch} />;

  return (
    // Two-column: main content | right trending panel
    <div className="flex gap-6 items-start">

      {/* ── Left: main content ─────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-10">

        {/* Hero Carousel */}
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 480 }}>

          {featuredLoading || featured.length === 0 ? (
            <div className="w-full h-full animate-pulse bg-[var(--bg-tertiary)] rounded-2xl" />
          ) : (
            <>
              {/* Slide layers */}
              {featured.map((media, i) => {
                const isCurrent = i === slide;
                const isPrev    = i === prevSlide;
                return (
                  <div key={media.id} className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: isCurrent ? 1 : isPrev ? 0 : 0, zIndex: isCurrent ? 2 : isPrev ? 1 : 0 }}>

                    {/* Banner image */}
                    <img
                      src={media.bannerImage ?? media.coverImage.extraLarge}
                      alt={getTitle(media)}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ transform: isCurrent ? 'scale(1.03)' : 'scale(1)', transition: 'transform 6s ease-out' }}
                    />

                    {/* Chainsaw-style: heavy diagonal gradient from left */}
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(110deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.80) 30%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.05) 100%)'
                    }} />
                    {/* Bottom fade */}
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 45%)'
                    }} />
                    {/* Blue accent tint on right edge */}
                    <div className="absolute inset-0" style={{
                      background: 'radial-gradient(ellipse at 80% 50%, rgba(37,99,235,0.12) 0%, transparent 60%)'
                    }} />
                  </div>
                );
              })}

              {/* Content */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 max-w-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--accent)', color: 'white' }}>
                    #{slide + 1} Most Popular
                  </span>
                  <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.50)' }}>
                    {current?.genres[0]} • {current?.format ?? 'TV'}
                  </span>
                </div>

                <h1 className="font-black text-white leading-none mb-3"
                  style={{ fontFamily: 'Sora', fontSize: 'clamp(1.9rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}>
                  {titleMain}<span style={{ color: 'var(--accent)' }}>{titleAccent}</span>
                </h1>

                {current?.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {current.description.replace(/<[^>]*>/g, '').slice(0, 180)}...
                  </p>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <StarRating score={current?.averageScore ?? null} />
                  <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                    {getRating(current!)}
                  </span>
                  {current?.episodes && (
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.50)' }}>
                      {current.episodes} EP
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => navigate(`/anime/${current?.id}`)}>
                    <Play className="w-4 h-4" /> Watch Now
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'white', background: 'rgba(255,255,255,0.07)' }}>
                    <Plus className="w-4 h-4" /> Add to List
                  </button>
                </div>
              </div>

              {/* Slide counter + dots */}
              <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-3">
                <span className="font-black leading-none hidden md:block"
                  style={{ fontFamily: 'Sora', fontSize: '3rem', color: 'rgba(255,255,255,0.08)' }}>
                  {String(slide + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1.5">
                  {featured.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className="rounded-full transition-all duration-400"
                      style={{
                        height: 5,
                        width: i === slide ? 22 : 5,
                        background: i === slide ? 'var(--accent)' : 'rgba(255,255,255,0.30)',
                      }} />
                  ))}
                </div>
              </div>

              {/* Arrows */}
              <button onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Popular Right Now */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Popular Right Now
            </h2>
            <button onClick={() => navigate('/seasonal')}
              className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline">
              See seasonal <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {trendingLoading ? <Spinner /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 stagger">
              {trending.slice(0, 8).map((media, i) => (
                <div key={media.id} className="relative">
                  <div className="ghost-number absolute -left-1 -top-2 leading-none z-0 pointer-events-none"
                    style={{ fontSize: '4.5rem', opacity: 0.11 }}>
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

        {/* Quick Links */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
          {[
            { label: 'My Watchlist', desc: 'Track your anime', path: '/lists',      color: '#2563EB' },
            { label: 'Seasonal',     desc: 'Winter 2026',      path: '/seasonal',   color: '#38BDF8' },
            { label: 'Community',    desc: 'Reviews & feeds',  path: '/community',  color: '#A78BFA' },
            { label: 'Challenges',   desc: 'Earn badges',      path: '/challenges', color: '#F59E0B' },
          ].map(({ label, desc, path, color }) => (
            <button key={path} onClick={() => navigate(path)}
              className="stats-card text-left hover:border-[var(--accent-border)] transition-all group">
              <div className="w-7 h-7 rounded-lg mb-2.5 flex items-center justify-center"
                style={{ background: `${color}18` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              </div>
              <p className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </button>
          ))}
        </section>
      </div>

      {/* ── Right: Trending Panel ───────────────────────────── */}
      <aside className="hidden xl:flex flex-col w-64 shrink-0 sticky top-20 space-y-4">

        {/* Trending list */}
        <div className="stats-card p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-[var(--border)]">
            <Flame className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Trending Now
            </span>
          </div>
          <div className="py-1">
            {trendingLoading ? (
              <div className="p-4"><Spinner /></div>
            ) : trending.slice(0, 10).map((media, i) => (
              <button key={media.id} onClick={() => navigate(`/anime/${media.id}`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-tertiary)] transition-all group text-left">
                <span className="font-black w-6 shrink-0 text-right leading-none"
                  style={{
                    fontFamily: 'Sora',
                    fontSize: 15,
                    color: i < 3 ? 'var(--accent)' : 'var(--text-muted)'
                  }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <img src={media.coverImage.large} alt={getTitle(media)}
                  className="w-9 h-12 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}>
                    {getTitle(media)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Eye className="w-2.5 h-2.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {(media.popularity ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[var(--border)]">
            <button onClick={() => navigate('/discover')}
              className="w-full flex items-center justify-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline">
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Currently Airing quick stat */}
        <div className="stats-card space-y-3">
          <p className="text-xs font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
            Season at a Glance
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Airing',    value: trending.filter(m => m.status === 'RELEASING').length },
              { label: 'Avg Score', value: Math.round(trending.reduce((s, m) => s + (m.averageScore ?? 0), 0) / (trending.filter(m => m.averageScore).length || 1)) + '%' },
            ].map(({ label, value }) => (
              <div key={label} className="p-2.5 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <p className="text-lg font-black" style={{ color: 'var(--accent)', fontFamily: 'Sora' }}>{value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

      </aside>
    </div>
  );
};
