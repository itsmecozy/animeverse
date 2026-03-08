import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Share2, TrendingUp, Clock, Film, Award } from 'lucide-react';
import { yearInReviewData } from '@/data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const YearInReviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  const data = yearInReviewData;

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const cardElements = cards.querySelectorAll('.stats-card-large');

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
      className="section-pinned z-[90]"
      style={{ background: '#07070A' }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="absolute left-[7vw] top-[10vh]"
      >
        <span className="accent-text text-[#7B61FF] block mb-2">
          Personalized Recap
        </span>
        <h2 className="text-[clamp(24px,2.5vw,36px)] font-bold font-['Sora']">
          Your Year in Review
        </h2>
        <p className="text-[#A7ACB8] mt-2">
          {data.year} was quite a journey. Here's what you accomplished.
        </p>
      </div>

      {/* Stats Cards */}
      <div
        ref={cardsRef}
        className="absolute left-[7vw] top-[26vh] w-[86vw] flex gap-[3vw]"
      >
        {/* Card 1 - Anime Completed */}
        <div className="stats-card-large w-[26vw] h-[54vh] rounded-[22px] bg-[#0E1016] border border-white/10 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#7B61FF]/20">
              <Film className="w-6 h-6 text-[#7B61FF]" />
            </div>
            <span className="text-[#A7ACB8]">Anime Completed</span>
          </div>
          <p className="text-[clamp(48px,5vw,72px)] font-extrabold font-['Sora'] text-[#7B61FF] leading-none">
            {data.animeCompleted}
          </p>
          <p className="text-[#A7ACB8] mt-2">
            That's {Math.round(data.animeCompleted / 52 * 10) / 10} per week!
          </p>
          <div className="mt-auto">
            <p className="text-sm text-[#A7ACB8] mb-2">Top Anime</p>
            <div className="space-y-2">
              {data.topAnime.slice(0, 3).map((anime, index) => (
                <div key={anime.id} className="flex items-center gap-2">
                  <span className="text-[#7B61FF] font-bold">{index + 1}</span>
                  <span className="text-white text-sm truncate">{anime.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2 - Minutes Watched */}
        <div className="stats-card-large w-[26vw] h-[54vh] rounded-[22px] bg-[#0E1016] border border-white/10 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#4ECDC4]/20">
              <Clock className="w-6 h-6 text-[#4ECDC4]" />
            </div>
            <span className="text-[#A7ACB8]">Minutes Watched</span>
          </div>
          <p className="text-[clamp(48px,5vw,72px)] font-extrabold font-['Sora'] text-[#4ECDC4] leading-none">
            {data.minutesWatched.toLocaleString()}
          </p>
          <p className="text-[#A7ACB8] mt-2">
            That's {Math.round(data.minutesWatched / 60 / 24 * 10) / 10} days!
          </p>
          <div className="mt-auto">
            <p className="text-sm text-[#A7ACB8] mb-2">Longest Streak</p>
            <p className="text-2xl font-bold text-white">{data.streakDays} days</p>
            <p className="text-sm text-[#A7ACB8]">You were on fire!</p>
          </div>
        </div>

        {/* Card 3 - Top Genre & Badges */}
        <div className="stats-card-large w-[26vw] h-[54vh] rounded-[22px] bg-[#0E1016] border border-white/10 p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#FFD700]/20">
              <TrendingUp className="w-6 h-6 text-[#FFD700]" />
            </div>
            <span className="text-[#A7ACB8]">Top Genre</span>
          </div>
          <p className="text-[clamp(32px,3vw,48px)] font-extrabold font-['Sora'] text-[#FFD700] leading-none">
            {data.topGenres[0].genre}
          </p>
          <p className="text-[#A7ACB8] mt-2">
            {data.topGenres[0].count} titles watched
          </p>
          <div className="mt-auto">
            <p className="text-sm text-[#A7ACB8] mb-2">Badges Earned</p>
            <div className="flex flex-wrap gap-2">
              {data.badgesEarned.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                >
                  <Award className="w-3 h-3 text-[#7B61FF]" />
                  <span className="text-xs text-white">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Share Button */}
      <button className="absolute left-1/2 -translate-x-1/2 bottom-[6vh] flex items-center gap-2 px-6 py-3 rounded-full bg-[#7B61FF]/20 border border-[#7B61FF]/50 text-[#7B61FF] hover:bg-[#7B61FF]/30 transition-colors">
        <Share2 className="w-4 h-4" />
        Share Your Recap
      </button>
    </section>
  );
};
