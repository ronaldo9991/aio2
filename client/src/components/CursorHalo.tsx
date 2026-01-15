import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CursorHalo() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    setIsIdle(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    
    const idleTimer = setInterval(() => {
      setIsIdle(true);
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(idleTimer);
    };
  }, [handleMouseMove]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed pointer-events-none z-40"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isIdle ? 0 : 0.6,
            x: position.x - 100,
            y: position.y - 100,
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 0.3 },
            x: { type: "spring", stiffness: 150, damping: 15 },
            y: { type: "spring", stiffness: 150, damping: 15 },
          }}
        >
          <div className="w-[200px] h-[200px] rounded-full bg-primary/20 blur-3xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
