import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Eye, Play, Plus, Star, Flame } from 'lucide-react';
import { useAniList }     from '@/hooks/useAniList';
import { useImageColor }  from '@/hooks/useImageColor';
import { Spinner, ErrorState } from '@/components/Spinner';
import { AnimeCard }      from '@/components/AnimeCard';
import { TRENDING_QUERY, FEATURED_QUERY, getTitle, getRating } from '@/lib/anilist';
import type { AniListMedia } from '@/lib/anilist';

interface TrendingData { Page: { media: AniListMedia[] } }
interface FeaturedData { Page: { media: AniListMedia[] } }

function splitTitle(t: string): [string, string] {
  const w = t.trim().split(' ');
  return w.length === 1 ? ['', t] : [w.slice(0, -1).join(' ') + ' ', w[w.length - 1]];
}

function StarRating({ score, color }: { score: number | null; color: string }) {
  if (!score) return null;
  const filled = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} style={{ width: 14, height: 14, color, fill: s <= filled ? color : 'transparent' }} />
      ))}
    </div>
  );
}

// Apply theme color globally to CSS variables
function applyThemeColor(color: string) {
  const el = document.documentElement;

  // Parse rgb string
  const match = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');

  // Darken for hover (multiply by 0.8)
  const hoverHex = '#' + [r,g,b].map(v => Math.round(v * 0.8).toString(16).padStart(2,'0')).join('');

  el.style.setProperty('--accent',        hex);
  el.style.setProperty('--accent-hover',  hoverHex);
  el.style.setProperty('--accent-subtle', `rgba(${r},${g},${b},0.10)`);
  el.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.28)`);
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [slide, setSlide]         = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [transitioning, setTrans] = useState(false);

  const { data: featuredData, loading: featuredLoading } = useAniList<FeaturedData>(FEATURED_QUERY);
  const { data: trendingData, loading: trendingLoading, error, refetch } =
    useAniList<TrendingData>(TRENDING_QUERY, { page: 1, perPage: 20 });

  const featured = featuredData?.Page.media ?? [];
  const trending = trendingData?.Page.media ?? [];
  const current  = featured[slide];

  const dominantColor = useImageColor(current?.bannerImage ?? current?.coverImage.extraLarge);

  // Apply theme globally whenever color changes
  useEffect(() => { applyThemeColor(dominantColor); }, [dominantColor]);

  // Reset to default accent on unmount
  useEffect(() => {
    return () => {
      const el = document.documentElement;
      el.style.removeProperty('--accent');
      el.style.removeProperty('--accent-hover');
      el.style.removeProperty('--accent-subtle');
      el.style.removeProperty('--accent-border');
    };
  }, []);

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
    if (!featured.length) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next, featured.length]);

  const [titleMain, titleAccent] = current ? splitTitle(getTitle(current)) : ['', ''];

  if (error) return (
    <div className="p-8"><ErrorState message={error} onRetry={refetch} /></div>
  );

  return (
    /* Full-width two-column layout — hero flush top, sidebar/panel flush sides */
    <div className="flex items-start">

      {/* ── Main column ──────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* ── HERO — no padding, no rounded corners, flush ── */}
        <div className="relative w-full overflow-hidden"
          style={{ height: 'clamp(320px, 46vw, 560px)' }}>

          {featuredLoading || !featured.length ? (
            <div className="w-full h-full animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
          ) : (
            <>
              {/* Slide layers */}
              {featured.map((media, i) => {
                const active  = i === slide;
                const wasPrev = i === prevSlide;
                return (
                  <div key={media.id} className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: active || wasPrev ? 1 : 0, zIndex: active ? 2 : wasPrev ? 1 : 0 }}>

                    <img
                      src={media.bannerImage ?? media.coverImage.extraLarge}
                      alt={getTitle(media)}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        transform: active ? 'scale(1.04)' : 'scale(1)',
                        transition: 'transform 7s ease-out, opacity 0.7s',
                        opacity: active ? 1 : 0,
                      }}
                    />

                    {/* Left gradient — deep black for content legibility */}
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(105deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.80) 28%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.05) 100%)',
                    }} />

                    {/* Bottom fade — bleeds image into page */}
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,0.70) 18%, transparent 45%)',
                    }} />

                    {/* Subtle right color tint from dominant color */}
                    <div className="absolute inset-0 transition-all duration-1000" style={{
                      background: `radial-gradient(ellipse at 80% 40%, ${dominantColor}30 0%, transparent 55%)`,
                    }} />
                  </div>
                );
              })}

              {/* ── Hero content ── */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 sm:px-10 lg:px-12 pb-10 sm:pb-14"
                style={{ maxWidth: '55%', minWidth: 260 }}>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors duration-700"
                    style={{ background: dominantColor, color: 'white' }}>
                    #{slide + 1} Most Popular
                  </span>
                  <span className="text-[10px] hidden sm:block" style={{ color: 'rgba(255,255,255,0.50)' }}>
                    {current?.genres[0]} • {current?.format ?? 'TV'}
                  </span>
                </div>

                <h1 className="font-black text-white leading-none mb-3"
                  style={{ fontFamily: 'Sora', fontSize: 'clamp(1.6rem, 3.8vw, 3.2rem)', letterSpacing: '-0.03em' }}>
                  {titleMain}
                  <span style={{ color: dominantColor, transition: 'color 1s ease' }}>{titleAccent}</span>
                </h1>

                {current?.description && (
                  <p className="hidden sm:block text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2"
                    style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '40ch' }}>
                    {current.description.replace(/<[^>]*>/g, '').slice(0, 200)}...
                  </p>
                )}

                <div className="flex items-center gap-3 mb-5" style={{ transition: 'color 1s' }}>
                  <StarRating score={current?.averageScore ?? null} color={dominantColor} />
                  <span className="text-sm font-bold" style={{ color: dominantColor }}>{getRating(current!)}</span>
                  {current?.episodes && (
                    <span className="hidden sm:inline text-[11px] px-2 py-0.5 rounded"
                      style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.45)' }}>
                      {current.episodes} EP
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/anime/${current?.id}`)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: dominantColor, color: 'white', transition: 'background 1s, transform 0.15s' }}>
                    <Play style={{ width: 15, height: 15 }} /> Watch Now
                  </button>
                  <button
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ border: '1px solid rgba(255,255,255,0.20)', color: 'white', background: 'rgba(255,255,255,0.07)' }}>
                    <Plus style={{ width: 15, height: 15 }} /> Add to List
                  </button>
                </div>
              </div>

              {/* Dots + counter — bottom right */}
              <div className="absolute bottom-5 right-5 z-10 flex flex-col items-end gap-2">
                <span className="font-black hidden lg:block"
                  style={{ fontFamily: 'Sora', fontSize: '2.8rem', color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>
                  {String(slide + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-1">
                  {featured.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      style={{
                        height: 4,
                        width: i === slide ? 22 : 4,
                        borderRadius: 9999,
                        background: i === slide ? dominantColor : 'rgba(255,255,255,0.30)',
                        transition: 'width 0.35s, background 1s',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }} />
                  ))}
                </div>
              </div>

              {/* Arrows */}
              {['prev','next'].map((dir) => (
                <button key={dir} onClick={dir === 'prev' ? prev : next}
                  className="absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    [dir === 'prev' ? 'left' : 'right']: 12,
                    background: 'rgba(0,0,0,0.40)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}>
                  {dir === 'prev'
                    ? <ChevronLeft  className="w-4 h-4 text-white" />
                    : <ChevronRight className="w-4 h-4 text-white" />}
                </button>
              ))}
            </>
          )}
        </div>

        {/* ── Below-hero content — padded ── */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Popular Right Now */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold font-['Sora']"
                style={{ color: 'var(--text-primary)' }}>Popular Right Now</h2>
              <button onClick={() => navigate('/seasonal')}
                className="flex items-center gap-1 text-xs font-medium hover:underline"
                style={{ color: 'var(--accent)' }}>
                See seasonal <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            {trendingLoading ? <Spinner /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 stagger">
                {trending.slice(0, 8).map((media, i) => (
                  <div key={media.id} className="relative">
                    <div className="ghost-number absolute -left-1 -top-2 leading-none z-0 pointer-events-none"
                      style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', opacity: 0.10 }}>
                      {i + 1}
                    </div>
                    <div className="relative z-10"><AnimeCard media={media} /></div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Links */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-2">
            {[
              { label: 'My Watchlist', desc: 'Track your anime', path: '/lists',      color: 'var(--accent)' },
              { label: 'Seasonal',     desc: 'Winter 2026',      path: '/seasonal',   color: '#38BDF8' },
              { label: 'Community',    desc: 'Reviews & feeds',  path: '/community',  color: '#A78BFA' },
              { label: 'Challenges',   desc: 'Earn badges',      path: '/challenges', color: '#F59E0B' },
            ].map(({ label, desc, path, color }) => (
              <button key={path} onClick={() => navigate(path)}
                className="stats-card text-left transition-all group p-4"
                style={{ borderColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                <div className="w-7 h-7 rounded-lg mb-2 flex items-center justify-center"
                  style={{ background: `${color}22` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                </div>
                <p className="font-semibold text-xs sm:text-sm transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}>
                  {label}
                </p>
                <p className="text-xs mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>{desc}</p>
              </button>
            ))}
          </section>
        </div>
      </div>

      {/* ── Right Trending Panel — flush with hero top ───────── */}
      <aside className="hidden lg:flex flex-col shrink-0 h-full border-l border-[var(--border)]"
        style={{
          width: 'clamp(210px, 17vw, 264px)',
          background: 'var(--bg-secondary)',
          position: 'sticky',
          top: 56, // topbar height
          maxHeight: 'calc(100vh - 56px)',
          overflowY: 'auto',
        }}>

        {/* Trending header */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[var(--border)] sticky top-0 z-10"
          style={{ background: 'var(--bg-secondary)' }}>
          <Flame className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-bold font-['Sora']" style={{ color: 'var(--text-primary)' }}>
            Trending Now
          </span>
        </div>

        {/* Trending list */}
        <div className="py-1 flex-1">
          {trendingLoading ? <div className="p-4"><Spinner /></div>
          : trending.slice(0, 12).map((media, i) => (
            <button key={media.id} onClick={() => navigate(`/anime/${media.id}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 transition-all group text-left"
              style={{ borderBottom: '1px solid transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span className="font-black shrink-0 text-right"
                style={{
                  fontFamily: 'Sora', fontSize: 13, width: 22,
                  color: i < 3 ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'color 1s',
                }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <img src={media.coverImage.large} alt={getTitle(media)}
                className="w-9 h-12 object-cover rounded-md shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate transition-colors"
                  style={{ color: 'var(--text-primary)', fontSize: 11.5 }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}>
                  {getTitle(media)}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Eye style={{ width: 10, height: 10, color: 'var(--text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {(media.popularity ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Season stats */}
        <div className="px-4 py-4 border-t border-[var(--border)]">
          <p className="text-xs font-bold font-['Sora'] mb-3" style={{ color: 'var(--text-primary)' }}>
            Season at a Glance
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Airing',    value: trending.filter(m => m.status === 'RELEASING').length },
              { label: 'Avg Score', value: Math.round(trending.reduce((s, m) => s + (m.averageScore ?? 0), 0) / (trending.filter(m => m.averageScore).length || 1)) + '%' },
            ].map(({ label, value }) => (
              <div key={label} className="p-2.5 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <p className="text-base font-black" style={{ color: 'var(--accent)', fontFamily: 'Sora', transition: 'color 1s' }}>{value}</p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/discover')}
            className="w-full flex items-center justify-center gap-1 text-xs font-medium hover:underline"
            style={{ color: 'var(--accent)' }}>
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </aside>
    </div>
  );
};
