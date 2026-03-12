import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, Eye, Play, Plus, Star, Flame } from 'lucide-react';
import { useAniList } from '@/hooks/useAniList';
import { useImageColor } from '@/hooks/useImageColor';
import { Spinner, ErrorState } from '@/components/Spinner';
import { AnimeCard } from '@/components/AnimeCard';
import { TRENDING_QUERY, FEATURED_QUERY, getTitle, getRating } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';

interface TrendingData { Page: { media: AniListMedia[] } }
interface FeaturedData { Page: { media: AniListMedia[] } }

function splitTitle(t: string): [string, string] {
  const w = t.trim().split(' ');
  return w.length === 1 ? ['', t] : [w.slice(0, -1).join(' ') + ' ', w[w.length - 1]];
}

function StarRating({ score }: { score: number | null }) {
  if (!score) return null;
  const filled = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} style={{ width: 14, height: 14 }}
          className={s <= filled ? 'fill-current' : 'opacity-25'} />
      ))}
    </div>
  );
}

export const HomePage = () => {
  const navigate  = useNavigate();
  const [slide, setSlide]           = useState(0);
  const [prevSlide, setPrevSlide]   = useState<number | null>(null);
  const [transitioning, setTrans]   = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  const { data: featuredData, loading: featuredLoading } = useAniList<FeaturedData>(FEATURED_QUERY);
  const { data: trendingData, loading: trendingLoading, error, refetch } =
    useAniList<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 20 });

  const featured = featuredData?.Page.media ?? [];
  const trending = trendingData?.Page.media ?? [];
  const current  = featured[slide];

  // Extract dominant color from current banner image
  const dominantColor = useImageColor(current?.bannerImage ?? current?.coverImage.extraLarge);

  // Apply dynamic glow color
  useEffect(() => {
    if (glowRef.current) {
      glowRef.current.style.setProperty('--glow', dominantColor);
    }
  }, [dominantColor]);

  const goTo = useCallback((idx: number) => {
    if (transitioning || featured.length === 0) return;
    setPrevSlide(slide);
    setTrans(true);
    setSlide(idx);
    setTimeout(() => { setPrevSlide(null); setTrans(false); }, 700);
  }, [transitioning, slide, featured.length]);

  const prev = useCallback(() => goTo((slide - 1 + featured.length) % featured.length), [goTo, slide, featured.length]);
  const next = useCallback(() => goTo((slide + 1) % featured.length), [goTo, slide, featured.length]);

  useEffect(() => {
    if (featured.length === 0) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, featured.length]);

  const [titleMain, titleAccent] = current ? splitTitle(getTitle(current)) : ['', ''];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex gap-5 xl:gap-6 items-start">

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-8">

        {/* Hero Carousel with bleed glow */}
        <div ref={glowRef} className="relative" style={{ '--glow': dominantColor } as React.CSSProperties}>

          {/* Bleed glow — extends behind and below hero card */}
          <div className="absolute pointer-events-none"
            style={{
              inset: '-40px -60px -80px -60px',
              background: `radial-gradient(ellipse at 30% 60%, var(--glow, #2563EB) 0%, transparent 65%)`,
              opacity: 0.28,
              filter: 'blur(40px)',
              transition: 'background 1.2s ease',
              zIndex: 0,
            }} />

          {/* Hero card */}
          <div className="relative z-10 rounded-2xl overflow-hidden w-full"
            style={{ height: 'clamp(300px, 45vw, 520px)' }}>

            {featuredLoading || featured.length === 0 ? (
              <div className="w-full h-full animate-pulse bg-[var(--bg-tertiary)] rounded-2xl" />
            ) : (
              <>
                {/* Slides */}
                {featured.map((media, i) => {
                  const active  = i === slide;
                  const wasPrev = i === prevSlide;
                  return (
                    <div key={media.id} className="absolute inset-0 transition-opacity duration-700"
                      style={{ opacity: active ? 1 : wasPrev ? 0 : 0, zIndex: active ? 2 : wasPrev ? 1 : 0 }}>
                      <img
                        src={media.bannerImage ?? media.coverImage.extraLarge}
                        alt={getTitle(media)}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ transform: active ? 'scale(1.04)' : 'scale(1)', transition: 'transform 7s ease-out' }}
                      />
                      {/* Chainsaw diagonal gradient */}
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(110deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.20) 60%, transparent 100%)'
                      }} />
                      <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 50%)'
                      }} />
                      {/* Dynamic color tint on right side — bleeds from the image */}
                      <div className="absolute inset-0 transition-all duration-1000" style={{
                        background: `radial-gradient(ellipse at 75% 50%, ${dominantColor}22 0%, transparent 60%)`
                      }} />
                    </div>
                  );
                })}

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-7 lg:p-8"
                  style={{ maxWidth: '62%', minWidth: 260 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors duration-1000"
                      style={{ background: dominantColor, color: 'white' }}>
                      #{slide + 1} Most Popular
                    </span>
                    <span className="text-[10px] hidden sm:block" style={{ color: 'rgba(255,255,255,0.50)' }}>
                      {current?.genres[0]} • {current?.format ?? 'TV'}
                    </span>
                  </div>

                  <h1 className="font-black text-white leading-none mb-2"
                    style={{ fontFamily: 'Sora', fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', letterSpacing: '-0.03em' }}>
                    {titleMain}
                    <span style={{ color: dominantColor, transition: 'color 1.2s ease' }}>{titleAccent}</span>
                  </h1>

                  {current?.description && (
                    <p className="text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 hidden sm:block"
                      style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '42ch' }}>
                      {current.description.replace(/<[^>]*>/g, '').slice(0, 180)}...
                    </p>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3 mb-4"
                    style={{ color: dominantColor, transition: 'color 1.2s ease' }}>
                    <StarRating score={current?.averageScore ?? null} />
                    <span className="text-xs sm:text-sm font-bold">{getRating(current!)}</span>
                    {current?.episodes && (
                      <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded hidden sm:inline"
                        style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.50)' }}>
                        {current.episodes} EP
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                      style={{ background: dominantColor, color: 'white' }}
                      onClick={() => navigate(`/anime/${current?.id}`)}>
                      <Play style={{ width: 14, height: 14 }} /> Watch Now
                    </button>
                    <button
                      className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                      style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'white', background: 'rgba(255,255,255,0.07)' }}>
                      <Plus style={{ width: 14, height: 14 }} /> Add to List
                    </button>
                  </div>
                </div>

                {/* Dots + counter */}
                <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5 z-10 flex flex-col items-end gap-2">
                  <span className="font-black leading-none hidden lg:block"
                    style={{ fontFamily: 'Sora', fontSize: '2.5rem', color: 'rgba(255,255,255,0.07)' }}>
                    {String(slide + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1">
                    {featured.map((_, i) => (
                      <button key={i} onClick={() => goTo(i)}
                        className="rounded-full transition-all duration-300"
                        style={{
                          height: 4,
                          width: i === slide ? 20 : 4,
                          background: i === slide ? dominantColor : 'rgba(255,255,255,0.30)',
                          transition: 'width 0.3s, background 1.2s',
                        }} />
                    ))}
                  </div>
                </div>

                {/* Arrows */}
                <button onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Popular Right Now */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Popular Right Now
            </h2>
            <button onClick={() => navigate('/seasonal')}
              className="flex items-center gap-1 text-xs font-medium text-[var(--accent)] hover:underline">
              See seasonal <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {trendingLoading ? <Spinner /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 stagger">
              {trending.slice(0, 8).map((media, i) => (
                <div key={media.id} className="relative">
                  <div className="ghost-number absolute -left-1 -top-2 leading-none z-0 pointer-events-none"
                    style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', opacity: 0.11 }}>
                    {i + 1}
                  </div>
                  <div className="relative z-10"><AnimeCard media={media} /></div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
          {[
            { label: 'My Watchlist', desc: 'Track your anime', path: '/lists',      color: '#2563EB' },
            { label: 'Seasonal',     desc: 'Winter 2026',      path: '/seasonal',   color: '#38BDF8' },
            { label: 'Community',    desc: 'Reviews & feeds',  path: '/community',  color: '#A78BFA' },
            { label: 'Challenges',   desc: 'Earn badges',      path: '/challenges', color: '#F59E0B' },
          ].map(({ label, desc, path, color }) => (
            <button key={path} onClick={() => navigate(path)}
              className="stats-card text-left hover:border-[var(--accent-border)] transition-all group p-4">
              <div className="w-7 h-7 rounded-lg mb-2 flex items-center justify-center"
                style={{ background: `${color}18` }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              </div>
              <p className="font-semibold text-xs sm:text-sm group-hover:text-[var(--accent)] transition-colors"
                style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </button>
          ))}
        </section>
      </div>

      {/* ── Right Trending Panel ─────────────────────────────── */}
      <aside className="hidden lg:flex flex-col shrink-0 sticky top-20 space-y-4"
        style={{ width: 'clamp(200px, 18vw, 260px)' }}>

        <div className="stats-card p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-[var(--border)]">
            <Flame className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
              Trending Now
            </span>
          </div>
          <div className="py-1">
            {trendingLoading ? <div className="p-4"><Spinner /></div>
            : trending.slice(0, 10).map((media, i) => (
              <button key={media.id} onClick={() => navigate(`/anime/${media.id}`)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--bg-tertiary)] transition-all group text-left">
                <span className="font-black shrink-0 text-right leading-none"
                  style={{ fontFamily: 'Sora', fontSize: 13, width: 20,
                    color: i < 3 ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <img src={media.coverImage.large} alt={getTitle(media)}
                  className="w-8 h-11 object-cover rounded-md shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--text-primary)', fontSize: 11 }}>
                    {getTitle(media)}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Eye style={{ width: 10, height: 10, color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
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

        {/* Season at a Glance */}
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
                <p className="text-base font-black" style={{ color: 'var(--accent)', fontFamily: 'Sora' }}>{value}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
