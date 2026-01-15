import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoaderIntroProps {
  onComplete: () => void;
  skipIfReady?: boolean;
}

export function LoaderIntro({ onComplete, skipIfReady = false }: LoaderIntroProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (skipIfReady) {
      onComplete();
      return;
    }

    const timings = [400, 400, 400, 500, 400, 400];
    let currentPhase = 0;

    const advancePhase = () => {
      currentPhase++;
      if (currentPhase < 6) {
        setPhase(currentPhase);
        setTimeout(advancePhase, timings[currentPhase]);
      } else {
        onComplete();
      }
    };

    setTimeout(advancePhase, timings[0]);
  }, [skipIfReady, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                key="dot"
                className="w-3 h-3 rounded-full bg-primary animate-pulse-glow"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scaleX: 20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}

            {phase === 1 && (
              <motion.div
                key="line"
                className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 120, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}

            {phase === 2 && (
              <motion.span
                key="aq"
                className="text-4xl font-bold tracking-tight text-gradient-ocean"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                AQ
              </motion.span>
            )}

            {phase >= 3 && phase < 5 && (
              <motion.div
                key="full"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-ocean"
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.02em" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  AQUAINTEL
                </motion.span>
                
                {phase >= 4 && (
                  <motion.div
                    className="h-0.5 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            )}

            {phase === 5 && (
              <motion.div
                key="fadeout"
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4, ease: "easeIn" }}
              >
                <span className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-ocean">
                  AQUAINTEL
                </span>
                <div className="h-0.5 bg-primary rounded-full w-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
