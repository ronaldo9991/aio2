import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Scale, Users, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { PageSkeleton } from '@/components/Skeleton';

interface FairnessMetric {
  group: string;
  groupType: 'shift' | 'line' | 'supplier' | 'mold';
  jobsAssigned: number;
  avgUtilization: number;
  latenessRate: number;
  riskExposure: number;
}

export function Fairness() {
  const { data: metrics, isLoading } = useQuery<FairnessMetric[]>({
    queryKey: ['/api/fairness/metrics'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockMetrics: FairnessMetric[] = metrics || [
    { group: 'Morning Shift', groupType: 'shift', jobsAssigned: 45, avgUtilization: 0.84, latenessRate: 0.08, riskExposure: 0.22 },
    { group: 'Evening Shift', groupType: 'shift', jobsAssigned: 42, avgUtilization: 0.81, latenessRate: 0.12, riskExposure: 0.25 },
    { group: 'Night Shift', groupType: 'shift', jobsAssigned: 38, avgUtilization: 0.78, latenessRate: 0.15, riskExposure: 0.28 },
    { group: 'Line A', groupType: 'line', jobsAssigned: 52, avgUtilization: 0.86, latenessRate: 0.06, riskExposure: 0.18 },
    { group: 'Line B', groupType: 'line', jobsAssigned: 48, avgUtilization: 0.82, latenessRate: 0.10, riskExposure: 0.24 },
    { group: 'Line C', groupType: 'line', jobsAssigned: 25, avgUtilization: 0.75, latenessRate: 0.18, riskExposure: 0.32 },
  ];

  const shiftMetrics = mockMetrics.filter(m => m.groupType === 'shift');
  const lineMetrics = mockMetrics.filter(m => m.groupType === 'line');

  const avgUtilization = mockMetrics.reduce((acc, m) => acc + m.avgUtilization, 0) / mockMetrics.length;
  const maxVariance = Math.max(...mockMetrics.map(m => m.avgUtilization)) - Math.min(...mockMetrics.map(m => m.avgUtilization));

  const MetricBar = ({ value, max = 1, color = 'bg-primary' }: { value: number; max?: number; color?: string }) => (
    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.6 }}
      />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Fairness Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bias monitoring across shifts, lines, and suppliers</p>
      </motion.div>

      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Scale className="w-5 h-5" />
          <span className="font-medium">Fairness Policy</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Operator ID and Shift ID are <strong>not used</strong> as features in scheduling or risk models. 
          This dashboard monitors group-level metrics for bias detection without introducing individual-level bias.
        </p>
      </div>

      <KPIGrid>
        <KPIChip
          label="Groups Monitored"
          value={mockMetrics.length}
          icon={<Users className="w-5 h-5" />}
        />
        <KPIChip
          label="Avg Utilization"
          value={`${(avgUtilization * 100).toFixed(0)}%`}
          icon={<BarChart3 className="w-5 h-5" />}
        />
        <KPIChip
          label="Max Variance"
          value={`${(maxVariance * 100).toFixed(1)}%`}
          icon={<Scale className="w-5 h-5" />}
          variant={maxVariance > 0.15 ? 'warning' : 'default'}
        />
      </KPIGrid>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              By Shift
            </CardTitle>
            <CardDescription>Workload distribution across shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {shiftMetrics.map((metric, i) => (
              <div key={metric.group} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.group}</span>
                  <span className="text-sm text-muted-foreground">{metric.jobsAssigned} jobs</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Utilization</span>
                    <div className="flex-1">
                      <MetricBar value={metric.avgUtilization} />
                    </div>
                    <span className="text-xs font-mono w-10">{(metric.avgUtilization * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Lateness</span>
                    <div className="flex-1">
                      <MetricBar value={metric.latenessRate} color="bg-yellow-500" />
                    </div>
                    <span className="text-xs font-mono w-10">{(metric.latenessRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Risk Exp.</span>
                    <div className="flex-1">
                      <MetricBar value={metric.riskExposure} color="bg-red-500" />
                    </div>
                    <span className="text-xs font-mono w-10">{(metric.riskExposure * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              By Production Line
            </CardTitle>
            <CardDescription>Performance metrics per line</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lineMetrics.map((metric, i) => (
              <div key={metric.group} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.group}</span>
                  <span className="text-sm text-muted-foreground">{metric.jobsAssigned} jobs</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Utilization</span>
                    <div className="flex-1">
                      <MetricBar value={metric.avgUtilization} />
                    </div>
                    <span className="text-xs font-mono w-10">{(metric.avgUtilization * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Lateness</span>
                    <div className="flex-1">
                      <MetricBar value={metric.latenessRate} color="bg-yellow-500" />
                    </div>
                    <span className="text-xs font-mono w-10">{(metric.latenessRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-20">Risk Exp.</span>
                    <div className="flex-1">
                      <MetricBar value={metric.riskExposure} color="bg-red-500" />
                    </div>
                    <span className="text-xs font-mono w-10">{(metric.riskExposure * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Fairness Recommendations</CardTitle>
          <CardDescription>Suggestions for improving workload balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <Scale className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Night Shift Underutilization</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Consider redistributing 5-7 jobs from Morning Shift to Night Shift to improve balance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Scale className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Line C Risk Exposure</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Line C has higher risk exposure. Review machine assignments and maintenance schedules.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
