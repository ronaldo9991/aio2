import { motion } from 'framer-motion';

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
}

export function BrowserFrame({ children, url = "aquaintel.ai", className = "" }: BrowserFrameProps) {
  return (
    <motion.div
      className={`overflow-hidden rounded-lg border border-border/50 bg-card shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/80">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-background/50 border border-border/30">
            <svg
              className="w-3.5 h-3.5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs text-muted-foreground font-medium">{url}</span>
          </div>
        </div>
        
        <div className="w-[52px]" />
      </div>
      
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}
