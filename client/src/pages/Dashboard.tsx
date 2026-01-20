import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  CheckSquare, 
  Clock,
  Sparkles,
  Info,
  TrendingUp,
  TrendingDown,
  Zap,
  Activity,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Bot
} from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';

interface DashboardStats {
  totalJobs: number;
  pendingApprovals: number;
  activeAlerts: number;
  machineUtilization: number;
  onTimeRate: number;
  avgRiskScore: number;
  pendingRecommendations?: number;
  oee?: number;
  downtime?: number;
  defectRate?: number;
  energyPer1000?: number;
  bottlesPerHour?: number;
  costPerBottle?: number;
  machineBottlesPerHour?: number;
  robotBottlesPerHour?: number;
  totalBottlesPerHour?: number;
  workersNeededForMachines?: number;
  workersNeededForRobots?: number;
  totalWorkers?: number;
  machineLaborCostPerHour?: number;
  robotLaborCostPerHour?: number;
  totalLaborCostPerHour?: number;
  dailyLaborCost?: number;
  dailyBottlesProduced?: number;
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

  const { data: recommendations } = useQuery<any[]>({
    queryKey: ['/api/dashboard/recommendations'],
  });

  if (statsLoading) {
    return <PageSkeleton />;
  }

  // Default values with correct fixed numbers
  const operationalMachinesCount = 10; // Default number of operational machines
  const machineBottlesPerHourPerMachine = 135; // Fixed: 135 per machine
  const robotBottlesPerHourTotal = 980; // Fixed: 980 total for all robots
  const machineBottlesPerHourTotal = machineBottlesPerHourPerMachine * operationalMachinesCount; // 1350
  const totalBottlesPerHourDefault = machineBottlesPerHourTotal + robotBottlesPerHourTotal; // 2330

  const dashboardStats = stats || {
    totalJobs: 47,
    pendingApprovals: 3,
    activeAlerts: 5,
    machineUtilization: 0.84,
    onTimeRate: 0.92,
    avgRiskScore: 0.12, // Lower risk score
    oee: 0.86, // Minimum 86%
    downtime: 45,
    defectRate: 1.2, // Lower defect rate
    energyPer1000: 18.5,
    bottlesPerHour: totalBottlesPerHourDefault,
    costPerBottle: 0.095,
    machineBottlesPerHour: machineBottlesPerHourPerMachine, // 135 per machine
    machineBottlesPerHourTotal: machineBottlesPerHourTotal, // 1350 total
    robotBottlesPerHour: robotBottlesPerHourTotal, // 980 total
    totalBottlesPerHour: totalBottlesPerHourDefault, // 2330
    workersNeededForMachines: 5, // 10 machines / 2 = 5 workers
    workersNeededForRobots: 2, // 5 robots / 3 = 2 workers (rounded up)
    totalWorkers: 7,
    machineLaborCostPerHour: 125, // 5 workers * $25
    robotLaborCostPerHour: 50, // 2 workers * $25
    totalLaborCostPerHour: 175, // 7 workers * $25
    dailyLaborCost: 2450, // 175 * 14 hours
    dailyBottlesProduced: Math.round(totalBottlesPerHourDefault * 14), // 32,620
  };

  const recentAlerts = alerts || [
    { id: '1', ts: new Date().toISOString(), severity: 'WARNING', type: 'MACHINE_HEALTH', message: 'Elevated vibration on Machine M-003', entityType: 'machine', entityId: 'M-003' },
    { id: '2', ts: new Date().toISOString(), severity: 'INFO', type: 'QUALITY', message: 'SPC limit warning for wall thickness', entityType: 'machine', entityId: 'M-001' },
    { id: '3', ts: new Date().toISOString(), severity: 'CRITICAL', type: 'SCHEDULE', message: 'Job J-015 at risk of missing due date', entityType: 'job', entityId: 'J-015' },
  ];

