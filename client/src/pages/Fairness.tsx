import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Scale, Users, Clock, BarChart3, TrendingUp, AlertTriangle, Zap, Target, Activity, Info, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';

interface FairnessMetric {
  group: string;
  groupType: 'shift' | 'setup_group' | 'line' | 'machine_type';
  jobsAssigned: number;
  avgUtilization: number;
  latenessRate: number;
  riskExposure: number;
  defectRate?: number;
  energyPerJob?: number;
  downtimeHours?: number;
  oee?: number;
  avgSetupTime?: number;
  priorityJobsRatio?: number;
  fairnessScore?: number;
}

export function Fairness() {
  const { data: metrics, isLoading } = useQuery<FairnessMetric[]>({
    queryKey: ['/api/fairness/metrics'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockMetrics: FairnessMetric[] = metrics || [
    { 
      group: 'Morning Shift', 
      groupType: 'shift', 
      jobsAssigned: 45, 
      avgUtilization: 0.84, 
      latenessRate: 0.08, 
      riskExposure: 0.22,
      defectRate: 2.1,
      energyPerJob: 18.5,
      downtimeHours: 2.5,
      oee: 0.82,
      avgSetupTime: 25,
      priorityJobsRatio: 0.35,
      fairnessScore: 0.88
    },
    { 
      group: 'Evening Shift', 
      groupType: 'shift', 
      jobsAssigned: 42, 
      avgUtilization: 0.81, 
      latenessRate: 0.12, 
      riskExposure: 0.25,
      defectRate: 2.8,
      energyPerJob: 19.2,
      downtimeHours: 3.2,
      oee: 0.78,
      avgSetupTime: 28,
      priorityJobsRatio: 0.28,
      fairnessScore: 0.82
    },
    { 
      group: 'Night Shift', 
      groupType: 'shift', 
      jobsAssigned: 38, 
      avgUtilization: 0.78, 
      latenessRate: 0.15, 
      riskExposure: 0.28,
      defectRate: 3.2,
      energyPerJob: 20.1,
      downtimeHours: 4.1,
      oee: 0.74,
      avgSetupTime: 32,
      priorityJobsRatio: 0.22,
      fairnessScore: 0.75
    },
    { 
      group: 'Setup Group A', 
      groupType: 'setup_group', 
      jobsAssigned: 32, 
      avgUtilization: 0.86, 
      latenessRate: 0.06, 
      riskExposure: 0.18,
      defectRate: 1.8,
      energyPerJob: 17.8,
      downtimeHours: 1.8,
      oee: 0.85,
      avgSetupTime: 22,
      priorityJobsRatio: 0.40,
      fairnessScore: 0.91
    },
    { 
      group: 'Setup Group B', 
      groupType: 'setup_group', 
      jobsAssigned: 28, 
      avgUtilization: 0.82, 
      latenessRate: 0.10, 
      riskExposure: 0.24,
      defectRate: 2.5,
      energyPerJob: 18.9,
      downtimeHours: 2.8,
      oee: 0.80,
      avgSetupTime: 26,
      priorityJobsRatio: 0.32,
      fairnessScore: 0.85
    },
    { 
      group: 'Setup Group C', 
      groupType: 'setup_group', 
      jobsAssigned: 35, 
      avgUtilization: 0.79, 
      latenessRate: 0.14, 
      riskExposure: 0.30,
      defectRate: 3.1,
      energyPerJob: 19.8,
      downtimeHours: 3.5,
      oee: 0.76,
      avgSetupTime: 30,
      priorityJobsRatio: 0.25,
      fairnessScore: 0.78
    },
  ];

  const shiftMetrics = mockMetrics.filter(m => m.groupType === 'shift');
  const setupGroupMetrics = mockMetrics.filter(m => m.groupType === 'setup_group');

  // Calculate overall fairness metrics
  const avgFairnessScore = mockMetrics.reduce((acc, m) => acc + (m.fairnessScore || 0), 0) / mockMetrics.length;
  const maxVariance = Math.max(...mockMetrics.map(m => m.avgUtilization)) - Math.min(...mockMetrics.map(m => m.avgUtilization));
  const avgDefectRate = mockMetrics.reduce((acc, m) => acc + (m.defectRate || 0), 0) / mockMetrics.length;
  const avgOEE = mockMetrics.reduce((acc, m) => acc + (m.oee || 0), 0) / mockMetrics.length;

  const getFairnessColor = (score: number) => {
    if (score >= 0.85) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 0.75) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const MetricBar = ({ value, max = 1, color = 'bg-primary', label }: { value: number; max?: number; color?: string; label?: string }) => (
    <div className="space-y-1">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Fairness Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor equity and balance across shifts, lines, and machine groups
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How Fairness Metrics Work</AlertTitle>
        <AlertDescription>
          This dashboard ensures fair distribution of workload, resources, and opportunities across all groups.
          <br />
          • <strong>Fairness Score:</strong> Overall equity rating (0-100%, higher is better)
          <br />
          • <strong>Workload Balance:</strong> Ensures similar job assignments across groups
          <br />
          • <strong>Resource Access:</strong> Monitors equal access to machines and priority jobs
          <br />
          • <strong>Performance Equity:</strong> Tracks OEE, quality, and efficiency fairness
        </AlertDescription>
      </Alert>

      <KPIGrid>
        <KPIChip
          label="Overall Fairness Score"
          value={`${(avgFairnessScore * 100).toFixed(0)}%`}
          icon={<Scale className="w-5 h-5" />}
          variant={avgFairnessScore >= 0.85 ? 'success' : avgFairnessScore >= 0.75 ? 'default' : 'warning'}
        />
        <KPIChip
          label="Utilization Variance"
          value={`${(maxVariance * 100).toFixed(1)}%`}
          icon={<BarChart3 className="w-5 h-5" />}
          variant={maxVariance < 0.10 ? 'success' : maxVariance < 0.15 ? 'default' : 'warning'}
        />
        <KPIChip
          label="Avg Defect Rate"
          value={`${avgDefectRate.toFixed(1)}%`}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={avgDefectRate < 2 ? 'success' : avgDefectRate < 3 ? 'default' : 'warning'}
        />
        <KPIChip
          label="Avg OEE"
          value={`${(avgOEE * 100).toFixed(0)}%`}
          icon={<Activity className="w-5 h-5" />}
          variant={avgOEE >= 0.80 ? 'success' : avgOEE >= 0.70 ? 'default' : 'warning'}
        />
        <KPIChip
          label="Groups Monitored"
          value={mockMetrics.length}
          icon={<Users className="w-5 h-5" />}
        />
      </KPIGrid>

      {/* Fairness Score Comparison Chart */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Fairness Score by Group</CardTitle>
          <CardDescription>Overall equity rating across all monitored groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMetrics.map((metric, i) => (
              <div key={metric.group} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.group}</span>
                    <Badge className={getFairnessColor(metric.fairnessScore || 0)}>
                      {(metric.fairnessScore || 0) >= 0.85 ? 'Excellent' : (metric.fairnessScore || 0) >= 0.75 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                  <span className="text-sm font-mono">{(metric.fairnessScore || 0) * 100}%</span>
                </div>
                <MetricBar 
                  value={metric.fairnessScore || 0} 
                  max={1}
                  color={(metric.fairnessScore || 0) >= 0.85 ? 'bg-green-500' : (metric.fairnessScore || 0) >= 0.75 ? 'bg-yellow-500' : 'bg-red-500'}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* By Shift */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              By Shift
            </CardTitle>
            <CardDescription>Workload and performance distribution across shifts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {shiftMetrics.map((metric) => (
              <div key={metric.group} className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.group}</span>
                  <Badge variant="outline">{metric.jobsAssigned} jobs</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">OEE</span>
                      <span className="font-mono">{(metric.oee || 0) * 100}%</span>
                    </div>
                    <MetricBar value={metric.oee || 0} max={1} color="bg-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Defect Rate</span>
                      <span className="font-mono">{metric.defectRate?.toFixed(1)}%</span>
                    </div>
                    <MetricBar value={(metric.defectRate || 0) / 5} max={1} color="bg-red-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Energy/Job</span>
                      <span className="font-mono">{metric.energyPerJob?.toFixed(1)} kWh</span>
                    </div>
                    <MetricBar value={(metric.energyPerJob || 0) / 25} max={1} color="bg-yellow-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Downtime</span>
                      <span className="font-mono">{metric.downtimeHours?.toFixed(1)}h</span>
                    </div>
                    <MetricBar value={(metric.downtimeHours || 0) / 6} max={1} color="bg-orange-500" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Priority Jobs</span>
                    <span className="font-mono">{(metric.priorityJobsRatio || 0) * 100}%</span>
                  </div>
                  <MetricBar value={metric.priorityJobsRatio || 0} max={1} color="bg-purple-500" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* By Setup Group */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              By Setup Group
            </CardTitle>
            <CardDescription>Performance metrics per machine setup group</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {setupGroupMetrics.map((metric) => (
              <div key={metric.group} className="space-y-4 p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.group}</span>
                  <Badge variant="outline">{metric.jobsAssigned} jobs</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">OEE</span>
                      <span className="font-mono">{(metric.oee || 0) * 100}%</span>
                    </div>
                    <MetricBar value={metric.oee || 0} max={1} color="bg-primary" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Defect Rate</span>
                      <span className="font-mono">{metric.defectRate?.toFixed(1)}%</span>
                    </div>
                    <MetricBar value={(metric.defectRate || 0) / 5} max={1} color="bg-red-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Avg Setup Time</span>
                      <span className="font-mono">{metric.avgSetupTime} min</span>
                    </div>
                    <MetricBar value={(metric.avgSetupTime || 0) / 40} max={1} color="bg-blue-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Risk Exposure</span>
                      <span className="font-mono">{(metric.riskExposure * 100).toFixed(0)}%</span>
                    </div>
                    <MetricBar value={metric.riskExposure} max={1} color="bg-orange-500" />
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-mono">{(metric.avgUtilization * 100).toFixed(0)}%</span>
                  </div>
                  <MetricBar value={metric.avgUtilization} max={1} color="bg-green-500" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fairness Recommendations */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Fairness Recommendations</CardTitle>
          <CardDescription>Actionable suggestions to improve equity across groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMetrics
              .filter(m => (m.fairnessScore || 0) < 0.80)
              .map((metric) => (
                <div key={metric.group} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-400">{metric.group} - Fairness Score: {(metric.fairnessScore || 0) * 100}%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.groupType === 'shift' 
                        ? `Consider redistributing ${Math.round((0.85 - (metric.fairnessScore || 0)) * 10)} priority jobs to improve equity.`
                        : `Review machine assignments and setup procedures to reduce variance. Current utilization: ${(metric.avgUtilization * 100).toFixed(0)}%`
                      }
                    </p>
                  </div>
                </div>
              ))}
            
            {mockMetrics.filter(m => (m.fairnessScore || 0) < 0.80).length === 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-400">Excellent Fairness Distribution</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All groups show balanced workload, resource access, and performance metrics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
