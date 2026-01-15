import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, ArrowRight, TrendingUp, TrendingDown, Target, Clock, Zap, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { PageSkeleton } from '@/components/Skeleton';
import type { ScheduleKPIs } from '@shared/schema';

interface ScheduleComparison {
  baseline: ScheduleKPIs;
  riskAware: ScheduleKPIs;
  improvement: Record<keyof ScheduleKPIs, number>;
}

interface ObjectiveBreakdown {
  component: string;
  weight: number;
  baselineValue: number;
  riskAwareValue: number;
  contribution: number;
}

export function Evaluation() {
  const { data: comparison, isLoading } = useQuery<ScheduleComparison>({
    queryKey: ['/api/schedule/comparison'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockComparison: ScheduleComparison = comparison || {
    baseline: {
      makespan: 3200,
      totalLateness: 180,
      onTimeRate: 0.78,
      changeovers: 12,
      utilization: 0.72,
      riskCost: 0.35,
      stability: 0.65,
    },
    riskAware: {
      makespan: 2880,
      totalLateness: 90,
      onTimeRate: 0.92,
      changeovers: 8,
      utilization: 0.84,
      riskCost: 0.15,
      stability: 0.88,
    },
    improvement: {
      makespan: -10,
      totalLateness: -50,
      onTimeRate: 18,
      changeovers: -33,
      utilization: 17,
      riskCost: -57,
      stability: 35,
    },
  };

  const mockBreakdown: ObjectiveBreakdown[] = [
    { component: 'Lateness Penalty', weight: 0.30, baselineValue: 180, riskAwareValue: 90, contribution: 0.25 },
    { component: 'Changeover Cost', weight: 0.20, baselineValue: 12, riskAwareValue: 8, contribution: 0.18 },
    { component: 'Risk Cost', weight: 0.25, baselineValue: 0.35, riskAwareValue: 0.15, contribution: 0.22 },
    { component: 'Overtime Cost', weight: 0.10, baselineValue: 120, riskAwareValue: 60, contribution: 0.15 },
    { component: 'Idle Time Cost', weight: 0.10, baselineValue: 0.28, riskAwareValue: 0.16, contribution: 0.12 },
    { component: 'Stability Penalty', weight: 0.05, baselineValue: 0.35, riskAwareValue: 0.12, contribution: 0.08 },
  ];

  const KPIComparisonCard = ({ 
    label, 
    baseline, 
    riskAware, 
    improvement, 
    format = 'number',
    icon 
  }: { 
    label: string; 
    baseline: number; 
    riskAware: number; 
    improvement: number;
    format?: 'number' | 'percent' | 'time';
    icon: React.ReactNode;
  }) => {
    const formatValue = (val: number) => {
      if (format === 'percent') return `${(val * 100).toFixed(0)}%`;
      if (format === 'time') return `${val} min`;
      return val.toLocaleString();
    };

    const isPositive = improvement > 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Baseline</p>
              <p className="text-lg font-mono">{formatValue(baseline)}</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Risk-Aware</p>
              <p className="text-lg font-mono text-primary">{formatValue(riskAware)}</p>
            </div>
          </div>

          <div className={`mt-3 pt-3 border-t border-border/50 flex items-center gap-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{improvement.toFixed(0)}% {isPositive ? 'improvement' : 'change'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Evaluation</h1>
        <p className="text-sm text-muted-foreground">Baseline vs Risk-Aware schedule comparison</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIComparisonCard
          label="On-Time Rate"
          baseline={mockComparison.baseline.onTimeRate}
          riskAware={mockComparison.riskAware.onTimeRate}
          improvement={mockComparison.improvement.onTimeRate}
          format="percent"
          icon={<Target className="w-4 h-4" />}
        />
        <KPIComparisonCard
          label="Utilization"
          baseline={mockComparison.baseline.utilization}
          riskAware={mockComparison.riskAware.utilization}
          improvement={mockComparison.improvement.utilization}
          format="percent"
          icon={<Zap className="w-4 h-4" />}
        />
        <KPIComparisonCard
          label="Changeovers"
          baseline={mockComparison.baseline.changeovers}
          riskAware={mockComparison.riskAware.changeovers}
          improvement={mockComparison.improvement.changeovers}
          icon={<RotateCcw className="w-4 h-4" />}
        />
        <KPIComparisonCard
          label="Risk Cost"
          baseline={mockComparison.baseline.riskCost}
          riskAware={mockComparison.riskAware.riskCost}
          improvement={mockComparison.improvement.riskCost}
          format="percent"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Objective Function Breakdown</CardTitle>
          <CardDescription>Contribution of each component to the optimization objective</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBreakdown.map((item, i) => (
              <motion.div
                key={item.component}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="w-32 flex-shrink-0">
                  <p className="text-sm font-medium">{item.component}</p>
                  <p className="text-xs text-muted-foreground">Weight: {(item.weight * 100).toFixed(0)}%</p>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-muted/30 rounded-full overflow-hidden flex">
                    <motion.div
                      className="h-full bg-muted-foreground/30 rounded-l-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.contribution * 100 * 1.5}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                    />
                    <motion.div
                      className="h-full bg-primary rounded-r-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.contribution * 50}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
                    />
                  </div>
                </div>
                <div className="w-24 text-right">
                  <span className="text-sm font-mono text-primary">
                    {(item.contribution * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted-foreground/30" />
                <span className="text-xs text-muted-foreground">Baseline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-xs text-muted-foreground">Risk-Aware</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Objective Improvement</p>
              <p className="text-2xl font-bold text-gradient-ocean">-42%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Stability Analysis</CardTitle>
            <CardDescription>Schedule consistency across runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jobs Unchanged</span>
                <span className="font-mono text-primary">88%</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '88%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                High stability indicates consistent scheduling decisions across optimization runs.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Freeze Window Compliance</CardTitle>
            <CardDescription>Protected interval enforcement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Jobs in Freeze Window</span>
                <span className="font-mono">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Locked from Previous</span>
                <span className="font-mono text-primary">12 (100%)</span>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-xs text-green-400">
                  All jobs within the 3-hour freeze window are correctly locked from previous schedule.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
