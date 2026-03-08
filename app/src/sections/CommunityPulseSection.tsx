import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, MessageCircle, Quote } from 'lucide-react';
import { reviewsData } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const CommunityPulseSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const reviews = reviewsData.slice(0, 4);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const collage = collageRef.current;

    if (!section || !header || !collage) return;

    const cards = collage.querySelectorAll('.community-card');

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
      .fromTo(header,
        { y: '-10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

    cards.forEach((card, index) => {
      scrollTl.fromTo(card,
        { y: '60vh', opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05 + index * 0.06
      );
    });

    // EXIT (70% - 100%)
    scrollTl
      .to(header,
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    cards.forEach((card, index) => {
      scrollTl.to(card,
        { y: '-20vh', opacity: 0, ease: 'power2.in' },
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
      className="section-pinned z-[60]"
      style={{ background: '#07070A' }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="absolute left-[7vw] top-[10vh]"
      >
        <span className="accent-text text-[#7B61FF] block mb-2">
          Community Pulse
        </span>
        <h2 className="text-[clamp(24px,2.5vw,36px)] font-bold font-['Sora']">
          What Fans Are Saying
        </h2>
      </div>

      {/* Card Collage */}
      <div
        ref={collageRef}
        className="absolute left-[30vw] top-[22vh] w-[63vw] h-[62vh]"
      >
        {/* Card A - Top Left */}
        <div className="community-card absolute left-0 top-0 w-[28vw] h-[28vh] rounded-[22px] bg-[#0E1016] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <Quote className="w-8 h-8 text-[#7B61FF] mb-4" />
            <p className="text-white text-lg leading-relaxed line-clamp-3">
              "{reviews[0]?.content}"
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#4ECDC4] flex items-center justify-center text-sm font-bold">
                {reviews[0]?.user.displayName[0]}
              </div>
              <div>
                <p className="font-semibold text-white">{reviews[0]?.user.displayName}</p>
                <p className="text-sm text-[#A7ACB8]">{reviews[0]?.anime.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#A7ACB8]">
              <button className="flex items-center gap-1 hover:text-[#7B61FF] transition-colors">
                <Heart className="w-4 h-4" />
                {reviews[0]?.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-[#7B61FF] transition-colors">
                <MessageCircle className="w-4 h-4" />
                {reviews[0]?.replies.length}
              </button>
            </div>
          </div>
        </div>

        {/* Card B - Top Right */}
        <div className="community-card absolute left-[32vw] top-0 w-[30vw] h-[28vh] rounded-[22px] overflow-hidden border border-white/10">
          <img
            src={reviews[1]?.anime.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white font-semibold mb-1">{reviews[1]?.anime.title}</p>
            <p className="text-sm text-[#A7ACB8] line-clamp-2">"{reviews[1]?.content}"</p>
            <p className="text-xs text-[#7B61FF] mt-2">— {reviews[1]?.user.displayName}</p>
          </div>
        </div>

        {/* Card C - Bottom Left */}
        <div className="community-card absolute left-0 top-[32vh] w-[30vw] h-[30vh] rounded-[22px] overflow-hidden border border-white/10">
          <img
            src={reviews[2]?.anime.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white font-semibold mb-1">{reviews[2]?.anime.title}</p>
            <p className="text-sm text-[#A7ACB8] line-clamp-2">"{reviews[2]?.content}"</p>
            <p className="text-xs text-[#7B61FF] mt-2">— {reviews[2]?.user.displayName}</p>
          </div>
        </div>

        {/* Card D - Bottom Right */}
        <div className="community-card absolute left-[34vw] top-[32vh] w-[28vw] h-[30vh] rounded-[22px] bg-[#0E1016] border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <Quote className="w-8 h-8 text-[#7B61FF] mb-4" />
            <p className="text-white text-lg leading-relaxed line-clamp-4">
              "{reviews[3]?.content}"
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#4ECDC4] flex items-center justify-center text-sm font-bold">
                {reviews[3]?.user.displayName[0]}
              </div>
              <div>
                <p className="font-semibold text-white">{reviews[3]?.user.displayName}</p>
                <p className="text-sm text-[#A7ACB8]">{reviews[3]?.anime.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#A7ACB8]">
              <button className="flex items-center gap-1 hover:text-[#7B61FF] transition-colors">
                <Heart className="w-4 h-4" />
                {reviews[3]?.likes}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
