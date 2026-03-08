import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animeData } from '@/data/mockData';
import { AnimeCard } from '@/components/AnimeCard';

gsap.registerPlugin(ScrollTrigger);

export const SeasonalGridSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const primaryCardRef = useRef<HTMLDivElement>(null);
  const secondaryStackRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const seasonalAnime = animeData.slice(0, 6);
  const primaryAnime = seasonalAnime[0];
  const secondaryAnime = seasonalAnime.slice(1, 4);
  const moreAnime = seasonalAnime.slice(4, 9);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const primaryCard = primaryCardRef.current;
    const secondaryStack = secondaryStackRef.current;
    const bottomRow = bottomRowRef.current;

    if (!section || !header || !primaryCard || !secondaryStack || !bottomRow) return;

    const cards = secondaryStack.querySelectorAll('.secondary-card');

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
        { y: '-12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(primaryCard,
        { x: '-60vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )
      .fromTo(cards[0],
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.08
      )
      .fromTo(cards[1],
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.14
      )
      .fromTo(cards[2],
        { x: '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.2
      )
      .fromTo(bottomRow,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

    // EXIT (70% - 100%)
    scrollTl
      .to(header,
        { y: '-8vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(primaryCard,
        { x: '-30vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(cards,
        { x: '30vw', opacity: 0, ease: 'power2.in', stagger: 0.02 },
        0.7
      )
      .to(bottomRow,
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.72
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
      className="section-pinned z-30"
      style={{ background: '#07070A' }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="absolute left-[7vw] top-[10vh]"
      >
        <span className="accent-text text-[#7B61FF] block mb-2">
          This Season
        </span>
        <h2 className="text-[clamp(28px,3vw,42px)] font-bold font-['Sora']">
          Winter 2026
        </h2>
      </div>

      {/* Primary Card (Large, Left) */}
      <div
        ref={primaryCardRef}
        className="absolute left-[7vw] top-[24vh] w-[40vw] h-[54vh]"
      >
        <AnimeCard anime={primaryAnime} />
      </div>

      {/* Secondary Stack (Right) */}
      <div
        ref={secondaryStackRef}
        className="absolute left-[52vw] top-[24vh] w-[41vw] h-[54vh] flex flex-col gap-[2.2vh]"
      >
        {secondaryAnime.map((anime) => (
          <div
            key={anime.id}
            className="secondary-card flex items-center gap-4 p-3 rounded-[18px] bg-[#0E1016] border border-white/10 hover:border-[#7B61FF]/50 transition-colors cursor-pointer"
          >
            <img
              src={anime.coverImage}
              alt={anime.title}
              className="w-24 h-16 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{anime.title}</h4>
              <p className="text-sm text-[#A7ACB8]">{anime.type} • {anime.episodes || '?'} EP</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div
        ref={bottomRowRef}
        className="absolute left-[7vw] bottom-[6vh] w-[86vw]"
      >
        <span className="accent-text text-[#A7ACB8] block mb-3">
          More New Releases
        </span>
        <div className="flex gap-4">
          {moreAnime.map((anime) => (
            <div
              key={anime.id}
              className="w-[15vw] aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-[#7B61FF]/50 transition-colors cursor-pointer group"
            >
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
