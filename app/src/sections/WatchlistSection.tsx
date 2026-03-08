import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Star, MoreHorizontal } from 'lucide-react';
import { watchlistData, currentUser } from '@/data/mockData';
import type { WatchStatus } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export const WatchlistSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const [activeTab, setActiveTab] = useState<WatchStatus>('watching');

  const tabs: { id: WatchStatus; label: string; count: number }[] = [
    { id: 'watching', label: 'Watching', count: currentUser.stats.watching },
    { id: 'completed', label: 'Completed', count: currentUser.stats.completed },
    { id: 'on_hold', label: 'On Hold', count: currentUser.stats.onHold },
    { id: 'dropped', label: 'Dropped', count: currentUser.stats.dropped },
    { id: 'plan_to_watch', label: 'Plan to Watch', count: currentUser.stats.planToWatch },
  ];

  const filteredList = watchlistData.filter(entry => entry.status === activeTab);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const sidebar = sidebarRef.current;
    const list = listRef.current;
    const stats = statsRef.current;

    if (!section || !header || !sidebar || !list || !stats) return;

    const listRows = list.querySelectorAll('.watchlist-item');

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      }
    });

    // ENTRANCE (0% - 30%)
    scrollTl
      .fromTo(header,
        { y: '-10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(sidebar,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

    listRows.forEach((row, index) => {
      scrollTl.fromTo(row,
        { y: '50vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05 + index * 0.03
      );
    });

    scrollTl.fromTo(stats,
      { x: '40vw', opacity: 0 },
      { x: 0, opacity: 1, ease: 'none' },
      0.1
    );

    // EXIT (70% - 100%)
    scrollTl
      .to(header,
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(sidebar,
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

    listRows.forEach((row, index) => {
      scrollTl.to(row,
        { y: '18vh', opacity: 0, ease: 'power2.in' },
        0.7 + index * 0.01
      );
    });

    scrollTl.to(stats,
      { x: '18vw', opacity: 0, ease: 'power2.in' },
      0.72
    );

    if (scrollTl.scrollTrigger) {
      triggersRef.current.push(scrollTl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(st => st.kill());
      triggersRef.current = [];
    };
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-[70]"
      style={{ background: '#07070A' }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="absolute left-[7vw] top-[10vh]"
      >
        <span className="accent-text text-[#7B61FF] block mb-2">
          Your Library
        </span>
        <h2 className="text-[clamp(24px,2.5vw,36px)] font-bold font-['Sora']">
          Your Watchlist
        </h2>
      </div>

      {/* Sidebar (Tabs) */}
      <div
        ref={sidebarRef}
        className="absolute left-[7vw] top-[22vh] w-[18vw]"
      >
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-[#7B61FF]/20 border border-[#7B61FF]/50'
                  : 'bg-[#0E1016] border border-white/5 hover:border-white/20'
              }`}
            >
              <span className={`font-medium ${activeTab === tab.id ? 'text-[#7B61FF]' : 'text-white'}`}>
                {tab.label}
              </span>
              <span className={`text-sm ${activeTab === tab.id ? 'text-[#7B61FF]' : 'text-[#A7ACB8]'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main List Area */}
      <div
        ref={listRef}
        className="absolute left-[28vw] top-[22vh] w-[44vw] h-[60vh] overflow-y-auto scrollbar-hide"
      >
        <div className="space-y-3">
          {filteredList.map((entry) => (
            <div
              key={entry.id}
              className="watchlist-item flex items-center gap-4 p-4 rounded-xl bg-[#0E1016] border border-white/5 hover:border-[#7B61FF]/30 transition-colors"
            >
              <img
                src={entry.anime.coverImage}
                alt={entry.anime.title}
                className="w-14 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">{entry.anime.title}</h4>
                <p className="text-sm text-[#A7ACB8]">
                  {entry.anime.type} • Progress: {entry.progress}/{entry.anime.episodes || '?'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7B61FF] rounded-full"
                      style={{
                        width: `${Math.min((entry.progress / (entry.anime.episodes || 1)) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {entry.score && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#7B61FF]/20">
                    <Star className="w-4 h-4 text-[#7B61FF] fill-[#7B61FF]" />
                    <span className="text-sm font-semibold text-[#7B61FF]">{entry.score}</span>
                  </div>
                )}
                <button className="p-2 rounded-lg bg-white/5 hover:bg-[#7B61FF]/20 transition-colors">
                  <Play className="w-4 h-4 text-[#7B61FF]" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[#A7ACB8]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Panel */}
      <div
        ref={statsRef}
        className="absolute left-[76vw] top-[22vh] w-[17vw]"
      >
        <div className="stats-card mb-4">
          <p className="text-[#A7ACB8] text-sm mb-1">Total Anime</p>
          <p className="stats-number">{currentUser.stats.totalAnime}</p>
        </div>
        <div className="stats-card mb-4">
          <p className="text-[#A7ACB8] text-sm mb-1">Episodes Watched</p>
          <p className="stats-number">{currentUser.stats.totalEpisodes.toLocaleString()}</p>
        </div>
        <div className="stats-card mb-4">
          <p className="text-[#A7ACB8] text-sm mb-1">Mean Score</p>
          <p className="stats-number">{currentUser.stats.meanScore}</p>
        </div>
        <div className="stats-card">
          <p className="text-[#A7ACB8] text-sm mb-2">Top Genre</p>
          <div className="flex flex-wrap gap-2">
            {currentUser.stats.topGenres.slice(0, 3).map((genre) => (
              <span key={genre.genre} className="pill text-xs">
                {genre.genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
