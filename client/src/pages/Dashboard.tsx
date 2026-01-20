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
  const machineBottlesPerHourTotalFromStats = machineBottlesPerHourTotal; // FIXED: Always 1350 (total for all machines)
  const robotBottlesPerHourTotalFromStats = robotBottlesPerHourTotal; // FIXED: Always 980 (total for all robots)
  const operationalMachinesCountFromStats = operationalMachinesCount; // FIXED: Always 10
  const machineBottlesPerHourPerMachineFromStats = machineBottlesPerHourPerMachine; // FIXED: Always 135 per machine
  // FIXED VALUES - NO VARIATIONS
  const hourlyProductionData = hours.map((hour) => ({
    hour,
    machines: machineBottlesPerHourTotalFromStats, // Fixed: 1350 total (not per machine)
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
        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Throughput vs Target</CardTitle>
            <CardDescription className="text-sm">Actual production vs target (bottles/hour)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72 relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {/* Y-axis labels - improved styling */}
                {(() => {
                  const minValue = Math.round(totalBottlesPerHour * 0.90);
                  const maxValue = Math.round(totalBottlesPerHour * 1.10);
                  const step = Math.round((maxValue - minValue) / 4);
                  return (
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-3 pr-3 font-mono">
                      <span>{maxValue.toLocaleString()}</span>
                      <span>{(maxValue - step).toLocaleString()}</span>
                      <span>{(maxValue - step * 2).toLocaleString()}</span>
                      <span>{(maxValue - step * 3).toLocaleString()}</span>
                      <span>{minValue.toLocaleString()}</span>
                    </div>
                  );
                })()}
                
                {/* Chart area */}
                <div className="ml-14 h-full relative">
                  {/* Target line - improved styling */}
                  {(() => {
                    const minValue = 2097;
                    const maxValue = 2563;
                    const range = maxValue - minValue;
                    const targetPercent = ((targetThroughput - minValue) / range) * 100;
                    return (
                      <div 
                        className="absolute left-0 right-0 border-t-2 border-dashed border-blue-400/70 z-10"
                        style={{ bottom: `${targetPercent}%` }}
                      >
                        <div className="absolute -left-12 -top-1.5 text-xs font-medium text-blue-400 bg-card px-1">
                          Target
                        </div>
                      </div>
                    );
                  })()}
                  
                  {/* Bars with improved styling */}
                  <div className="absolute inset-0 flex items-end justify-between gap-3 px-3 pb-6">
                    {throughputData.map((d, i) => {
                      const minValue = 2097;
                      const maxValue = 2563;
                      const range = maxValue - minValue;
                      const actualPercent = ((d.actual - minValue) / range) * 100;
                      const isAbove = d.actual >= d.target;
                      const diff = d.actual - d.target;
                      const diffPercent = ((diff / d.target) * 100).toFixed(1);
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full relative" style={{ height: '220px' }}>
                            {/* Actual bar with gradient */}
                            <motion.div 
                              className={`absolute bottom-0 w-full rounded-t shadow-md ${
                                isAbove 
                                  ? 'bg-gradient-to-t from-green-600 to-green-500 border-t border-green-400/30' 
                                  : 'bg-gradient-to-t from-yellow-600 to-yellow-500 border-t border-yellow-400/30'
                              }`}
                              initial={{ height: 0 }}
                              animate={{ height: `${actualPercent}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                            />
                            {/* Value label with difference */}
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-center">
                              <div className="text-sm font-bold whitespace-nowrap">
                                {d.actual.toLocaleString()}
                              </div>
                              <div className={`text-[10px] font-medium ${isAbove ? 'text-green-400' : 'text-yellow-400'}`}>
                                {isAbove ? '+' : ''}{diffPercent}%
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{d.hour}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Improved legend */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded shadow-sm"></div>
                <span className="text-sm font-medium">Above Target</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded shadow-sm"></div>
                <span className="text-sm font-medium">Below Target</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 border-2 border-dashed border-blue-400 rounded"></div>
                <span className="text-sm font-medium">Target: {targetThroughput.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">AI Risk Score Timeline</CardTitle>
            <CardDescription className="text-sm">Average failure risk across all machines (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                {/* Y-axis labels - improved styling */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-3 pr-3 font-mono">
                  <span>30%</span>
                  <span>25%</span>
                  <span>20%</span>
                  <span>15%</span>
                  <span>10%</span>
                  <span>5%</span>
                  <span>0%</span>
                </div>
                
                <div className="ml-14 h-full relative">
                  {/* Risk zones - improved gradients */}
                  <div className="absolute inset-0">
                    {/* High risk zone (30%+) */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-red-500/15 to-red-500/5" style={{ height: '0%' }} />
                    {/* Medium risk zone (20-30%) */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-yellow-600/25 to-yellow-600/15" style={{ height: '33.33%', bottom: '66.67%' }} />
                    {/* Low risk zone (0-20%) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/15 to-green-500/5" style={{ height: '66.67%' }} />
                  </div>
                  
                  {/* Risk line with points - improved styling */}
                  <svg className="w-full h-full relative z-10" preserveAspectRatio="none">
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(199, 89%, 48%)" />
                        <stop offset="100%" stopColor="hsl(199, 89%, 60%)" />
                      </linearGradient>
                    </defs>
                    {/* Line connecting points */}
                    <polyline
                      fill="none"
                      stroke="url(#riskGradient)"
                      strokeWidth="3"
                      points={aiRiskTimeline.map((d, i) => {
                        const x = (i / (aiRiskTimeline.length - 1)) * 100;
                        // Scale: 0% = bottom (100%), 30% = top (0%)
                        const y = 100 - ((d.risk / 30) * 100);
                        return `${x}%,${y}%`;
                      }).join(' ')}
                    />
                    {/* Data points with glow effect */}
                    {aiRiskTimeline.map((d, i) => {
                      const x = (i / (aiRiskTimeline.length - 1)) * 100;
                      const y = 100 - ((d.risk / 30) * 100);
                      return (
                        <g key={i}>
                          {/* Glow effect */}
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="6"
                            fill="hsl(199, 89%, 48%)"
                            opacity="0.3"
                          />
                          {/* Main point */}
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="5"
                            fill="hsl(199, 89%, 48%)"
                            stroke="hsl(var(--card))"
                            strokeWidth="2"
                          />
                          {/* Value label */}
                          <text
                            x={`${x}%`}
                            y={`${y}%`}
                            dy="-12"
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-current text-cyan-400"
                          >
                            {d.risk.toFixed(0)}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
            {/* X-axis labels - improved */}
            <div className="flex justify-between text-xs text-muted-foreground mt-3 pl-14 font-medium">
              {aiRiskTimeline.map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
            {/* Improved legend */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded"></div>
                <span className="text-sm font-medium">&lt;20% (Low Risk)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded"></div>
                <span className="text-sm font-medium">20-30% (Medium Risk)</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded"></div>
                <span className="text-sm font-medium">&gt;30% (High Risk)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Breakdown: Machines vs Robotics per Hour */}
      <Card className="border-border/50 bg-card/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Production per Hour: Machines vs Robotics</CardTitle>
          <CardDescription className="text-sm">Hourly bottle production breakdown by system type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 relative">
            <div className="absolute inset-0 flex flex-col justify-between">
              {/* Y-axis labels - Fixed scale: 0-2500 bottles/hour */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-3 pr-3 font-mono">
                <span>2,500</span>
                <span>2,000</span>
                <span>1,500</span>
                <span>1,000</span>
                <span>500</span>
                <span>0</span>
              </div>
              
              <div className="ml-14 h-full relative">
                <div className="absolute inset-0 flex items-end justify-between gap-3 px-3 pb-6">
                  {hourlyProductionData.map((d, i) => {
                    const maxValue = 2500; // Fixed max value
                    const machinePercent = Math.min(100, (d.machines / maxValue) * 100);
                    const robotPercent = Math.min(100, (d.robotics / maxValue) * 100);
                    const total = d.machines + d.robotics;
                    
                return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative" style={{ height: '220px' }}>
                          {/* Stacked bars - machines on bottom, robotics on top */}
                          <div className="absolute bottom-0 w-full rounded-t overflow-hidden shadow-sm">
                            {/* Machines bar (blue) */}
                            <motion.div 
                              className="w-full bg-gradient-to-t from-blue-600 to-blue-500 border-t border-blue-400/30"
                              initial={{ height: 0 }}
                              animate={{ height: `${machinePercent}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                            />
                            {/* Robotics bar (purple) */}
                            <motion.div 
                              className="w-full bg-gradient-to-t from-purple-600 to-purple-500 border-t border-purple-400/30"
                              initial={{ height: 0 }}
                              animate={{ height: `${robotPercent}%` }}
                              transition={{ duration: 0.8, delay: i * 0.05 + 0.2, ease: "easeOut" }}
                              style={{ 
                                bottom: `${machinePercent}%`
                              }}
                            />
                          </div>
                          
                          {/* Value labels - better positioned */}
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-center space-y-0.5">
                            <div className="text-xs font-semibold text-blue-300 whitespace-nowrap">
                              M: {d.machines.toLocaleString()}
                            </div>
                            <div className="text-xs font-semibold text-purple-300 whitespace-nowrap">
                              R: {d.robotics.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-medium text-muted-foreground mt-1">
                              Total: {total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground mt-1">{d.hour}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend - improved styling */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded shadow-sm"></div>
              <span className="text-sm font-medium">Machines: {machineBottlesPerHourTotal.toLocaleString()}/hr</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded shadow-sm"></div>
              <span className="text-sm font-medium">Robotics: {robotBottlesPerHourTotal.toLocaleString()}/hr</span>
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
        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Downtime Reasons</CardTitle>
            <CardDescription className="text-sm">Breakdown of downtime causes (today)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {downtimeReasons.map((reason, i) => {
                const colors = [
                  'from-blue-600 to-blue-500',
                  'from-purple-600 to-purple-500',
                  'from-orange-600 to-orange-500',
                  'from-pink-600 to-pink-500',
                  'from-gray-600 to-gray-500',
                ];
                return (
                  <div key={reason.reason} className="space-y-2 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{reason.reason}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium">{reason.minutes} min</span>
                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-bold">
                          {reason.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-4 bg-muted/30 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full shadow-sm`}
                        initial={{ width: 0 }}
                        animate={{ width: `${reason.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 bg-muted/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Total Downtime</span>
                <span className="text-2xl font-bold text-primary">
                  {downtimeReasons.reduce((sum, r) => sum + r.minutes, 0)} <span className="text-base font-normal text-muted-foreground">minutes</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Defects by Type</CardTitle>
            <CardDescription className="text-sm">Quality issues breakdown (today)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defectTypes.map((defect, i) => {
                const colors = [
                  'from-red-600 to-red-500',
                  'from-orange-600 to-orange-500',
                  'from-amber-600 to-amber-500',
                  'from-rose-600 to-rose-500',
                  'from-pink-600 to-pink-500',
                ];
                return (
                  <div key={defect.type} className="space-y-2 group">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{defect.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-medium">{defect.count} bottles</span>
                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-bold">
                          {defect.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-4 bg-muted/30 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full shadow-sm`}
                        initial={{ width: 0 }}
                        animate={{ width: `${defect.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 bg-red-500/10 rounded-lg p-4 border-red-500/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Total Defects</span>
                <span className="text-2xl font-bold text-red-400">
                  {defectTypes.reduce((sum, d) => sum + d.count, 0)} <span className="text-base font-normal text-muted-foreground">bottles</span>
                </span>
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
