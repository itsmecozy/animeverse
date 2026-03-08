import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronRight } from 'lucide-react';
import { animeData } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const TrendingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const trendingAnime = animeData.slice(0, 10);
  const topAnime = trendingAnime[0];

  useEffect(() => {
    const section = sectionRef.current;
    const numeral = numeralRef.current;
    const list = listRef.current;
    const heroImage = heroImageRef.current;

    if (!section || !numeral || !list || !heroImage) return;

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
      .fromTo(numeral,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(list,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(heroImage,
        { x: '60vw', opacity: 0, scale: 0.98 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05
      );

    // EXIT (70% - 100%)
    scrollTl
      .to(numeral,
        { x: '-6vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(list,
        { x: '-20vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(heroImage,
        { x: '30vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

    if (scrollTl.scrollTrigger) {
      triggersRef.current.push(scrollTl.scrollTrigger);
    }

    return () => {
      triggersRef.current.forEach(st => st.kill());
      triggersRef.current = [];
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-50"
      style={{ background: '#07070A' }}
    >
      {/* Giant Numeral */}
      <div
        ref={numeralRef}
        className="absolute left-[6vw] top-[10vh] text-[42vw] font-extrabold font-['Sora'] leading-none pointer-events-none select-none"
        style={{ color: 'rgba(244, 246, 255, 0.04)' }}
      >
        1
      </div>

      {/* Header */}
      <div className="absolute left-[7vw] top-[10vh]">
        <span className="accent-text text-[#7B61FF] block mb-2">
          Trending Now
        </span>
        <h2 className="text-[clamp(24px,2.5vw,36px)] font-bold font-['Sora']">
          Top 10 This Week
        </h2>
      </div>

      {/* Rank List (Left) */}
      <div
        ref={listRef}
        className="absolute left-[7vw] top-[18vh] w-[28vw] h-[70vh] overflow-y-auto scrollbar-hide"
      >
        <div className="space-y-2">
          {trendingAnime.map((anime, index) => (
            <div
              key={anime.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#0E1016]/50 border border-white/5 hover:border-[#7B61FF]/30 transition-colors cursor-pointer group"
            >
              <span className="text-2xl font-bold font-['Sora'] text-[#7B61FF] w-8">
                {index + 1}
              </span>
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-12 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm truncate group-hover:text-[#7B61FF] transition-colors">
                  {anime.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-3 h-3 text-[#7B61FF] fill-[#7B61FF]" />
                  <span className="text-xs text-[#A7ACB8]">{anime.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-2 text-[#7B61FF] hover:underline text-sm">
          View full ranking
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Image (Right) */}
      <div
        ref={heroImageRef}
        className="absolute right-[6vw] top-1/2 -translate-y-1/2 w-[52vw] h-[62vh] rounded-[22px] overflow-hidden border border-white/10"
      >
        <img
          src={topAnime.coverImage}
          alt={topAnime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/30 to-transparent" />
        
        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="pill">#1 Trending</span>
            <span className="text-[#A7ACB8]">{topAnime.type}</span>
            <span className="text-[#A7ACB8]">•</span>
            <span className="text-[#A7ACB8]">{topAnime.episodes} EP</span>
          </div>
          <h3 className="text-[clamp(24px,3vw,42px)] font-bold font-['Sora']">
            {topAnime.title}
          </h3>
          <p className="text-[#A7ACB8] mt-2 line-clamp-2 max-w-[80%]">
            {topAnime.synopsis}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#7B61FF] fill-[#7B61FF]" />
              <span className="text-xl font-bold">{topAnime.rating}</span>
            </div>
            <button className="btn-primary">Add to List</button>
          </div>
        </div>
      </div>
    </section>
  );
};
