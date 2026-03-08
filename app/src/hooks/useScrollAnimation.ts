import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const createPinnedSection = (
    element: HTMLElement,
    animationCallback: (tl: gsap.core.Timeline) => void,
    options: {
      end?: string;
      scrub?: number | boolean;
      settleTarget?: number;
    } = {}
  ) => {
    const { end = '+=130%', scrub = 0.6 } = options;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top top',
        end,
        pin: true,
        scrub,
        anticipatePin: 1,
        onLeaveBack: () => {
          tl.progress(0);
        }
      }
    });

    animationCallback(tl);

    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    return tl;
  };

  const createFlowingAnimation = (
    element: HTMLElement,
    from: gsap.TweenVars,
    to: gsap.TweenVars,
    options: {
      start?: string;
      end?: string;
      scrub?: number | boolean;
    } = {}
  ) => {
    const { start = 'top 80%', end = 'top 20%', scrub = 0.4 } = options;

    const tween = gsap.fromTo(element, from, {
      ...to,
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub,
      }
    });

    if (tween.scrollTrigger) {
      triggersRef.current.push(tween.scrollTrigger);
    }

    return tween;
  };

  return {
    sectionRef,
    createPinnedSection,
    createFlowingAnimation,
    gsap
  };
};

export const useGlobalSnap = (pinnedSections: { start: number; end: number; settleRatio: number }[]) => {
  useEffect(() => {
    const setupSnap = () => {
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll) return;

      const pinnedRanges = pinnedSections.map(section => ({
        start: section.start * maxScroll,
        end: section.end * maxScroll,
        center: (section.start + (section.end - section.start) * section.settleRatio) * maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 50 && value <= r.end + 50
            );
            if (!inPinned) return value;

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
    };

    ScrollTrigger.refresh();
    setTimeout(setupSnap, 100);

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.snap) st.kill();
      });
    };
  }, [pinnedSections]);
};
