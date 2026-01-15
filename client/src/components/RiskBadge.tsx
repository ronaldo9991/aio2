import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface RiskBadgeProps {
  level: RiskLevel;
  value?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const riskConfig: Record<RiskLevel, { 
  color: string; 
  bg: string; 
  border: string;
  icon: typeof CheckCircle;
  label: string;
}> = {
  low: {
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: CheckCircle,
    label: 'Low Risk',
  },
  medium: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: AlertCircle,
    label: 'Medium Risk',
  },
  high: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: AlertTriangle,
    label: 'High Risk',
  },
  critical: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: XCircle,
    label: 'Critical',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

export function RiskBadge({ level, value, showIcon = true, size = 'md' }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <motion.span
      className={`inline-flex items-center font-medium rounded-md border ${config.bg} ${config.border} ${config.color} ${sizeClasses[size]}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {value !== undefined ? `${(value * 100).toFixed(0)}%` : config.label}
    </motion.span>
  );
}

export function getRiskLevel(value: number): RiskLevel {
  if (value < 0.25) return 'low';
  if (value < 0.5) return 'medium';
  if (value < 0.75) return 'high';
  return 'critical';
}