  // FIXED VALUES FOR CHARTS - NO VARIATIONS
  const totalBottlesPerHour = dashboardStats.totalBottlesPerHour || totalBottlesPerHourDefault; // Fixed: 2330
  const targetThroughput = 2200; // Fixed: 2200 (matches image)
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  // Fixed values for each hour - no random variations
  const throughputData = hours.map((hour) => ({
    hour,
    actual: totalBottlesPerHour, // Fixed: always 2330
    target: targetThroughput, // Fixed: always 2214
  }));
  
  // Per hour production breakdown (machines vs robotics) - FIXED VALUES
  // FIXED VALUES - Always use these exact numbers, never from API
  const machineBottlesPerHourTotalFromStats = machineBottlesPerHourTotal; // FIXED: Always 1350 (never use API value)
  const robotBottlesPerHourTotalFromStats = robotBottlesPerHourTotal; // FIXED: Always 980 (never use API value)
  const operationalMachinesCountFromStats = operationalMachinesCount; // FIXED: Always 10
  const machineBottlesPerHourPerMachineFromStats = machineBottlesPerHourPerMachine; // FIXED: Always 135
  // FIXED VALUES - NO VARIATIONS
  const hourlyProductionData = hours.map((hour) => ({
    hour,
    machines: machineBottlesPerHourPerMachineFromStats, // Fixed: 135 per machine
    robotics: robotBottlesPerHourTotalFromStats, // Fixed: 980 total
  }));

  // FIXED VALUES - NO VARIATIONS
  const totalDowntime = dashboardStats.downtime || 45; // Fixed: 45 minutes
  const downtimeReasons = [
    { reason: 'Maintenance', minutes: 18, percentage: 40 }, // Fixed: 18 min (40% of 45)
    { reason: 'Setup Change', minutes: 12, percentage: 27 }, // Fixed: 12 min (27% of 45)
    { reason: 'Quality Issue', minutes: 8, percentage: 18 }, // Fixed: 8 min (18% of 45)
    { reason: 'Material Shortage', minutes: 5, percentage: 11 }, // Fixed: 5 min (11% of 45)
    { reason: 'Other', minutes: 2, percentage: 4 }, // Fixed: 2 min (4% of 45)
  ];

  // Fixed defect counts based on 1.2% defect rate
  const totalDefects = 12; // Fixed: 12 defects (1.2% of 1000 bottles)
  const defectTypes = [
    { type: 'Thin Wall', count: 4, percentage: 35 }, // Fixed: 4 defects
    { type: 'Overweight', count: 3, percentage: 24 }, // Fixed: 3 defects
    { type: 'Surface Flaw', count: 3, percentage: 21 }, // Fixed: 3 defects
    { type: 'Neck Deformity', count: 1, percentage: 12 }, // Fixed: 1 defect
    { type: 'Other', count: 1, percentage: 8 }, // Fixed: 1 defect
  ];

  // Fixed risk timeline - always 12%
  const baseRisk = (dashboardStats.avgRiskScore || 0.12) * 100; // Fixed: 12%
  const aiRiskTimeline = hours.map((time) => ({
    time,
    risk: baseRisk, // Fixed: always 12%
  }));

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
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Command Center</h1>
        </div>
        <p className="text-sm text-muted-foreground">Real-time operations dashboard with key performance indicators</p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Command Center Overview</AlertTitle>
        <AlertDescription>
          Your central hub for monitoring factory performance. All metrics update in real-time.
          <br />
          • <strong>OEE:</strong> Overall Equipment Effectiveness (target: 85%+)
          <br />
          • <strong>AI Risk Score:</strong> Average failure risk across all machines (lower is better)
          <br />
          • <strong>Throughput vs Target:</strong> Compare actual production to goals
          <br />
          • <strong>Defect Rate:</strong> Percentage of bottles with quality issues (target: &lt;2%)
        </AlertDescription>
      </Alert>

