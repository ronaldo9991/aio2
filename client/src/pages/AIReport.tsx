import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Bot, 
  Wrench, 
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Info,
  Sparkles,
  Clock,
  Zap,
  Target,
  Trophy,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ComparisonReport {
  summary: {
    machines: {
      bottlesPerHour: number;
      oee: number;
      utilization: number;
      defectRate: number;
      costPerBottle: number;
      totalDefects: number;
      kwhPer1000Bottles?: number;
      dailyKwh?: number;
    };
    robotics: {
      bottlesPerHour: number;
      oee: number;
      utilization: number;
      defectRate: number;
      costPerBottle: number;
      totalDefects: number;
      kwhPer1000Bottles?: number;
      dailyKwh?: number;
    };
    comparison: {
      totalProduction: number;
      machineShare: number;
      robotShare: number;
      qualityWinner: 'machines' | 'robotics';
      costWinner: 'machines' | 'robotics';
      productionWinner: 'machines' | 'robotics';
      energyWinner?: 'machines' | 'robotics';
    };
  };
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: 'high' | 'medium' | 'low';
  }>;
  generatedAt: string;
}

export function AIReport() {
  const { data: report, isLoading } = useQuery<ComparisonReport>({
    queryKey: ['/api/ai-report/comparison'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Default values - MATCH DASHBOARD VALUES EXACTLY
  const comparisonReport = report || {
    summary: {
      machines: {
        bottlesPerHour: 1350, // Fixed: 10 machines * 135 = 1350 (matches Dashboard)
        oee: 0.86, // Fixed: 86% (matches Dashboard)
        utilization: 0.84, // Fixed: 84% (matches Dashboard)
        defectRate: 3.0, // Fixed: 3 defects per 100 bottles (matches Quality Control)
        costPerBottle: 0.095, // Fixed: $0.095 (matches Dashboard)
        totalDefects: Math.round(1350 * 14 * 0.03), // Daily defects: 1350 * 14 * 3% = 567
        kwhPer1000Bottles: 18.5, // Fixed: 18.5 kWh (matches Dashboard and Energy page)
        dailyKwh: 245, // Fixed: 245 kWh (matches Energy page)
      },
      robotics: {
        bottlesPerHour: 980, // Fixed: 980 total (matches Dashboard)
        oee: 0.88, // Fixed: 88% (slightly higher than machines)
        utilization: 0.81, // Fixed: 81% (average)
        defectRate: 0.0, // Fixed: 0 defects (matches Quality Control)
        costPerBottle: 0.090, // Fixed: $0.090 (slightly lower than machines)
        totalDefects: 0, // Fixed: 0 defects
        kwhPer1000Bottles: 15.2, // Fixed: 15.2 kWh (matches Energy page)
        dailyKwh: 117, // Fixed: 117 kWh (matches Energy page)
      },
      comparison: {
        totalProduction: 2330, // Fixed: 1350 + 980 = 2330 (matches Dashboard)
        machineShare: (1350 / 2330) * 100, // Fixed: 57.9%
        robotShare: (980 / 2330) * 100, // Fixed: 42.1%
        qualityWinner: 'robotics',
        costWinner: 'robotics',
        productionWinner: 'machines',
        energyWinner: 'robotics',
      },
    },
    recommendations: [],
    generatedAt: new Date().toISOString(),
  };

  // Calculate overall winner based on multiple factors
  const calculateOverallWinner = () => {
    let roboticsScore = 0;
    let machinesScore = 0;

    // Quality (40% weight) - Robotics wins
    if (comparisonReport.summary.comparison.qualityWinner === 'robotics') roboticsScore += 40;
    else machinesScore += 40;

    // Cost (25% weight) - Robotics wins
    if (comparisonReport.summary.comparison.costWinner === 'robotics') roboticsScore += 25;
    else machinesScore += 25;

    // Energy (20% weight) - Robotics wins
    if (comparisonReport.summary.comparison.energyWinner === 'robotics') roboticsScore += 20;
    else machinesScore += 20;

    // Production (15% weight) - Machines wins
    if (comparisonReport.summary.comparison.productionWinner === 'machines') machinesScore += 15;
    else roboticsScore += 15;

    return roboticsScore > machinesScore ? 'robotics' : 'machines';
  };

  const overallWinner = calculateOverallWinner();
  const winnerScore = overallWinner === 'robotics' 
    ? (40 + 25 + 20) 
    : (40 + 25 + 20 + 15);

  // Chart data
  const comparisonData = [
    { metric: 'Production', machines: comparisonReport.summary.machines.bottlesPerHour, robotics: comparisonReport.summary.robotics.bottlesPerHour },
    { metric: 'OEE %', machines: comparisonReport.summary.machines.oee * 100, robotics: comparisonReport.summary.robotics.oee * 100 },
    { metric: 'Utilization %', machines: comparisonReport.summary.machines.utilization * 100, robotics: comparisonReport.summary.robotics.utilization * 100 },
  ];

  const qualityData = [
    { name: 'Machines', defects: comparisonReport.summary.machines.defectRate },
    { name: 'Robotics', defects: comparisonReport.summary.robotics.defectRate },
  ];

  const costData = [
    { metric: 'Cost per Bottle', machines: comparisonReport.summary.machines.costPerBottle * 1000, robotics: comparisonReport.summary.robotics.costPerBottle * 1000 },
  ];

  const pieData = [
    { name: 'Machines', value: comparisonReport.summary.comparison.machineShare },
    { name: 'Robotics', value: comparisonReport.summary.comparison.robotShare },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Comparison Report</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Comprehensive analysis: Machines vs Robotics
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>AI-Generated Analysis</AlertTitle>
        <AlertDescription>
          This report compares machines and robotics across production, quality, cost, and energy metrics to determine the overall winner.
        </AlertDescription>
      </Alert>

      {/* OVERALL WINNER - PROMINENT DISPLAY */}
      <Card className={`border-2 ${
        overallWinner === 'robotics' 
          ? 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-500/5' 
          : 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5'
      }`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Trophy className={`w-6 h-6 ${overallWinner === 'robotics' ? 'text-green-400' : 'text-blue-400'}`} />
            Overall Winner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {overallWinner === 'robotics' ? (
                <Bot className="w-16 h-16 text-green-400" />
              ) : (
                <Wrench className="w-16 h-16 text-blue-400" />
              )}
              <div>
                <div className="text-3xl font-bold mb-2">
                  {overallWinner === 'robotics' ? 'Robotics' : 'Machines'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Wins in {winnerScore}% of key metrics
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {winnerScore}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Overall Score
              </div>
            </div>
          </div>

          {/* Winner Breakdown */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg ${
              comparisonReport.summary.comparison.qualityWinner === 'robotics' 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-muted/50 border border-border/50'
            }`}>
              <div className="text-xs text-muted-foreground mb-1">Quality</div>
              <div className={`text-lg font-bold ${
                comparisonReport.summary.comparison.qualityWinner === 'robotics' ? 'text-green-400' : 'text-foreground'
              }`}>
                {comparisonReport.summary.comparison.qualityWinner === 'robotics' ? '✓' : '✗'}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${
              comparisonReport.summary.comparison.costWinner === 'robotics' 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-muted/50 border border-border/50'
            }`}>
              <div className="text-xs text-muted-foreground mb-1">Cost</div>
              <div className={`text-lg font-bold ${
                comparisonReport.summary.comparison.costWinner === 'robotics' ? 'text-green-400' : 'text-foreground'
              }`}>
                {comparisonReport.summary.comparison.costWinner === 'robotics' ? '✓' : '✗'}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${
              comparisonReport.summary.comparison.energyWinner === 'robotics' 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-muted/50 border border-border/50'
            }`}>
              <div className="text-xs text-muted-foreground mb-1">Energy</div>
              <div className={`text-lg font-bold ${
                comparisonReport.summary.comparison.energyWinner === 'robotics' ? 'text-green-400' : 'text-foreground'
              }`}>
                {comparisonReport.summary.comparison.energyWinner === 'robotics' ? '✓' : '✗'}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${
              comparisonReport.summary.comparison.productionWinner === 'machines' 
                ? 'bg-blue-500/20 border border-blue-500/30' 
                : 'bg-muted/50 border border-border/50'
            }`}>
              <div className="text-xs text-muted-foreground mb-1">Production</div>
              <div className={`text-lg font-bold ${
                comparisonReport.summary.comparison.productionWinner === 'machines' ? 'text-blue-400' : 'text-foreground'
              }`}>
                {comparisonReport.summary.comparison.productionWinner === 'machines' ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Machines Card */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="w-5 h-5 text-blue-400" />
              Manufacturing Machines
            </CardTitle>
            <CardDescription className="text-sm">Performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Bottles/Hour</div>
                <div className="text-xl font-bold">{comparisonReport.summary.machines.bottlesPerHour.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">OEE</div>
                <div className="text-xl font-bold">{(comparisonReport.summary.machines.oee * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-xs text-muted-foreground mb-1">Defect Rate</div>
                <div className="text-xl font-bold text-yellow-400">{comparisonReport.summary.machines.defectRate.toFixed(1)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Cost/Bottle</div>
                <div className="text-xl font-bold">${comparisonReport.summary.machines.costPerBottle.toFixed(3)}</div>
              </div>
            </div>
            {comparisonReport.summary.machines.kwhPer1000Bottles && (
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Energy (kWh/1K)</div>
                <div className="text-lg font-bold">{comparisonReport.summary.machines.kwhPer1000Bottles.toFixed(1)}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Robotics Card */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-green-400">
              <Bot className="w-5 h-5 text-green-400" />
              Robotics & Automation
            </CardTitle>
            <CardDescription className="text-sm">Performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Bottles/Hour</div>
                <div className="text-xl font-bold text-green-400">{comparisonReport.summary.robotics.bottlesPerHour.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">OEE</div>
                <div className="text-xl font-bold text-green-400">{(comparisonReport.summary.robotics.oee * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                <div className="text-xs text-muted-foreground mb-1">Defect Rate</div>
                <div className="text-xl font-bold text-green-400">{comparisonReport.summary.robotics.defectRate.toFixed(1)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Cost/Bottle</div>
                <div className="text-xl font-bold text-green-400">${comparisonReport.summary.robotics.costPerBottle.toFixed(3)}</div>
              </div>
            </div>
            {comparisonReport.summary.robotics.kwhPer1000Bottles && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Energy (kWh/1K)</div>
                <div className="text-lg font-bold text-green-400">{comparisonReport.summary.robotics.kwhPer1000Bottles.toFixed(1)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Production Comparison Chart */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Production Comparison</CardTitle>
          <CardDescription className="text-sm">Key performance metrics side-by-side</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="metric" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar dataKey="machines" fill="#3b82f6" name="Machines" radius={[4, 4, 0, 0]} />
              <Bar dataKey="robotics" fill="#10b981" name="Robotics" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quality & Cost Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quality Comparison */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Quality Comparison</CardTitle>
            <CardDescription className="text-sm">Defect rates: Machines vs Robotics</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold">Machines</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-yellow-400">{comparisonReport.summary.machines.defectRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">{comparisonReport.summary.machines.totalDefects} defects/day</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-green-400" />
                  <span className="font-semibold">Robotics</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">{comparisonReport.summary.robotics.defectRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">{comparisonReport.summary.robotics.totalDefects} defects/day</div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Quality Winner: Robotics</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Robotics produce <strong className="text-foreground">zero defects</strong> compared to <strong className="text-yellow-400">3% from machines</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Comparison */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Cost Comparison</CardTitle>
            <CardDescription className="text-sm">Cost per bottle: Machines vs Robotics</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="metric" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number) => `$${(value / 1000).toFixed(3)}`}
                />
                <Legend />
                <Bar dataKey="machines" fill="#3b82f6" name="Machines" radius={[4, 4, 0, 0]} />
                <Bar dataKey="robotics" fill="#10b981" name="Robotics" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Cost Winner: Robotics</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Robotics cost <strong className="text-foreground">
                  {((comparisonReport.summary.machines.costPerBottle - comparisonReport.summary.robotics.costPerBottle) / comparisonReport.summary.machines.costPerBottle * 100).toFixed(1)}% less
                </strong> per bottle.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Share */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Production Share</CardTitle>
          <CardDescription className="text-sm">Total production breakdown</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold">Machines</span>
                </div>
                <div className="text-xl font-bold">{comparisonReport.summary.machines.bottlesPerHour.toLocaleString()}/hr</div>
                <div className="text-xs text-muted-foreground">{comparisonReport.summary.comparison.machineShare.toFixed(1)}% of total</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold">Robotics</span>
                </div>
                <div className="text-xl font-bold text-green-400">{comparisonReport.summary.robotics.bottlesPerHour.toLocaleString()}/hr</div>
                <div className="text-xs text-muted-foreground">{comparisonReport.summary.comparison.robotShare.toFixed(1)}% of total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Comparison */}
      {comparisonReport.summary.machines.kwhPer1000Bottles && comparisonReport.summary.robotics.kwhPer1000Bottles && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              Energy Comparison
            </CardTitle>
            <CardDescription className="text-sm">Energy efficiency: Machines vs Robotics</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold">Machines</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">kWh/1K Bottles:</span>
                    <span className="font-bold">{comparisonReport.summary.machines.kwhPer1000Bottles.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily kWh:</span>
                    <span className="font-bold">{comparisonReport.summary.machines.dailyKwh?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">Robotics</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">kWh/1K Bottles:</span>
                    <span className="font-bold text-green-400">{comparisonReport.summary.robotics.kwhPer1000Bottles.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily kWh:</span>
                    <span className="font-bold text-green-400">{comparisonReport.summary.robotics.dailyKwh?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Energy Winner: Robotics</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Robotics consume <strong className="text-foreground">
                  {((comparisonReport.summary.machines.kwhPer1000Bottles - comparisonReport.summary.robotics.kwhPer1000Bottles) / comparisonReport.summary.machines.kwhPer1000Bottles * 100).toFixed(1)}% less
                </strong> energy per 1000 bottles.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Verdict */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="w-5 h-5 text-primary" />
            Final Verdict
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="flex items-start gap-3">
              {overallWinner === 'robotics' ? (
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              )}
              <div>
                <p className="text-base font-semibold mb-2">
                  <strong className={overallWinner === 'robotics' ? 'text-green-400' : 'text-blue-400'}>
                    {overallWinner === 'robotics' ? 'Robotics' : 'Machines'}
                  </strong> is the overall winner
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on comprehensive analysis across quality, cost, energy, and production metrics,{' '}
                  <strong className="text-foreground">
                    {overallWinner === 'robotics' ? 'Robotics' : 'Machines'}
                  </strong> demonstrates superior performance in {winnerScore}% of key evaluation criteria.
                  {overallWinner === 'robotics' && ' Robotics excel in quality (zero defects), cost efficiency, and energy consumption, making them the optimal choice for high-quality, sustainable production.'}
                  {overallWinner === 'machines' && ' Machines lead in production volume, making them ideal for high-volume manufacturing requirements.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
