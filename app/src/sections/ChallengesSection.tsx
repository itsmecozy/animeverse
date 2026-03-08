import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Users, Check } from 'lucide-react';
import { challengesData } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const ChallengesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const challenges = challengesData;

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const cardElements = cards.querySelectorAll('.challenge-card');

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

    cardElements.forEach((card, index) => {
      scrollTl.fromTo(card,
        { y: '60vh', opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, ease: 'none' },
        0.05 + index * 0.08
      );
    });

    // EXIT (70% - 100%)
    scrollTl
      .to(header,
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

    cardElements.forEach((card, index) => {
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
      className="section-pinned z-[80]"
      style={{ background: '#07070A' }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="absolute left-[7vw] top-[10vh]"
      >
        <span className="accent-text text-[#7B61FF] block mb-2">
          Gamification
        </span>
        <h2 className="text-[clamp(24px,2.5vw,36px)] font-bold font-['Sora']">
          Community Challenges
        </h2>
        <p className="text-[#A7ACB8] mt-2 max-w-[40vw]">
          Join seasonal challenges, earn badges, and compete with the community
        </p>
      </div>

      {/* Challenge Cards */}
      <div
        ref={cardsRef}
        className="absolute left-[7vw] top-[26vh] w-[86vw] flex gap-[3vw]"
      >
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="challenge-card w-[26vw] h-[54vh] rounded-[22px] bg-[#0E1016] border border-white/10 overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative h-[40%] overflow-hidden">
              <img
                src={challenge.thumbnail}
                alt={challenge.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1016] to-transparent" />
              {challenge.joined && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#7B61FF] text-white text-xs font-semibold">
                  <Check className="w-3 h-3" />
                  Joined
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col">
              <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
              <p className="text-sm text-[#A7ACB8] mt-2 line-clamp-2">
                {challenge.description}
              </p>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#A7ACB8]">Progress</span>
                  <span className="text-[#7B61FF] font-semibold">{challenge.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7B61FF] to-[#4ECDC4] rounded-full transition-all duration-500"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-[#A7ACB8]">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {challenge.participants.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  {challenge.rewards.length} reward{challenge.rewards.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* CTA */}
              <button
                className={`mt-auto w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  challenge.joined
                    ? 'bg-[#7B61FF]/20 text-[#7B61FF] cursor-default'
                    : 'bg-[#7B61FF] text-white hover:bg-[#7B61FF]/90'
                }`}
                disabled={challenge.joined}
              >
                {challenge.joined ? 'Already Joined' : 'Join Challenge'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
