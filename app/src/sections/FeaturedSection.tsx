import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Play, Star } from 'lucide-react';
import { animeData } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const featuredAnime = animeData[16]; // Cyberpunk Edgerunners

  useEffect(() => {
    const section = sectionRef.current;
    const titleBlock = titleBlockRef.current;
    const card = cardRef.current;
    const meta = metaRef.current;
    const cta = ctaRef.current;

    if (!section || !titleBlock || !card || !meta || !cta) return;

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
      .fromTo(card,
        { x: '60vw', scale: 0.92, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, ease: 'none' },
        0
      )
      .fromTo(titleBlock,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      )
      .fromTo(meta,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.1
      )
      .fromTo(cta,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.12
      );

    // SETTLE (30% - 70%) - Hold positions

    // EXIT (70% - 100%)
    scrollTl
      .to(card,
        { x: '40vw', scale: 0.92, opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(titleBlock,
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .to(meta,
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .to(cta,
        { y: '6vh', opacity: 0, ease: 'power2.in' },
        0.74
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
      className="section-pinned flex items-center z-20"
      style={{ background: '#07070A' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={featuredAnime.coverImage}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070A] via-[#07070A]/80 to-transparent" />
      </div>

      {/* Left Title Block */}
      <div
        ref={titleBlockRef}
        className="absolute left-[7vw] top-[18vh] w-[34vw]"
      >
        <span className="accent-text text-[#7B61FF] mb-4 block">
          Featured Spotlight
        </span>
        <h2 className="text-[clamp(36px,4vw,56px)] font-bold font-['Sora'] leading-tight">
          {featuredAnime.title}
        </h2>
      </div>

      {/* Meta Row */}
      <div
        ref={metaRef}
        className="absolute left-[7vw] top-[54vh] flex items-center gap-4"
      >
        <span className="pill">{featuredAnime.year}</span>
        <span className="text-[#A7ACB8]">•</span>
        <span className="text-white">{featuredAnime.genres[0]}</span>
        <span className="text-[#A7ACB8]">•</span>
        <span className="text-white">{featuredAnime.episodes} EP</span>
        <div className="flex items-center gap-1 ml-2">
          <Star className="w-4 h-4 text-[#7B61FF] fill-[#7B61FF]" />
          <span className="font-semibold">{featuredAnime.rating}</span>
        </div>
      </div>

      {/* CTA Row */}
      <div
        ref={ctaRef}
        className="absolute left-[7vw] top-[70vh] flex items-center gap-4"
      >
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add to List
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Play className="w-4 h-4" />
          Watch Trailer
        </button>
      </div>

      {/* Featured Card (Right) */}
      <div
        ref={cardRef}
        className="absolute right-[6vw] top-1/2 -translate-y-1/2 w-[34vw] h-[62vh] rounded-[22px] overflow-hidden border border-white/10"
      >
        <img
          src={featuredAnime.coverImage}
          alt={featuredAnime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent" />
        
        {/* Card content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-sm text-[#A7ACB8] line-clamp-3">
            {featuredAnime.synopsis}
          </p>
        </div>
      </div>
    </section>
  );
};
