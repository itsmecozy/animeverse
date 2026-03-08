import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { genreData } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const GenreOrbitSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const centerLabelRef = useRef<HTMLDivElement>(null);
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  const [selectedGenre, setSelectedGenre] = useState(genreData[0]);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const orbitCards = genreData.slice(0, 6);

  // Calculate orbit positions
  const getOrbitPosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    const radiusX = 34; // vw
    const radiusY = 26; // vh
    const x = Math.cos(angle) * radiusX;
    const y = Math.sin(angle) * radiusY;
    return { x, y, angle };
  };

  useEffect(() => {
    const section = sectionRef.current;
    const centerLabel = centerLabelRef.current;
    const orbitContainer = orbitContainerRef.current;

    if (!section || !centerLabel || !orbitContainer) return;

    const cards = orbitContainer.querySelectorAll('.orbit-card');

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
      }
    });

    // ENTRANCE (0% - 30%)
    scrollTl
      .fromTo(centerLabel,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      );

    cards.forEach((card, index) => {
      const pos = getOrbitPosition(index, cards.length);
      const startX = pos.x > 0 ? '60vw' : '-60vw';
      const startY = pos.y > 0 ? '40vh' : '-40vh';

      scrollTl.fromTo(card,
        { x: startX, y: startY, opacity: 0, scale: 0.9 },
        { x: 0, y: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05 + index * 0.05
      );
    });

    // EXIT (70% - 100%)
    scrollTl
      .to(centerLabel,
        { scale: 0.75, opacity: 0, ease: 'power2.in' },
        0.7
      );

    cards.forEach((card, index) => {
      const pos = getOrbitPosition(index, cards.length);
      const endX = `${pos.x * 0.35}vw`;
      const endY = `${pos.y * 0.35}vh`;

      scrollTl.to(card,
        { x: endX, y: endY, opacity: 0, ease: 'power2.in' },
        0.7 + index * 0.02
      );
    });

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
      className="section-pinned flex items-center justify-center z-40"
      style={{ background: '#07070A' }}
    >
      {/* Center Genre Label */}
      <div
        ref={centerLabelRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10"
      >
        <span className="accent-text text-[#A7ACB8] block mb-2">
          Explore Genre
        </span>
        <h2 
          className="text-[clamp(48px,8vw,96px)] font-extrabold font-['Sora'] tracking-tight cursor-pointer hover:text-[#7B61FF] transition-colors"
          style={{ color: selectedGenre.color }}
        >
          {selectedGenre.name.toUpperCase()}
        </h2>
        <p className="text-[#A7ACB8] mt-2">
          {selectedGenre.count} titles
        </p>
      </div>

      {/* Orbit Container */}
      <div
        ref={orbitContainerRef}
        className="absolute left-1/2 top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[68vw] h-[52vh]"
      >
        {orbitCards.map((genre, index) => {
          const pos = getOrbitPosition(index, orbitCards.length);
          return (
            <div
              key={genre.name}
              className="orbit-card absolute left-1/2 top-1/2 w-[18vw] h-[22vh] rounded-[18px] overflow-hidden border border-white/10 cursor-pointer hover:border-[#7B61FF]/50 transition-all hover:scale-105"
              style={{
                transform: `translate(calc(-50% + ${pos.x}vw), calc(-50% + ${pos.y}vh))`,
              }}
              onClick={() => setSelectedGenre(genre)}
            >
              <img
                src={genre.anime[0]?.coverImage || '/images/hero-bg.jpg'}
                alt={genre.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <span 
                  className="text-sm font-semibold"
                  style={{ color: genre.color }}
                >
                  {genre.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orbit path visualization */}
      <div 
        className="absolute left-1/2 top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[68vw] h-[52vh] border border-white/5 rounded-full pointer-events-none"
        style={{ borderStyle: 'dashed' }}
      />
    </section>
  );
};
