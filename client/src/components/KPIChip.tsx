import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIChipProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'border-border/50 bg-card/50',
  success: 'border-green-500/30 bg-green-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
  danger: 'border-red-500/30 bg-red-500/10',
};

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-muted-foreground',
};

export function KPIChip({ 
  label, 
  value, 
  trend, 
  trendValue, 
  icon,
  variant = 'default' 
}: KPIChipProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${variantStyles[variant]} hover-elevate`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">{value}</span>
          {trend && (
            <div className={`flex items-center gap-0.5 ${trendColors[trend]}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              {trendValue && <span className="text-xs font-medium">{trendValue}</span>}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface KPIGridProps {
  children: React.ReactNode;
  className?: string;
}

export function KPIGrid({ children, className = '' }: KPIGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {children}
    </div>
  );
}
