import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ClosingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const ctaBlock = ctaBlockRef.current;
    const footer = footerRef.current;

    if (!section || !ctaBlock || !footer) return;

    // Flowing animation (not pinned)
    const ctaTween = gsap.fromTo(ctaBlock,
      { y: 40, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.4,
        }
      }
    );

    const footerTween = gsap.fromTo(footer,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: footer,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 0.4,
        }
      }
    );

    if (ctaTween.scrollTrigger) triggersRef.current.push(ctaTween.scrollTrigger);
    if (footerTween.scrollTrigger) triggersRef.current.push(footerTween.scrollTrigger);

    return () => {
      triggersRef.current.forEach(st => st.kill());
      triggersRef.current = [];
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup
    alert(`Thanks for signing up with ${email}!`);
    setEmail('');
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col z-[100]"
      style={{ background: '#07070A' }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/80 to-[#07070A]/60" />
      </div>

      {/* CTA Block */}
      <div
        ref={ctaBlockRef}
        className="flex-1 flex items-center justify-center px-[7vw] py-20"
      >
        <div className="text-center max-w-[720px]">
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold font-['Sora'] leading-tight mb-6">
            Track everything.<br />
            <span className="text-[#7B61FF]">Miss nothing.</span>
          </h2>
          <p className="text-lg text-[#A7ACB8] mb-8">
            Join 500,000+ fans building the ultimate watchlist.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-[#A7ACB8] focus:outline-none focus:border-[#7B61FF] transition-colors"
                required
              />
            </div>
            <button type="submit" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-sm text-[#A7ACB8] mt-4">
            Free forever. No credit card required.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="relative px-[7vw] py-8 border-t border-white/5"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-['Sora'] text-white">
              AnimeVerse
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-[#A7ACB8] hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-[#A7ACB8] hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-[#A7ACB8] hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="text-sm text-[#A7ACB8] hover:text-white transition-colors">
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[#A7ACB8]">
            © 2026 AnimeVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
};
