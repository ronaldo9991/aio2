import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Wrench, 
  Activity, 
  Thermometer, 
  Zap,
  TrendingUp,
  AlertTriangle,
  Info,
  Bot,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

interface Robot {
  id: string;
  name: string;
  status: string;
  utilization: number;
  pickRate: number;
  errorCount: number;
  idleTime: number;
  healthScore: number;
  riskScore: number; // Failure risk score (0-1)
}

export function MachineHealth() {
  const { data: machines, isLoading: machinesLoading } = useQuery<Machine[]>({
    queryKey: ['/api/machines'],
  });

  const { data: robots, isLoading: robotsLoading } = useQuery<Robot[]>({
    queryKey: ['/api/robotics'],
  });

  if (machinesLoading || robotsLoading) {
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

  const mockRobots: Robot[] = (robots || []).map((r: any) => ({
    ...r,
    riskScore: r.riskScore || (1 - (r.healthScore || 0.85)), // Convert health score to risk (inverse)
  })) || [
    { id: 'R-001', name: 'Palletizing Robot A', status: 'operational', utilization: 0.87, pickRate: 145, errorCount: 0, idleTime: 62, healthScore: 0.92, riskScore: 0.08 },
    { id: 'R-002', name: 'Palletizing Robot B', status: 'operational', utilization: 0.82, pickRate: 138, errorCount: 1, idleTime: 86, healthScore: 0.88, riskScore: 0.12 },
    { id: 'R-003', name: 'Packaging Robot 1', status: 'operational', utilization: 0.91, pickRate: 165, errorCount: 0, idleTime: 43, healthScore: 0.95, riskScore: 0.05 },
    { id: 'R-004', name: 'Packaging Robot 2', status: 'operational', utilization: 0.75, pickRate: 125, errorCount: 2, idleTime: 120, healthScore: 0.78, riskScore: 0.22 },
    { id: 'R-005', name: 'Quality Inspection Bot', status: 'idle', utilization: 0.68, pickRate: 95, errorCount: 0, idleTime: 153, healthScore: 0.85, riskScore: 0.15 },
  ];

  const avgMachineRisk = mockMachines.reduce((acc, m) => acc + m.failureRisk, 0) / mockMachines.length;
  const operationalMachines = mockMachines.filter(m => m.status === 'operational').length;
  const warningMachines = mockMachines.filter(m => m.status === 'warning').length;

  const avgRobotHealth = mockRobots.reduce((acc, r) => acc + r.healthScore, 0) / mockRobots.length;
  const operationalRobots = mockRobots.filter(r => r.status === 'operational').length;
  const totalErrors = mockRobots.reduce((acc, r) => acc + r.errorCount, 0);

  // Generate failure risk timeline for machines
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const machineRiskTimeline = hours.map((hour, i) => ({
    hour,
    avgRisk: Math.max(0.10, Math.min(0.70, avgMachineRisk + Math.sin((Date.now() / 200000) + i) * 0.15 + (Math.random() * 0.1 - 0.05))),
    highRisk: mockMachines.filter(m => m.failureRisk > 0.5).length,
  }));

  // Generate health score timeline for robotics
  const robotHealthTimeline = hours.map((hour, i) => ({
    hour,
    avgHealth: Math.max(0.75, Math.min(0.98, avgRobotHealth + Math.sin((Date.now() / 180000) + i) * 0.08 + (Math.random() * 0.05 - 0.025))),
    operational: operationalRobots,
  }));

  // Temperature and vibration distribution
  const tempDistribution = mockMachines.map(m => ({
    machine: m.id,
    temperature: m.temperature,
    vibration: m.vibration,
    risk: m.failureRisk,
  }));

  // Utilization comparison
  const utilizationData = [
    { system: 'Machines', avgUtilization: 0.82, operational: operationalMachines, total: mockMachines.length },
    { system: 'Robotics', avgUtilization: 0.81, operational: operationalRobots, total: mockRobots.length },
  ];

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

  const robotColumns = [
    { 
      key: 'id', 
      header: 'Robot ID', 
      sortable: true,
      render: (r: Robot) => <span className="font-mono text-sm">{r.id}</span>
    },
    { key: 'name', header: 'Name', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (r: Robot) => {
        const statusColors: Record<string, string> = {
          operational: 'bg-green-500/10 text-green-400',
          idle: 'bg-yellow-500/10 text-yellow-400',
          error: 'bg-red-500/10 text-red-400',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[r.status] || statusColors.operational}`}>
            {r.status}
          </span>
        );
      },
    },
    {
      key: 'healthScore',
      header: 'Health Score',
      sortable: true,
      render: (r: Robot) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                r.healthScore > 0.9 ? 'bg-green-500' : 
                r.healthScore > 0.75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${r.healthScore * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono">{(r.healthScore * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    {
      key: 'riskScore',
      header: '72h Failure Risk',
      sortable: true,
      render: (r: Robot) => <RiskBadge level={getRiskLevel(r.riskScore)} value={r.riskScore} size="sm" />,
    },
    {
      key: 'utilization',
      header: 'Utilization',
      sortable: true,
      render: (r: Robot) => <span className="font-mono text-sm">{(r.utilization * 100).toFixed(0)}%</span>,
    },
    {
      key: 'pickRate',
      header: 'Pick Rate',
      sortable: true,
      render: (r: Robot) => <span className="font-mono text-sm">{r.pickRate} units/hr</span>,
    },
    {
      key: 'errorCount',
      header: 'Errors',
      sortable: true,
      render: (r: Robot) => (
        <span className={r.errorCount > 0 ? 'text-red-400 font-medium' : 'text-muted-foreground'}>
          {r.errorCount}
        </span>
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
          <h1 className="text-2xl font-bold">Machine & Robotics Health</h1>
        </div>
        <p className="text-sm text-muted-foreground">Predictive maintenance and equipment monitoring for machines and robotics</p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How Health Monitoring Works</AlertTitle>
        <AlertDescription>
          AI monitors every machine and robot 24/7 using sensors to predict failures before they happen.
          <br />
          • <strong>Machines:</strong> Failure risk (0-100%), temperature, vibration monitoring
          <br />
          • <strong>Robotics:</strong> Health score (0-100%), failure risk (0-100%), utilization, pick rate, error tracking
          <br />
          • <strong>Status Colors:</strong> Green = Good, Yellow = Warning, Red = Critical
          <br />
          Equipment with high risk scores or low health scores should be scheduled for maintenance soon!
        </AlertDescription>
      </Alert>

      <KPIGrid>
        <KPIChip
          label="Total Machines"
          value={mockMachines.length}
          icon={<Wrench className="w-5 h-5" />}
        />
        <KPIChip
          label="Operational Machines"
          value={operationalMachines}
          icon={<Zap className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Machine Risk Score"
          value={`${(avgMachineRisk * 100).toFixed(0)}%`}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={avgMachineRisk > 0.3 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Total Robots"
          value={mockRobots.length}
          icon={<Bot className="w-5 h-5" />}
        />
        <KPIChip
          label="Operational Robots"
          value={operationalRobots}
          icon={<Zap className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Robot Health Score"
          value={`${(avgRobotHealth * 100).toFixed(0)}%`}
          icon={<Activity className="w-5 h-5" />}
          variant={avgRobotHealth > 0.85 ? 'success' : avgRobotHealth > 0.75 ? 'default' : 'warning'}
        />
      </KPIGrid>

      {/* Utilization Comparison */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Utilization Comparison</CardTitle>
          <CardDescription>Average utilization: Machines vs Robotics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {utilizationData.map((item, i) => (
              <div key={item.system} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.system === 'Machines' ? (
                      <Wrench className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="font-medium">{item.system}</span>
                    <span className="text-sm text-muted-foreground">
                      ({item.operational}/{item.total} operational)
                    </span>
                  </div>
                  <span className="font-mono text-lg font-bold">{(item.avgUtilization * 100).toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      item.system === 'Machines' ? 'bg-blue-500/80' : 'bg-purple-500/80'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.avgUtilization * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Machine Failure Risk Timeline */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            Machine Failure Risk Timeline
          </CardTitle>
          <CardDescription>Average failure risk and high-risk machine count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                <span>70%</span>
                <span>50%</span>
                <span>30%</span>
                <span>20%</span>
                <span>10%</span>
              </div>
              
              <div className="ml-12 h-full relative">
                {/* Risk zones */}
                <div className="absolute top-[60%] left-0 right-0 h-[30%] bg-yellow-500/10 border-t border-b border-yellow-500/20"></div>
                <div className="absolute top-[40%] left-0 right-0 h-px bg-red-500/30"></div>
                
                {/* Line chart */}
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="hsl(199, 89%, 48%)"
                    strokeWidth="2"
                    points={machineRiskTimeline.map((d, i) => {
                      const x = (i / (machineRiskTimeline.length - 1)) * 100;
                      const y = 100 - ((d.avgRisk / 0.7) * 100);
                      return `${x}%,${y}%`;
                    }).join(' ')}
                  />
                  {machineRiskTimeline.map((d, i) => {
                    const x = (i / (machineRiskTimeline.length - 1)) * 100;
                    const y = 100 - ((d.avgRisk / 0.7) * 100);
                    return (
                      <circle
                        key={i}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="4"
                        fill="hsl(199, 89%, 48%)"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 pl-12">
            {machineRiskTimeline.map((d, i) => (
              <span key={i}>{d.hour}</span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">High-Risk Machines (Risk &gt;50%)</span>
              <span className="font-bold text-red-400">{machineRiskTimeline[machineRiskTimeline.length - 1]?.highRisk || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Robotics Health Timeline */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            Robotics Health Score Timeline
          </CardTitle>
          <CardDescription>Average health score and operational robots over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                <span>100%</span>
                <span>90%</span>
                <span>80%</span>
                <span>75%</span>
              </div>
              
              <div className="ml-12 h-full relative">
                {/* Health zones */}
                <div className="absolute top-[20%] left-0 right-0 h-[60%] bg-green-500/10 border-t border-b border-green-500/20"></div>
                <div className="absolute top-[25%] left-0 right-0 h-px bg-yellow-500/30"></div>
                
                {/* Line chart */}
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="hsl(280, 70%, 60%)"
                    strokeWidth="2"
                    points={robotHealthTimeline.map((d, i) => {
                      const x = (i / (robotHealthTimeline.length - 1)) * 100;
                      const y = 100 - ((d.avgHealth - 0.75) / 0.25) * 100;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                  />
                  {robotHealthTimeline.map((d, i) => {
                    const x = (i / (robotHealthTimeline.length - 1)) * 100;
                    const y = 100 - ((d.avgHealth - 0.75) / 0.25) * 100;
                    return (
                      <circle
                        key={i}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="4"
                        fill="hsl(280, 70%, 60%)"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 pl-12">
            {robotHealthTimeline.map((d, i) => (
              <span key={i}>{d.hour}</span>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Operational Robots</span>
              <span className="font-bold text-green-400">{robotHealthTimeline[robotHealthTimeline.length - 1]?.operational || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temperature & Vibration Distribution */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Temperature & Vibration Distribution</CardTitle>
          <CardDescription>Sensor readings for all machines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                <span>220°C</span>
                <span>200°C</span>
                <span>180°C</span>
                <span>160°C</span>
              </div>
              
              <div className="ml-12 h-full relative">
                <div className="absolute inset-0 flex items-end justify-between gap-2 px-2 pb-4">
                  {tempDistribution.map((d, i) => (
                    <div key={d.machine} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full relative" style={{ height: '200px' }}>
                        {/* Temperature bar */}
                        <div 
                          className={`absolute bottom-0 w-full rounded-t ${
                            d.risk > 0.5 ? 'bg-red-500/80' : 
                            d.risk > 0.25 ? 'bg-yellow-500/80' : 'bg-blue-500/80'
                          }`}
                          style={{ height: `${(d.temperature / 220) * 100}%` }}
                        />
                        {/* Vibration indicator */}
                        <div 
                          className="absolute bottom-0 w-full bg-orange-500/60 rounded-t"
                          style={{ height: `${(d.vibration / 6) * 100}%` }}
                        />
                        {/* Value labels */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-center">
                          <div>{d.machine}</div>
                          <div className="text-xs text-muted-foreground">{d.temperature}°C</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/80 rounded"></div>
              <span>Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500/60 rounded"></div>
              <span>Vibration</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machines Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-400" />
            All Machines
          </CardTitle>
          <CardDescription>Complete machine inventory and health status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={mockMachines}
            columns={machineColumns}
            emptyMessage="No machines found"
          />
        </CardContent>
      </Card>

      {/* Robotics Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            All Robotics
          </CardTitle>
          <CardDescription>Complete robotics inventory and health status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={mockRobots}
            columns={robotColumns}
            emptyMessage="No robots found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
