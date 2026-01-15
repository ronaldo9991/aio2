import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [location] = useLocation();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest < 100) {
      setIsVisible(true);
    } else if (latest > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });

  return (
    <AnimatePresence>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-3 rounded-xl glass border border-white/5">
            <Link href="/">
              <motion.div 
                className="flex items-center gap-3 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm ocean-glow-sm">
                  AQ
                </div>
                <span className="font-bold tracking-tight hidden sm:inline">AQUAINTEL</span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {['Features', 'Modules', 'Gallery'].map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid={`nav-${item.toLowerCase()}`}
                >
                  {item}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm"
                  data-testid="button-login"
                >
                  Login
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="sm"
                  className="ocean-glow-sm"
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-2 mx-auto max-w-7xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="glass rounded-xl p-4 space-y-2">
                {['Features', 'Modules', 'Gallery'].map((item) => (
                  <Button
                    key={item}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
}
