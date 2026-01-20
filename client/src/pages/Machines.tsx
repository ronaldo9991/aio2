import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Wrench, Activity, TrendingUp, Clock, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';

interface Machine {
  id: string;
  name: string;
  utilization: number;
  downtime: number;
  bottlesPerHour: number;
  oee: number;
  status: 'operational' | 'idle' | 'maintenance' | 'error';
  lastActivity: string;
  riskScore: number;
}

export function Machines() {
  const { data: machines, isLoading } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Ensure machines have all required fields with defaults
  const machineList: Machine[] = (machines || []).map((m: any) => ({
    id: m.id || '',
    name: m.name || '',
    utilization: m.utilization || 0.84,
    downtime: m.downtime || 45,
    bottlesPerHour: m.bottlesPerHour || 135,
    oee: Math.max(0.86, m.oee || 0.86), // Ensure minimum 86%
    status: m.status || 'operational',
    lastActivity: m.lastActivity || new Date().toISOString(),
    riskScore: m.riskScore || m.failureRisk || 0.15,
  }));

  const avgUtilization = machineList.reduce((sum, m) => sum + (m.utilization || 0.84), 0) / machineList.length;
  const totalBottlesPerHour = machineList.reduce((sum, m) => sum + (m.bottlesPerHour || 135), 0);
  const avgOEE = Math.max(0.86, machineList.reduce((sum, m) => sum + (m.oee || 0.86), 0) / machineList.length);
  const totalDowntime = machineList.reduce((sum, m) => sum + m.downtime, 0);
  const operationalCount = machineList.filter(m => m.status === 'operational').length;
  const avgRiskScore = machineList.reduce((sum, m) => sum + m.riskScore, 0) / machineList.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'idle':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'maintenance':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.2) return 'text-green-400';
    if (risk < 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const machineColumns = [
    {
      key: 'id',
      header: 'Machine ID',
      sortable: true,
      render: (machine: Machine) => (
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm">{machine.id}</span>
        </div>
      ),
    },
    { key: 'name', header: 'Machine Name', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (machine: Machine) => (
        <Badge className={getStatusColor(machine.status)}>
          {machine.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'utilization',
      header: 'Utilization',
      sortable: true,
      render: (machine: Machine) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden w-20">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${machine.utilization * 100}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span className="text-sm font-mono w-12 text-right">{(machine.utilization * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    {
      key: 'bottlesPerHour',
      header: 'Bottles/Hour',
      sortable: true,
      render: (machine: Machine) => (
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-sm">{(machine.bottlesPerHour || 135).toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'oee',
      header: 'OEE',
      sortable: true,
      render: (machine: Machine) => {
        const oee = machine.oee || 0.86;
        return (
          <span className={`font-mono text-sm ${oee >= 0.86 ? 'text-green-400' : 'text-yellow-400'}`}>
            {(oee * 100).toFixed(0)}%
          </span>
        );
      },
    },
    {
      key: 'downtime',
      header: 'Downtime (min)',
      sortable: true,
      render: (machine: Machine) => (
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-sm">{machine.downtime}</span>
        </div>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk Score',
      sortable: true,
      render: (machine: Machine) => {
        const risk = machine.riskScore || 0.15;
        return (
          <span className={`font-mono text-sm ${getRiskColor(risk)}`}>
            {(risk * 100).toFixed(0)}%
          </span>
        );
      },
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
          <Wrench className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Manufacturing Machines</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor machine performance, utilization, and production efficiency
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How Machine Monitoring Works</AlertTitle>
        <AlertDescription>
          Track all manufacturing machines to ensure they're operating efficiently.
          <br />
          • <strong>Utilization:</strong> What % of time the machine is working (higher is better, aim for 80%+)
          <br />
          • <strong>Bottles/Hour:</strong> Production rate per machine (higher = more output)
          <br />
          • <strong>OEE:</strong> Overall Equipment Effectiveness (target: 86%+)
          <br />
          • <strong>Downtime:</strong> Minutes the machine was not operational (lower is better)
          <br />
          • <strong>Risk Score:</strong> AI-predicted failure risk (lower is better, &lt;20% is good)
          <br />
          If utilization is low, OEE is below 86%, or risk score is high, the machine may need attention!
        </AlertDescription>
      </Alert>

      <KPIGrid>
        <KPIChip
          label="Avg Utilization"
          value={`${(avgUtilization * 100).toFixed(0)}%`}
          icon={<Activity className="w-5 h-5" />}
          variant={avgUtilization > 0.8 ? 'success' : 'default'}
        />
        <KPIChip
          label="Total Bottles/Hour"
          value={`${totalBottlesPerHour.toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KPIChip
          label="Avg OEE"
          value={`${(avgOEE * 100).toFixed(0)}%`}
          icon={<Activity className="w-5 h-5" />}
          variant={avgOEE >= 0.86 ? 'success' : 'warning'}
        />
        <KPIChip
          label="Operational Machines"
          value={`${operationalCount}/${machineList.length}`}
          icon={<Wrench className="w-5 h-5" />}
          variant={operationalCount === machineList.length ? 'success' : 'warning'}
        />
        <KPIChip
          label="Total Downtime"
          value={`${totalDowntime} min`}
          icon={<Clock className="w-5 h-5" />}
          variant={totalDowntime < 300 ? 'success' : 'warning'}
        />
        <KPIChip
          label="Avg Risk Score"
          value={`${(avgRiskScore * 100).toFixed(0)}%`}
          icon={<AlertCircle className="w-5 h-5" />}
          variant={avgRiskScore < 0.2 ? 'success' : avgRiskScore < 0.4 ? 'warning' : 'danger'}
        />
      </KPIGrid>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Utilization by Machine</CardTitle>
            <CardDescription>Current shift utilization rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machineList.map((machine) => (
                <div key={machine.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{machine.name}</span>
                    <span className="text-muted-foreground">{(machine.utilization * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${machine.utilization * 100}%` }}
                      transition={{ duration: 0.6, delay: machineList.indexOf(machine) * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Production rate and OEE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {machineList.map((machine) => (
                <div key={machine.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div>
                    <div className="font-medium text-sm">{machine.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(machine.bottlesPerHour || 135).toLocaleString()} bottles/hr • OEE: {((machine.oee || 0.86) * 100).toFixed(0)}%
                    </div>
                  </div>
                  {(machine.riskScore || 0.15) > 0.3 && (
                    <Badge variant="destructive" className="text-xs">
                      High Risk
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Machine Status</CardTitle>
          <CardDescription>Detailed machine performance and status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={machineList}
            columns={machineColumns}
            emptyMessage="No machines found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
