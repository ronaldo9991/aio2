import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  CheckSquare, 
  TrendingUp, 
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { RiskBadge, getRiskLevel } from '@/components/RiskBadge';
import { DataTable } from '@/components/DataTable';
import { PageSkeleton } from '@/components/Skeleton';

interface DashboardStats {
  totalJobs: number;
  pendingApprovals: number;
  activeAlerts: number;
  machineUtilization: number;
  onTimeRate: number;
  avgRiskScore: number;
}

interface RecentAlert {
  id: string;
  ts: string;
  severity: string;
  type: string;
  message: string;
  entityType: string;
  entityId: string;
}

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery<RecentAlert[]>({
    queryKey: ['/api/alerts', 'recent'],
  });

  if (statsLoading) {
    return <PageSkeleton />;
  }

  const dashboardStats = stats || {
    totalJobs: 47,
    pendingApprovals: 3,
    activeAlerts: 5,
    machineUtilization: 0.84,
    onTimeRate: 0.92,
    avgRiskScore: 0.18,
  };

  const recentAlerts = alerts || [
    { id: '1', ts: new Date().toISOString(), severity: 'WARNING', type: 'MACHINE_HEALTH', message: 'Elevated vibration on Machine M-003', entityType: 'machine', entityId: 'M-003' },
    { id: '2', ts: new Date().toISOString(), severity: 'INFO', type: 'QUALITY', message: 'SPC limit warning for wall thickness', entityType: 'machine', entityId: 'M-001' },
    { id: '3', ts: new Date().toISOString(), severity: 'CRITICAL', type: 'SCHEDULE', message: 'Job J-015 at risk of missing due date', entityType: 'job', entityId: 'J-015' },
  ];

  const alertColumns = [
    {
      key: 'severity',
      header: 'Severity',
      render: (alert: RecentAlert) => {
        const colors: Record<string, string> = {
          CRITICAL: 'text-red-400 bg-red-500/10',
          WARNING: 'text-yellow-400 bg-yellow-500/10',
          INFO: 'text-blue-400 bg-blue-500/10',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[alert.severity] || colors.INFO}`}>
            {alert.severity}
          </span>
        );
      },
    },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'message', header: 'Message' },
    { key: 'entityId', header: 'Entity' },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Operations overview and key metrics</p>
      </motion.div>

      <KPIGrid>
        <KPIChip
          label="Active Jobs"
          value={dashboardStats.totalJobs}
          icon={<Calendar className="w-5 h-5" />}
          trend="up"
          trendValue="+4"
        />
        <KPIChip
          label="Pending Approvals"
          value={dashboardStats.pendingApprovals}
          icon={<CheckSquare className="w-5 h-5" />}
          variant={dashboardStats.pendingApprovals > 0 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Active Alerts"
          value={dashboardStats.activeAlerts}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={dashboardStats.activeAlerts > 3 ? 'danger' : 'default'}
        />
        <KPIChip
          label="Machine Utilization"
          value={`${(dashboardStats.machineUtilization * 100).toFixed(0)}%`}
          icon={<Wrench className="w-5 h-5" />}
          trend="up"
          trendValue="+2%"
        />
        <KPIChip
          label="On-Time Rate"
          value={`${(dashboardStats.onTimeRate * 100).toFixed(0)}%`}
          icon={<Clock className="w-5 h-5" />}
          variant="success"
          trend="up"
          trendValue="+1.5%"
        />
      </KPIGrid>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Schedule Overview</CardTitle>
              <CardDescription>Current week job distribution</CardDescription>
            </div>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => {
                const utilization = [0.85, 0.92, 0.78, 0.88, 0.75][i];
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24">{day}</span>
                    <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${utilization * 100}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-mono w-12 text-right">{(utilization * 100).toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
              <CardDescription>Machine health status</CardDescription>
            </div>
            <Zap className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { name: 'M-001', risk: 0.12 },
                { name: 'M-002', risk: 0.28 },
                { name: 'M-003', risk: 0.65 },
                { name: 'M-004', risk: 0.08 },
                { name: 'M-005', risk: 0.42 },
                { name: 'M-006', risk: 0.15 },
              ].map((machine) => (
                <div key={machine.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <span className="text-sm font-medium">{machine.name}</span>
                  <RiskBadge level={getRiskLevel(machine.risk)} value={machine.risk} size="sm" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Recent Alerts</CardTitle>
            <CardDescription>Latest system notifications</CardDescription>
          </div>
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={recentAlerts}
            columns={alertColumns}
            emptyMessage="No recent alerts"
          />
        </CardContent>
      </Card>
    </div>
  );
}
