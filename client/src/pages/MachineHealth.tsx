import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Wrench, 
  Activity, 
  Thermometer, 
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { RiskBadge, getRiskLevel } from '@/components/RiskBadge';
import { DataTable } from '@/components/DataTable';
import { PageSkeleton } from '@/components/Skeleton';

interface Machine {
  id: string;
  name: string;
  type: string;
  status: string;
  failureRisk: number;
  temperature: number;
  vibration: number;
  lastMaintenance: string;
}

export function MachineHealth() {
  const { data: machines, isLoading } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockMachines: Machine[] = machines || [
    { id: 'M-001', name: 'Blow Molder A', type: 'blow_mold', status: 'operational', failureRisk: 0.12, temperature: 185, vibration: 2.3, lastMaintenance: '2025-01-10' },
    { id: 'M-002', name: 'Blow Molder B', type: 'blow_mold', status: 'operational', failureRisk: 0.28, temperature: 192, vibration: 3.1, lastMaintenance: '2025-01-08' },
    { id: 'M-003', name: 'Injection Molder 1', type: 'injection', status: 'warning', failureRisk: 0.65, temperature: 210, vibration: 5.8, lastMaintenance: '2025-01-05' },
    { id: 'M-004', name: 'Blow Molder C', type: 'blow_mold', status: 'operational', failureRisk: 0.08, temperature: 180, vibration: 1.9, lastMaintenance: '2025-01-12' },
    { id: 'M-005', name: 'Preform Line', type: 'preform', status: 'maintenance', failureRisk: 0.42, temperature: 0, vibration: 0, lastMaintenance: '2025-01-14' },
    { id: 'M-006', name: 'Packing Station', type: 'packing', status: 'operational', failureRisk: 0.15, temperature: 25, vibration: 0.8, lastMaintenance: '2025-01-11' },
  ];

  const avgRisk = mockMachines.reduce((acc, m) => acc + m.failureRisk, 0) / mockMachines.length;
  const operationalCount = mockMachines.filter(m => m.status === 'operational').length;
  const warningCount = mockMachines.filter(m => m.status === 'warning').length;

  const machineColumns = [
    { 
      key: 'id', 
      header: 'Machine ID', 
      sortable: true,
      render: (m: Machine) => <span className="font-mono text-sm">{m.id}</span>
    },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (m: Machine) => {
        const statusColors: Record<string, string> = {
          operational: 'bg-green-500/10 text-green-400',
          warning: 'bg-yellow-500/10 text-yellow-400',
          maintenance: 'bg-blue-500/10 text-blue-400',
          offline: 'bg-red-500/10 text-red-400',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[m.status] || statusColors.operational}`}>
            {m.status}
          </span>
        );
      },
    },
    {
      key: 'failureRisk',
      header: '72h Failure Risk',
      sortable: true,
      render: (m: Machine) => <RiskBadge level={getRiskLevel(m.failureRisk)} value={m.failureRisk} size="sm" />,
    },
    {
      key: 'temperature',
      header: 'Temp (°C)',
      sortable: true,
      render: (m: Machine) => (
        <div className="flex items-center gap-1">
          <Thermometer className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-sm">{m.temperature}</span>
        </div>
      ),
    },
    {
      key: 'vibration',
      header: 'Vibration (mm/s)',
      sortable: true,
      render: (m: Machine) => (
        <div className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-mono text-sm">{m.vibration.toFixed(1)}</span>
        </div>
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
        <h1 className="text-2xl font-bold mb-1">Machine Health</h1>
        <p className="text-sm text-muted-foreground">Predictive maintenance and equipment monitoring</p>
      </motion.div>

      <KPIGrid>
        <KPIChip
          label="Total Machines"
          value={mockMachines.length}
          icon={<Wrench className="w-5 h-5" />}
        />
        <KPIChip
          label="Operational"
          value={operationalCount}
          icon={<Zap className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Warnings"
          value={warningCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={warningCount > 0 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Avg Risk Score"
          value={`${(avgRisk * 100).toFixed(0)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          variant={avgRisk > 0.3 ? 'warning' : 'default'}
        />
      </KPIGrid>

      <div className="grid lg:grid-cols-3 gap-6">
        {mockMachines.slice(0, 3).map((machine, index) => (
          <motion.div
            key={machine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 hover-elevate">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{machine.name}</CardTitle>
                  <RiskBadge level={getRiskLevel(machine.failureRisk)} value={machine.failureRisk} size="sm" />
                </div>
                <CardDescription className="font-mono text-xs">{machine.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" /> Temperature
                    </span>
                    <span className="font-mono">{machine.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> Vibration
                    </span>
                    <span className="font-mono">{machine.vibration} mm/s</span>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">72h Failure Probability</div>
                    <div className="mt-2 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          machine.failureRisk > 0.5 ? 'bg-red-500' : 
                          machine.failureRisk > 0.25 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${machine.failureRisk * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">All Machines</CardTitle>
            <CardDescription>Complete equipment inventory and health status</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={mockMachines}
            columns={machineColumns}
            emptyMessage="No machines found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
