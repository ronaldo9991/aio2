import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Calendar, 
  Play, 
  RotateCcw, 
  Filter,
  Clock,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { RiskBadge, getRiskLevel } from '@/components/RiskBadge';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import type { ScheduleKPIs } from '@shared/schema';

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
  kpiJson: ScheduleKPIs;
  items: ScheduleItem[];
}

export function Schedule() {
  const [activeMode, setActiveMode] = useState<'baseline' | 'risk_aware'>('risk_aware');
  const { toast } = useToast();

  const { data: schedule, isLoading } = useQuery<Schedule>({
    queryKey: ['/api/schedule/latest', activeMode],
  });

  const runScheduleMutation = useMutation({
    mutationFn: async (mode: 'baseline' | 'risk_aware') => {
      return apiRequest('POST', `/schedule/run?mode=${mode}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/latest'] });
      toast({
        title: 'Schedule Generated',
        description: 'New schedule has been computed successfully.',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate schedule.',
      });
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockKPIs: ScheduleKPIs = schedule?.kpiJson || {
    makespan: 2880,
    totalLateness: 120,
    onTimeRate: 0.92,
    changeovers: 8,
    utilization: 0.84,
    riskCost: 0.15,
    stability: 0.88,
  };

  const mockItems: ScheduleItem[] = schedule?.items || [
    { id: '1', machineId: 'M-001', jobId: 'J-001', startTs: '2025-01-15T08:00:00Z', endTs: '2025-01-15T10:30:00Z', frozen: true, riskScore: 0.12 },
    { id: '2', machineId: 'M-001', jobId: 'J-002', startTs: '2025-01-15T10:30:00Z', endTs: '2025-01-15T12:00:00Z', frozen: false, riskScore: 0.08 },
    { id: '3', machineId: 'M-002', jobId: 'J-003', startTs: '2025-01-15T08:00:00Z', endTs: '2025-01-15T11:00:00Z', frozen: true, riskScore: 0.32 },
    { id: '4', machineId: 'M-002', jobId: 'J-004', startTs: '2025-01-15T11:00:00Z', endTs: '2025-01-15T14:00:00Z', frozen: false, riskScore: 0.18 },
    { id: '5', machineId: 'M-003', jobId: 'J-005', startTs: '2025-01-15T08:00:00Z', endTs: '2025-01-15T09:30:00Z', frozen: true, riskScore: 0.55 },
  ];

  const scheduleColumns = [
    { key: 'jobId', header: 'Job ID', sortable: true },
    { key: 'machineId', header: 'Machine', sortable: true },
    {
      key: 'startTs',
      header: 'Start Time',
      sortable: true,
      render: (item: ScheduleItem) => new Date(item.startTs).toLocaleTimeString(),
    },
    {
      key: 'endTs',
      header: 'End Time',
      render: (item: ScheduleItem) => new Date(item.endTs).toLocaleTimeString(),
    },
    {
      key: 'frozen',
      header: 'Status',
      render: (item: ScheduleItem) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          item.frozen ? 'bg-blue-500/10 text-blue-400' : 'bg-muted text-muted-foreground'
        }`}>
          {item.frozen ? 'Frozen' : 'Flexible'}
        </span>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk',
      render: (item: ScheduleItem) => (
        item.riskScore !== undefined 
          ? <RiskBadge level={getRiskLevel(item.riskScore)} value={item.riskScore} size="sm" />
          : '-'
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-1">Schedule</h1>
          <p className="text-sm text-muted-foreground">Production scheduling and optimization</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => runScheduleMutation.mutate('baseline')}
            disabled={runScheduleMutation.isPending}
            data-testid="button-run-baseline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Run Baseline
          </Button>
          <Button
            size="sm"
            onClick={() => runScheduleMutation.mutate('risk_aware')}
            disabled={runScheduleMutation.isPending}
            className="ocean-glow-sm"
            data-testid="button-run-risk-aware"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Risk-Aware
          </Button>
        </div>
      </div>

      <KPIGrid>
        <KPIChip
          label="On-Time Rate"
          value={`${(mockKPIs.onTimeRate * 100).toFixed(0)}%`}
          icon={<Target className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Utilization"
          value={`${(mockKPIs.utilization * 100).toFixed(0)}%`}
          icon={<Zap className="w-5 h-5" />}
        />
        <KPIChip
          label="Changeovers"
          value={mockKPIs.changeovers}
          icon={<RotateCcw className="w-5 h-5" />}
        />
        <KPIChip
          label="Risk Cost"
          value={`${(mockKPIs.riskCost * 100).toFixed(0)}%`}
          icon={<Clock className="w-5 h-5" />}
          variant={mockKPIs.riskCost > 0.3 ? 'warning' : 'default'}
        />
      </KPIGrid>

      <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as 'baseline' | 'risk_aware')}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="baseline" data-testid="tab-baseline">Baseline</TabsTrigger>
          <TabsTrigger value="risk_aware" data-testid="tab-risk-aware">Risk-Aware</TabsTrigger>
        </TabsList>

        <TabsContent value={activeMode} className="mt-6 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Gantt View</CardTitle>
                <CardDescription>Visual schedule timeline</CardDescription>
              </div>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-4 space-y-3">
                {['M-001', 'M-002', 'M-003'].map((machineId, i) => {
                  const machineItems = mockItems.filter(item => item.machineId === machineId);
                  return (
                    <div key={machineId} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-muted-foreground w-16">{machineId}</span>
                      <div className="flex-1 h-10 bg-muted/20 rounded-lg relative overflow-hidden">
                        {machineItems.map((item, j) => {
                          const start = 10 + j * 25;
                          const width = 20 + Math.random() * 10;
                          return (
                            <motion.div
                              key={item.id}
                              className={`absolute top-1 bottom-1 rounded-md flex items-center justify-center text-xs font-medium ${
                                item.frozen ? 'bg-primary/80' : 'bg-primary/50'
                              }`}
                              style={{ left: `${start}%`, width: `${width}%` }}
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{ scaleX: 1, opacity: 1 }}
                              transition={{ duration: 0.4, delay: i * 0.1 + j * 0.05 }}
                            >
                              {item.jobId}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground w-16">Time</span>
                  <div className="flex-1 flex justify-between text-xs text-muted-foreground">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>16:00</span>
                    <span>18:00</span>
                    <span>20:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Schedule Items</CardTitle>
                <CardDescription>Detailed job assignments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                data={mockItems}
                columns={scheduleColumns}
                emptyMessage="No schedule items"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
