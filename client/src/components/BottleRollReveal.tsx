import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import bottleImage from '@assets/generated_images/transparent_pet_bottle_cutout.png';

gsap.registerPlugin(ScrollTrigger);

interface BottleRollRevealProps {
  heroRef: React.RefObject<HTMLElement>;
}

export function BottleRollReveal({ heroRef }: BottleRollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!heroRef.current || !bottleRef.current || !containerRef.current) return;
    
    const bottle = bottleRef.current;
    const highlight = highlightRef.current;

    if (prefersReducedMotion) {
      gsap.set(bottle, { opacity: 0.6 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(bottle, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotateZ: -3,
      });

      gsap.to(bottle, {
        opacity: 0.85,
        y: 0,
        scale: 1,
        rotateZ: 0,
        duration: 1.2,
        delay: 0.4,
        ease: 'power3.out',
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            const dir = self.direction;
            const targetRotation = dir === 1 ? 8 : -8;
            
            gsap.to(bottle, {
              rotateZ: targetRotation * Math.min(self.progress * 1.5, 1),
              duration: 0.4,
              overwrite: 'auto',
            });

            if (highlight) {
              gsap.to(highlight, {
                y: `${(self.progress - 0.5) * 80}%`,
                duration: 0.3,
                overwrite: 'auto',
              });
            }
          },
        },
      });

      scrollTl
        .to(bottle, {
          y: -100,
          scale: 1.12,
          ease: 'none',
        }, 0)
        .to(bottle, {
          opacity: 0.15,
          ease: 'power2.in',
        }, 0.7);

      const floatTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
      floatTl.to(bottle, {
        y: '+=10',
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
  }, [heroRef, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 10 }}
      aria-hidden="true"
      data-testid="bottle-reveal-container"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
        }}
      />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 55%)',
          filter: 'blur(100px)',
        }}
      />

      <div
        ref={bottleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                   w-[280px] h-[420px] md:w-[360px] md:h-[540px] lg:w-[400px] lg:h-[600px]"
        style={{
          willChange: 'transform, opacity',
        }}
        data-testid="bottle-element"
      >
        <img
          src={bottleImage}
          alt=""
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 40px 80px rgba(14, 165, 233, 0.3)) drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))',
          }}
        />

        <div
          ref={highlightRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 60%, transparent 100%)',
            mixBlendMode: 'overlay',
            willChange: 'transform',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: 'linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 60%, transparent 75%)',
            animation: 'shimmerSlow 10s ease-in-out infinite',
          }}
        />
      </div>

      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <style>{`
        @keyframes shimmerSlow {
          0%, 100% { 
            transform: translateX(-100%) rotate(-45deg); 
            opacity: 0.2;
          }
          50% { 
            transform: translateX(100%) rotate(-45deg); 
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
