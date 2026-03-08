import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const microcopyRef = useRef<HTMLParagraphElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const orb = orbRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;
    const microcopy = microcopyRef.current;

    if (!section || !orb || !headline || !subheadline || !cta || !microcopy) return;

    // Initial load animation
    const loadTl = gsap.timeline({ delay: 0.3 });

    loadTl
      .fromTo(orb, 
        { scale: 0.25, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo(headline.querySelectorAll('.word'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(subheadline,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(cta,
        { y: 14, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' },
        '-=0.2'
      )
      .fromTo(microcopy,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        '-=0.2'
      );

    // Scroll-driven exit animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onLeaveBack: () => {
          gsap.set([orb, headline, subheadline, cta, microcopy], {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          });
        }
      }
    });

    // Exit animations (70% - 100%)
    scrollTl
      .fromTo(orb,
        { scale: 1, x: 0, opacity: 1 },
        { scale: 0.65, x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(headline,
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      )
      .fromTo(subheadline,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.72
      )
      .fromTo(cta,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.74
      )
      .fromTo(microcopy,
        { y: 0, opacity: 1 },
        { y: '4vh', opacity: 0, ease: 'power2.in' },
        0.76
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
      className="section-pinned flex items-center justify-center z-10"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="vignette" />
      </div>

      {/* Orb Container */}
      <div
        ref={orbRef}
        className="relative w-[min(52vw,62vh)] aspect-square rounded-full overflow-hidden border border-white/10"
        style={{
          boxShadow: '0 0 100px rgba(123, 97, 255, 0.3), inset 0 0 60px rgba(123, 97, 255, 0.1)'
        }}
      >
        {/* Orb background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/30 via-[#07070A]/80 to-[#0E1016]/90" />
        
        {/* Content inside orb */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
          <h1
            ref={headlineRef}
            className="text-[clamp(32px,5vw,64px)] font-extrabold font-['Sora'] leading-[0.95] tracking-tight"
          >
            <span className="word inline-block">YOUR</span>{' '}
            <span className="word inline-block text-[#7B61FF]">UNIVERSE</span>
          </h1>

          <p
            ref={subheadlineRef}
            className="mt-6 text-[clamp(14px,1.5vw,18px)] text-[#A7ACB8] max-w-[70%]"
          >
            One watchlist. Every season. Curated for you.
          </p>

          <button
            ref={ctaRef}
            onClick={() => onNavigate('discover')}
            className="btn-primary mt-8 flex items-center gap-2 group"
          >
            Start Exploring
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Inner glow ring */}
        <div 
          className="absolute inset-4 rounded-full border border-[#7B61FF]/20 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 40px rgba(123, 97, 255, 0.1)' }}
        />
      </div>

      {/* Microcopy */}
      <p
        ref={microcopyRef}
        className="absolute bottom-[5vh] left-1/2 -translate-x-1/2 accent-text text-[#A7ACB8]"
      >
        Track. Discover. Share.
      </p>
    </section>
  );
};
