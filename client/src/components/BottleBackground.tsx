import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bottleImage from '@assets/generated_images/premium_pet_water_bottle.png';

gsap.registerPlugin(ScrollTrigger);

interface BottleBackgroundProps {
  heroRef: React.RefObject<HTMLElement>;
}

export function BottleBackground({ heroRef }: BottleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!heroRef.current || !bottleRef.current || !containerRef.current || prefersReducedMotion) return;

    const bottle = bottleRef.current;
    const glow = glowRef.current;
    const ctx = gsap.context(() => {
      gsap.set(bottle, {
        y: 30,
        scale: 0.95,
        opacity: 0,
      });

      gsap.to(bottle, {
        y: 0,
        scale: 1,
        opacity: 0.85,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.5,
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      scrollTl
        .to(bottle, {
          y: -80,
          rotation: 3,
          scale: 1.08,
          opacity: 0.25,
          ease: 'none',
        })
        .to(glow, {
          opacity: 0.1,
          scale: 0.8,
          ease: 'none',
        }, 0);

      const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
      floatTl.to(bottle, {
        y: '+=8',
        duration: 4,
        ease: 'sine.inOut',
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => floatTl.play(),
        onLeave: () => floatTl.pause(),
        onEnterBack: () => floatTl.play(),
        onLeaveBack: () => floatTl.pause(),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [heroRef, imageLoaded, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div
        ref={bottleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[280px] h-[420px] md:w-[360px] md:h-[540px] lg:w-[400px] lg:h-[600px]"
        style={{
          opacity: prefersReducedMotion ? 0.5 : 0,
        }}
      >
        <div className="absolute inset-0 rounded-full blur-3xl bg-primary/10 scale-75" />
        
        <img
          src={bottleImage}
          alt=""
          className="relative w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 25px 50px rgba(14, 165, 233, 0.3)) drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))',
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)',
            animation: 'shimmer 8s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%) rotate(-45deg); }
          50% { transform: translateX(100%) rotate(-45deg); }
        }
      `}</style>
    </div>
  );
}
