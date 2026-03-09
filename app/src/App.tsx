import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from '@/components/Header';
import { HeroSection } from '@/sections/HeroSection';
import { FeaturedSection } from '@/sections/FeaturedSection';
import { SeasonalGridSection } from '@/sections/SeasonalGridSection';
import { GenreOrbitSection } from '@/sections/GenreOrbitSection';
import { TrendingSection } from '@/sections/TrendingSection';
import { CommunityPulseSection } from '@/sections/CommunityPulseSection';
import { WatchlistSection } from '@/sections/WatchlistSection';
import { ChallengesSection } from '@/sections/ChallengesSection';
import { YearInReviewSection } from '@/sections/YearInReviewSection';
import { ClosingSection } from '@/sections/ClosingSection';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const mainRef = useRef<HTMLElement>(null);
  const snapTriggerRef = useRef<ScrollTrigger | null>(null);

  // Section configurations for global snap (used for navigation mapping)

  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();

      const allTriggers = ScrollTrigger.getAll();
      const pinned = allTriggers.filter(st => st.vars.pin).sort((a, b) => a.start - b.start);
      
      if (pinned.length === 0) return;

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll) return;

      // Build ranges and snap targets from actual pinned sections
      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap
      snapTriggerRef.current = ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with buffer)
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            
            // If not in a pinned section, allow free scroll
            if (!inPinned) return value;

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });

      // Update current section on scroll
      ScrollTrigger.create({
        onUpdate: (self) => {
          const progress = self.progress;
          
          if (progress < 0.077) setCurrentSection('hero');
          else if (progress < 0.154) setCurrentSection('discover');
          else if (progress < 0.231) setCurrentSection('seasonal');
          else if (progress < 0.308) setCurrentSection('discover');
          else if (progress < 0.385) setCurrentSection('discover');
          else if (progress < 0.462) setCurrentSection('community');
          else if (progress < 0.538) setCurrentSection('discover');
          else if (progress < 0.615) setCurrentSection('lists');
          else if (progress < 0.692) setCurrentSection('community');
          else if (progress < 0.769) setCurrentSection('community');
          else setCurrentSection('discover');
        },
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      if (snapTriggerRef.current) {
        snapTriggerRef.current.kill();
      }
    };
  }, []);

  const handleNavigate = (section: string) => {
    const sectionMap: Record<string, string> = {
      'hero': 'hero',
      'discover': 'featured',
      'seasonal': 'seasonal',
      'lists': 'watchlist',
      'community': 'community',
    };

    const targetSection = sectionMap[section] || section;
    
    // Scroll to section
    const sectionElements = document.querySelectorAll('section');
    sectionElements.forEach((el) => {
      if (el.classList.contains(`section-${targetSection}`)) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: el, offsetY: 0 },
          ease: 'power2.inOut',
        });
      }
    });
  };

  return (
    <div className="relative">

      {/* Header */}
      <Header onNavigate={handleNavigate} currentSection={currentSection} />

      {/* Main Content */}
      <main ref={mainRef} className="relative">
        <HeroSection onNavigate={handleNavigate} />
        <FeaturedSection />
        <SeasonalGridSection />
        <GenreOrbitSection />
        <TrendingSection />
        <CommunityPulseSection />
        <WatchlistSection />
        <ChallengesSection />
        <YearInReviewSection />
        <ClosingSection />
      </main>
    </div>
  );
}

export default App;
