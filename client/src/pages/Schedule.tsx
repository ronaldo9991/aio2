import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Calendar, 
  Play, 
  RotateCcw, 
  Clock,
  Target,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Wrench,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

interface ScheduleItem {
  id: string;
  machineId: string;
  jobId: string;
  startTs: string;
  endTs: string;
  frozen: boolean;
  riskScore?: number;
}

interface Schedule {
  id: string;
  runId: string;
  mode: 'baseline' | 'risk_aware';
  createdAt: string;
  kpiJson: any;
  items: ScheduleItem[];
}

export function Schedule() {
  const [activeMode, setActiveMode] = useState<'baseline' | 'risk_aware'>('risk_aware');
  const { toast } = useToast();

  const { data: schedule, isLoading } = useQuery<Schedule>({
    queryKey: ['/api/schedule/latest', activeMode],
  });

  const { data: comparison } = useQuery<any>({
    queryKey: ['/api/schedule/comparison'],
  });

  const runScheduleMutation = useMutation({
    mutationFn: async (mode: 'baseline' | 'risk_aware') => {
      return apiRequest('POST', `/schedule/run?mode=${mode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/latest'] });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/comparison'] });
      toast({
        title: 'Schedule Generated',
        description: 'New schedule has been computed successfully.',
      });
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const kpis = schedule?.kpiJson || {
    makespan: 2880,
    totalLateness: 120,
    onTimeRate: 0.92,
    changeovers: 8,
    utilization: 0.84,
    riskCost: 0.15,
    stability: 0.88,
  };

  const comp = comparison || {
    baseline: { makespan: 3200, totalLateness: 180, onTimeRate: 0.78, changeovers: 12, utilization: 0.72, riskCost: 0.35, stability: 0.65 },
    riskAware: { makespan: 2880, totalLateness: 90, onTimeRate: 0.92, changeovers: 8, utilization: 0.84, riskCost: 0.15, stability: 0.88 },
    improvement: { makespan: -10, totalLateness: -50, onTimeRate: 18, changeovers: -33, utilization: 17, riskCost: -57, stability: 35 },
  };

  // Generate hourly schedule data for machines and robotics
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const machineScheduleData = hours.map((hour, i) => ({
    hour,
    jobsScheduled: Math.round(2 + Math.random() * 3),
    utilization: 0.75 + Math.random() * 0.15,
    riskScore: 0.15 + Math.random() * 0.20,
  }));

  // FIXED VALUES for Robotics Schedule - matching image
  const roboticsScheduleData = [
    { hour: '08:00', tasksScheduled: 5, utilization: 0.72, pickRate: 165, riskScore: 0.18 },
    { hour: '09:00', tasksScheduled: 4, utilization: 0.62, pickRate: 167, riskScore: 0.28 },
    { hour: '10:00', tasksScheduled: 5, utilization: 0.60, pickRate: 147, riskScore: 0.20 },
    { hour: '11:00', tasksScheduled: 4, utilization: 0.60, pickRate: 153, riskScore: 0.22 },
    { hour: '12:00', tasksScheduled: 4, utilization: 0.60, pickRate: 155, riskScore: 0.22 },
    { hour: '13:00', tasksScheduled: 4, utilization: 0.57, pickRate: 158, riskScore: 0.28 },
    { hour: '14:00', tasksScheduled: 4, utilization: 0.67, pickRate: 166, riskScore: 0.22 },
    { hour: '15:00', tasksScheduled: 4, utilization: 0.52, pickRate: 148, riskScore: 0.28 },
    { hour: '16:00', tasksScheduled: 4, utilization: 0.60, pickRate: 153, riskScore: 0.22 },
    { hour: '17:00', tasksScheduled: 4, utilization: 0.62, pickRate: 145, riskScore: 0.18 },
  ];

  // Machine vs Robotics utilization comparison
  const utilizationComparison = [
    { system: 'Machines', baseline: 0.72, optimized: 0.84, improvement: 17 },
    { system: 'Robotics', baseline: 0.68, optimized: 0.87, improvement: 28 },
  ];


  const scheduleColumns = [
    { key: 'jobId', header: 'Job ID', sortable: true },
    { key: 'machineId', header: 'Machine/Robot', sortable: true },
    {
      key: 'startTs',
      header: 'Start Time',
      sortable: true,
      render: (item: ScheduleItem) => (
        <span className="font-mono text-sm">{new Date(item.startTs).toLocaleString()}</span>
      ),
    },
    {
      key: 'endTs',
      header: 'End Time',
      render: (item: ScheduleItem) => (
        <span className="font-mono text-sm">{new Date(item.endTs).toLocaleString()}</span>
      ),
    },
    {
      key: 'frozen',
      header: 'Status',
      render: (item: ScheduleItem) => (
        <Badge variant={item.frozen ? 'default' : 'outline'}>
          {item.frozen ? '🔒 Locked' : 'Flexible'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Production Schedule</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Optimize job scheduling for machines and robotics with AI-powered planning
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How the Schedule Page Works</AlertTitle>
        <AlertDescription>
          This page optimizes production scheduling for both <strong>machines</strong> (135 bottles/hour each) and <strong>robotics</strong> (980 bottles/hour total).
          <br />
          <br />
          <strong>Baseline Schedule:</strong> Simple first-come-first-served approach based on due dates. This is the traditional scheduling method.
          <br />
          <br />
          <strong>AI-Optimized Schedule:</strong> Smart scheduling that:
          <br />
          • Considers machine failure risk to avoid scheduling critical jobs on high-risk machines
          <br />
          • Reduces setup changes by grouping similar jobs together
          <br />
          • Improves on-time delivery by prioritizing urgent jobs
          <br />
          • Optimizes utilization for both machines and robotics
          <br />
          <br />
          <strong>Charts show:</strong> Hourly job distribution, utilization rates, and completion timelines for both systems. Use the buttons above to generate and compare schedules!
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => runScheduleMutation.mutate('baseline')}
          disabled={runScheduleMutation.isPending}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Generate Baseline
        </Button>
        <Button
          size="sm"
          onClick={() => runScheduleMutation.mutate('risk_aware')}
          disabled={runScheduleMutation.isPending}
        >
          <Play className="w-4 h-4 mr-2" />
          Generate AI-Optimized
        </Button>
      </div>

      {/* KPIs */}
      <KPIGrid>
        <KPIChip
          label="On-Time Delivery"
          value={`${(kpis.onTimeRate * 100).toFixed(0)}%`}
          icon={<Target className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Machine Utilization"
          value={`${(kpis.utilization * 100).toFixed(0)}%`}
          icon={<Wrench className="w-5 h-5" />}
        />
        <KPIChip
          label="Robotics Utilization"
          value="87%"
          icon={<Bot className="w-5 h-5" />}
        />
        <KPIChip
          label="Setup Changes"
          value={kpis.changeovers}
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <KPIChip
          label="Total Time"
          value={`${Math.round(kpis.makespan / 60)} hours`}
          icon={<Clock className="w-5 h-5" />}
        />
        <KPIChip
          label="Risk Cost"
          value={`${(kpis.riskCost * 100).toFixed(0)}%`}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={kpis.riskCost > 0.3 ? 'warning' : 'default'}
        />
      </KPIGrid>

      {/* Comparison Chart */}
      {comparison && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Schedule Comparison: Baseline vs AI-Optimized</CardTitle>
            <CardDescription>Performance improvements across machines and robotics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {utilizationComparison.map((item, i) => (
                <div key={item.system} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.system === 'Machines' ? (
                        <Wrench className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-sm font-medium">{item.system} Utilization</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-green-400">
                      +{item.improvement}% improvement
                    </Badge>
                  </div>
                  <div className="h-8 bg-muted/20 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                      <div className="flex-1 h-full flex items-center">
                        <div 
                          className="h-full bg-yellow-500/60 flex items-center justify-end pr-2"
                          style={{ width: `${item.baseline * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">{(item.baseline * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="w-px h-full bg-border"></div>
                      <div className="flex-1 h-full flex items-center">
                        <div 
                          className={`h-full flex items-center justify-end pr-2 ${
                            item.system === 'Machines' ? 'bg-blue-500/80' : 'bg-purple-500/80'
                          }`}
                          style={{ width: `${item.optimized * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">{(item.optimized * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Baseline</span>
                    <span>AI-Optimized</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Machines Schedule Chart */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            Machines Schedule - Hourly Overview
          </CardTitle>
          <CardDescription>Jobs scheduled, utilization, and risk scores by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              
              <div className="ml-12 h-full relative">
                <div className="absolute inset-0 flex items-end justify-between gap-1 px-2 pb-4">
                  {machineScheduleData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full relative" style={{ height: '200px' }}>
                        {/* Utilization bar */}
                        <div 
                          className="absolute bottom-0 w-full bg-blue-500/80 rounded-t"
                          style={{ height: `${d.utilization * 100}%` }}
                        />
                        {/* Risk overlay */}
                        <div 
                          className="absolute bottom-0 w-full bg-red-500/40 rounded-t"
                          style={{ height: `${d.riskScore * 100}%` }}
                        />
                        {/* Value labels */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-center whitespace-nowrap">
                          <div className="text-blue-400">{d.jobsScheduled} jobs</div>
                          <div className="text-xs text-muted-foreground">{(d.utilization * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{d.hour}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/80 rounded"></div>
              <span>Utilization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/40 rounded"></div>
              <span>Risk Score</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Completion Rate */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-primary" />
            Job Completion Rate
          </CardTitle>
          <CardDescription className="text-sm">On-time completion percentage by hour</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[400px] relative">
            <div className="absolute inset-0 flex flex-col">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-sm text-muted-foreground pr-3 w-12">
                <span className="font-medium">100%</span>
                <span className="font-medium">90%</span>
                <span className="font-medium">80%</span>
                <span className="font-medium">70%</span>
                <span className="font-medium">60%</span>
                <span className="font-medium">50%</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-14 mr-4 h-full relative">
                {/* Target line */}
                <div 
                  className="absolute left-0 right-0 border-t border-dashed border-green-400/50 z-10"
                  style={{ bottom: `${(kpis.onTimeRate * 100)}%` }}
                />
                
                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between gap-2 pb-10">
                  {hours.map((hour, i) => {
                    // On-time rate varies slightly but averages to kpis.onTimeRate
                    const onTimeRate = (kpis.onTimeRate * 100) + (i % 3) - 1; // 91-93% range around 92%
                    const height = Math.max(50, Math.min(100, onTimeRate));
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center h-full">
                        <div className="mb-2 text-sm font-semibold">{height.toFixed(0)}%</div>
                        <div className="flex-1 w-full flex items-end min-h-[200px]">
                          <motion.div 
                            className={`w-full rounded-t ${
                              height >= 90 ? 'bg-green-500' : 
                              height >= 80 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            style={{ minHeight: '2px' }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{hour}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{(kpis.onTimeRate * 100).toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground mt-1">Overall On-Time Rate</div>
              </div>
              <div className="h-12 w-px bg-border"></div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-400">Target: 90%+</div>
                <div className="text-xs text-muted-foreground mt-1">Performance Goal</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