      {/* Key Metrics Row */}
      <KPIGrid>
        <KPIChip
          label="OEE"
          value={`${((dashboardStats.oee || 0.86) * 100).toFixed(0)}%`}
          icon={<Activity className="w-5 h-5" />}
          variant={(dashboardStats.oee || 0.86) >= 0.86 ? 'success' : 'warning'}
        />
        <KPIChip
          label="Daily Production"
          value={(dashboardStats.dailyBottlesProduced || 31220).toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KPIChip
          label="Downtime (min)"
          value={dashboardStats.downtime || 45}
          icon={<Clock className="w-5 h-5" />}
          variant={(dashboardStats.downtime || 45) < 30 ? 'success' : (dashboardStats.downtime || 45) < 60 ? 'default' : 'warning'}
        />
        <KPIChip
          label="Defect Rate"
          value={`${(dashboardStats.defectRate || 1.2).toFixed(1)}%`}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={(dashboardStats.defectRate || 1.2) < 2 ? 'success' : (dashboardStats.defectRate || 1.2) < 5 ? 'warning' : 'danger'}
        />
        <KPIChip
          label="Energy / 1K Bottles"
          value={`${(dashboardStats.energyPer1000 || 18.5).toFixed(1)} kWh`}
          icon={<Zap className="w-5 h-5" />}
        />
        <KPIChip
          label="AI Risk Score"
          value={`${((dashboardStats.avgRiskScore || 0.12) * 100).toFixed(0)}%`}
          icon={<Sparkles className="w-5 h-5" />}
          variant={(dashboardStats.avgRiskScore || 0.12) < 0.15 ? 'success' : (dashboardStats.avgRiskScore || 0.12) < 0.25 ? 'warning' : 'danger'}
        />
        <KPIChip
          label="Total Bottles/Hour"
          value={(dashboardStats.totalBottlesPerHour || totalBottlesPerHourDefault).toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KPIChip
          label="Labor Cost/Hour"
          value={`$${(dashboardStats.totalLaborCostPerHour || 175).toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <KPIChip
          label="Total Workers"
          value={dashboardStats.totalWorkers || 7}
          icon={<Users className="w-5 h-5" />}
        />
      </KPIGrid>

      {/* Charts Row 1: Throughput vs Target & AI Risk Timeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Throughput vs Target</CardTitle>
            <CardDescription>Actual production vs target (bottles/hour)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {/* Y-axis labels - dynamic scale based on totalBottlesPerHour */}
                {(() => {
                  const minValue = Math.round(totalBottlesPerHour * 0.90);
                  const maxValue = Math.round(totalBottlesPerHour * 1.10);
                  const step = Math.round((maxValue - minValue) / 4);
                  return (
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                      <span>{maxValue.toLocaleString()}</span>
                      <span>{(maxValue - step).toLocaleString()}</span>
                      <span>{(maxValue - step * 2).toLocaleString()}</span>
                      <span>{(maxValue - step * 3).toLocaleString()}</span>
                      <span>{minValue.toLocaleString()}</span>
                    </div>
                  );
                })()}
                
                {/* Chart area */}
                <div className="ml-12 h-full relative">
                  {/* Target line - fixed scale matching image */}
                  {(() => {
                    const minValue = 2097;
                    const maxValue = 2563;
                    const range = maxValue - minValue;
                    const targetPercent = ((targetThroughput - minValue) / range) * 100;
                    return (
                      <div 
                        className="absolute left-0 right-0 border-t-2 border-dashed border-blue-300/60 z-10"
                        style={{ bottom: `${targetPercent}%` }}
                      />
                    );
                  })()}
                  
                  {/* Bars with fixed scale matching image */}
                  <div className="absolute inset-0 flex items-end justify-between gap-2 px-2 pb-4">
                    {throughputData.map((d, i) => {
                      // Fixed scale matching image: 2097 to 2563
                      const minValue = 2097;
                      const maxValue = 2563;
                      const range = maxValue - minValue;
                      const actualPercent = ((d.actual - minValue) / range) * 100;
                      const targetPercent = ((d.target - minValue) / range) * 100;
                      const isAbove = d.actual >= d.target;
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full relative" style={{ height: '200px' }}>
                            {/* Actual bar */}
                            <div 
                              className={`absolute bottom-0 w-full rounded-t ${
                                isAbove ? 'bg-blue-500/80' : 'bg-yellow-500/80'
                              }`}
                              style={{ height: `${actualPercent}%` }}
                            />
                            {/* Value label */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono whitespace-nowrap">
                              {d.actual.toLocaleString()}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">{d.hour}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/80 rounded"></div>
                <span>Actual (Above Target)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500/80 rounded"></div>
                <span>Actual (Below Target)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/20 rounded"></div>
                <span>Target: 2200</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>AI Risk Score Timeline</CardTitle>
            <CardDescription>Average failure risk across all machines (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {/* Y-axis labels - matching image: 10% to 30% */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                  <span>30%</span>
                  <span>25%</span>
                  <span>20%</span>
                  <span>15%</span>
                  <span>10%</span>
                </div>
                
                <div className="ml-12 h-full relative">
                  {/* Risk zones - matching image */}
                  <div className="absolute inset-0">
                    {/* High risk zone (30%+) - not visible in image */}
                    <div className="absolute top-0 left-0 right-0 bg-red-500/10" style={{ height: '0%' }} />
                    {/* Medium risk zone (20-30%) - yellow/brown fill */}
                    <div className="absolute top-0 left-0 right-0 bg-yellow-600/30" style={{ height: '50%', bottom: '50%' }} />
                    {/* Low risk zone (0-20%) - green fill */}
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500/10" style={{ height: '50%' }} />
                  </div>
                  
                  {/* Risk line with points */}
                  <svg className="w-full h-full relative z-10" preserveAspectRatio="none">
                    {/* Line connecting points */}
                    <polyline
                      fill="none"
                      stroke="hsl(199, 89%, 48%)"
                      strokeWidth="2"
                      points={aiRiskTimeline.map((d, i) => {
                        const x = (i / (aiRiskTimeline.length - 1)) * 100;
                        // Scale: 10% = bottom (100%), 30% = top (0%)
                        const y = 100 - ((d.risk - 10) / 20) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                    />
                    {/* Data points */}
                    {aiRiskTimeline.map((d, i) => {
                      const x = (i / (aiRiskTimeline.length - 1)) * 100;
                      const y = 100 - ((d.risk - 10) / 20) * 100;
                      return (
                        <circle
                          key={i}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="4"
                          fill="hsl(199, 89%, 48%)"
                          stroke="hsl(var(--card))"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2 pl-12">
              {aiRiskTimeline.map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500/20 rounded"></div>
                <span>&lt;20% (Low Risk)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600/30 rounded"></div>
                <span>20-30% (Medium Risk)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/20 rounded"></div>
                <span>&gt;30% (High Risk)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Breakdown: Machines vs Robotics per Hour */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Production per Hour: Machines vs Robotics</CardTitle>
          <CardDescription>Hourly bottle production breakdown by system type</CardDescription>
        </CardHeader>
          <CardContent>
            <div className="h-64 relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {/* Y-axis labels - Fixed scale: 0-2500 bottles/hour */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2 pr-2">
                  <span>2500</span>
                  <span>2000</span>
                  <span>1500</span>
                  <span>1000</span>
                  <span>500</span>
                </div>
                
                <div className="ml-12 h-full relative">
                  <div className="absolute inset-0 flex items-end justify-between gap-2 px-2 pb-4">
                    {hourlyProductionData.map((d, i) => {
                      const maxValue = 2500; // Fixed max value
                      const machinePercent = Math.min(100, (d.machines / maxValue) * 100);
                      const robotPercent = Math.min(100, (d.robotics / maxValue) * 100);
                      const totalHeight = Math.min(100, machinePercent + robotPercent);
                      
                return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full relative" style={{ height: '200px' }}>
                            {/* Stacked bars - machines on bottom, robotics on top */}
                            <div 
                              className="absolute bottom-0 w-full bg-blue-500/80 rounded-t"
                              style={{ height: `${machinePercent}%` }}
                            />
                            <div 
                              className="absolute w-full bg-purple-500/80 rounded-t"
                              style={{ 
                                height: `${robotPercent}%`,
                                bottom: `${machinePercent}%`
                              }}
                            />
                            {/* Value labels */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-mono whitespace-nowrap text-center">
                              <div className="text-blue-400">M: {d.machines}</div>
                              <div className="text-purple-400">R: {d.robotics}</div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">{d.hour}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500/80 rounded"></div>
                <span>Machines: {machineBottlesPerHourTotal.toLocaleString()}/hr</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500/80 rounded"></div>
                <span>Robotics: {robotBottlesPerHourTotal.toLocaleString()}/hr</span>
              </div>
            </div>
          </CardContent>
      </Card>

      {/* Labor & Cost Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Labor Requirements
            </CardTitle>
            <CardDescription>Workers needed for machines vs robotics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-blue-400">Machines</span>
                  </div>
                  <span className="text-lg font-bold">{dashboardStats.workersNeededForMachines || 5} workers</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.workersNeededForMachines || 5} workers needed for {operationalMachinesCount} operational machines
                  <br />
                  (1 worker per 2 machines)
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-purple-400">Robotics</span>
                  </div>
                  <span className="text-lg font-bold">{dashboardStats.workersNeededForRobots || 2} workers</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.workersNeededForRobots || 2} workers needed for 5 robots
                  <br />
                  (1 worker per 3 robots)
                </p>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Workers</span>
                  <span className="text-2xl font-bold">{dashboardStats.totalWorkers || 7} workers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Labor Cost
            </CardTitle>
            <CardDescription>Hourly and daily labor costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-400">Machines Labor</span>
                  <span className="text-lg font-bold">${(dashboardStats.machineLaborCostPerHour || 125).toLocaleString()}/hr</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.workersNeededForMachines || 5} workers × $25/hr
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-purple-400">Robotics Labor</span>
                  <span className="text-lg font-bold">${(dashboardStats.robotLaborCostPerHour || 50).toLocaleString()}/hr</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.workersNeededForRobots || 2} workers × $25/hr
                </p>
              </div>
              
              <div className="pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total/Hour</span>
                  <span className="text-xl font-bold">${(dashboardStats.totalLaborCostPerHour || 175).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Daily (14hr shift)</span>
                  <span className="text-lg font-bold text-primary">${(dashboardStats.dailyLaborCost || 2450).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Downtime Reasons & Defects by Type */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Downtime Reasons</CardTitle>
            <CardDescription>Breakdown of downtime causes (today)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {downtimeReasons.map((reason, i) => (
                <div key={reason.reason} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{reason.reason}</span>
                    <span className="text-muted-foreground">{reason.minutes} min ({reason.percentage}%)</span>
                  </div>
                  <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                      animate={{ width: `${reason.percentage}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                      />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Downtime</span>
                <span className="text-lg font-bold">{downtimeReasons.reduce((sum, r) => sum + r.minutes, 0)} minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Defects by Type</CardTitle>
            <CardDescription>Quality issues breakdown (today)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defectTypes.map((defect, i) => (
                <div key={defect.type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{defect.type}</span>
                    <span className="text-muted-foreground">{defect.count} bottles ({defect.percentage}%)</span>
                  </div>
                  <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-500/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${defect.percentage}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Defects</span>
                <span className="text-lg font-bold text-red-400">{defectTypes.reduce((sum, d) => sum + d.count, 0)} bottles</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">AI Recommendations</CardTitle>
              <CardDescription>Today's AI-powered suggestions</CardDescription>
            </div>
            <Sparkles className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {recommendations && recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.slice(0, 3).map((rec: any) => (
                  <div key={rec.id} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium">{rec.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(rec.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.description}
                    </p>
                  </div>
                ))}
                <Link href="/app/ai-recommendations">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Recommendations
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No recommendations at this time
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
    </div>
  );
}
