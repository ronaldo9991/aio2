import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Wrench, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';

interface ProductionStats {
  machines: {
    totalBottles: number;
    bottlesPerHour: number;
    totalCost: number;
    costPerBottle: number;
    utilization: number;
    oee: number;
    downtime: number;
  };
  robotics: {
    totalBottles: number;
    bottlesPerHour: number;
    totalCost: number;
    costPerBottle: number;
    utilization: number;
    pickRate: number;
    idleTime: number;
  };
  comparison: {
    totalProduction: number;
    machineShare: number;
    robotShare: number;
    totalCost: number;
    machineCostShare: number;
    robotCostShare: number;
    winner: 'machines' | 'robotics' | 'tie';
    efficiencyWinner: 'machines' | 'robotics' | 'tie';
  };
}

export function MachinesVsRobotics() {
  const { data: stats, isLoading } = useQuery<ProductionStats>({
    queryKey: ['/api/production/machines-vs-robotics'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Default values - MATCH ENERGY PAGE VALUES EXACTLY
  // Based on 100 hours of production (≈7.14 days)
  const productionStats = stats || {
    machines: {
      totalBottles: 135000, // 1350 bottles/hour × 100 hours
      bottlesPerHour: 1350, // Fixed: 10 machines × 135
      totalCost: 12568.50, // Calculated from Energy page values
      costPerBottle: 0.095, // Fixed: matches Dashboard
      utilization: 0.84, // Fixed: matches Dashboard
      oee: 0.86, // Fixed: matches Dashboard
      downtime: 45, // Fixed: matches Dashboard
    },
    robotics: {
      totalBottles: 98000, // 980 bottles/hour × 100 hours
      bottlesPerHour: 980, // Fixed: matches Dashboard
      totalCost: 8643.60, // Calculated from Energy page values
      costPerBottle: 0.090, // Fixed: matches Dashboard
      utilization: 0.81, // Fixed: average
      pickRate: 145, // Fixed: average
      idleTime: 62, // Fixed: average
    },
    comparison: {
      totalProduction: 233000, // 135,000 + 98,000
      machineShare: 57.9, // (135,000 / 233,000) × 100
      robotShare: 42.1, // (98,000 / 233,000) × 100
      totalCost: 21212.10, // 12,568.50 + 8,643.60
      machineCostShare: 59.2, // (12,568.50 / 21,212.10) × 100
      robotCostShare: 40.8, // (8,643.60 / 21,212.10) × 100
      winner: 'machines',
      efficiencyWinner: 'robotics',
    },
  };

  const getWinnerBadge = (winner: string) => {
    if (winner === 'machines') {
      return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">🏆 Machines Win</Badge>;
    } else if (winner === 'robotics') {
      return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">🏆 Robotics Win</Badge>;
    }
    return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">🤝 Tie</Badge>;
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Machines vs Robotics</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare production output, costs, and efficiency between machines and robotics
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How This Comparison Works</AlertTitle>
        <AlertDescription>
          This page compares traditional manufacturing machines vs robotic automation.
          <br />
          • <strong>Production:</strong> Total bottles produced by each system
          <br />
          • <strong>Cost:</strong> Total operational cost including energy, maintenance, and labor
          <br />
          • <strong>Efficiency:</strong> Cost per bottle and utilization rates
          <br />
          • <strong>Winner:</strong> Determined by production volume and cost efficiency
        </AlertDescription>
      </Alert>

      {/* Overall Comparison */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Overall Comparison</span>
            {getWinnerBadge(productionStats.comparison.winner)}
          </CardTitle>
          <CardDescription className="text-sm mt-1">Production and cost breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">Total Production</span>
                  <span className="text-xl font-bold">{productionStats.comparison.totalProduction.toLocaleString()} bottles</span>
                </div>
                <div className="h-6 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <motion.div
                      className="bg-blue-500/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${productionStats.comparison.machineShare}%` }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div
                      className="bg-purple-500/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${productionStats.comparison.robotShare}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Machines: {productionStats.comparison.machineShare}%</span>
                  <span>Robotics: {productionStats.comparison.robotShare}%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold">Total Cost</span>
                  <span className="text-xl font-bold">${productionStats.comparison.totalCost.toLocaleString()}</span>
                </div>
                <div className="h-6 bg-muted/30 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <motion.div
                      className="bg-blue-500/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${productionStats.comparison.machineCostShare}%` }}
                      transition={{ duration: 0.6 }}
                    />
                    <motion.div
                      className="bg-purple-500/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${productionStats.comparison.robotCostShare}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>Machines: ${Math.round(productionStats.comparison.totalCost * productionStats.comparison.machineCostShare / 100).toLocaleString()}</span>
                  <span>Robotics: ${Math.round(productionStats.comparison.totalCost * productionStats.comparison.robotCostShare / 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="w-5 h-5 text-blue-400" />
                  <span className="text-base font-semibold text-blue-400">Machines</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Produces <strong className="text-foreground">{productionStats.comparison.machineShare}%</strong> of total output</div>
                  <div>Cost: <strong className="text-foreground">${productionStats.machines.costPerBottle.toFixed(3)}</strong> per bottle</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-semibold text-purple-400">Robotics</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Produces <strong className="text-foreground">{productionStats.comparison.robotShare}%</strong> of total output</div>
                  <div>Cost: <strong className="text-foreground">${productionStats.robotics.costPerBottle.toFixed(3)}</strong> per bottle</div>
                </div>
              </div>

              {productionStats.comparison.efficiencyWinner === 'robotics' && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-base font-semibold text-green-400">Efficiency Winner</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Robotics has lower cost per bottle (<strong className="text-foreground">${productionStats.robotics.costPerBottle.toFixed(3)}</strong> vs <strong className="text-foreground">${productionStats.machines.costPerBottle.toFixed(3)}</strong>)
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Machines Stats */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Wrench className="w-6 h-6 text-blue-400" />
              Manufacturing Machines
            </CardTitle>
            <CardDescription className="text-sm mt-1">Traditional production line performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Bottles</span>
                </div>
                <div className="text-2xl font-bold">{productionStats.machines.totalBottles.toLocaleString()}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bottles/Hour</span>
                </div>
                <div className="text-2xl font-bold">{productionStats.machines.bottlesPerHour.toLocaleString()}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/15 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cost/Bottle</span>
                </div>
                <div className="text-2xl font-bold text-green-400">${productionStats.machines.costPerBottle.toFixed(3)}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">OEE</span>
                </div>
                <div className={`text-2xl font-bold ${productionStats.machines.oee >= 0.75 ? 'text-green-400' : ''}`}>
                  {(productionStats.machines.oee * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Utilization</span>
                </div>
                <div className="text-2xl font-bold">{(productionStats.machines.utilization * 100).toFixed(0)}%</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Downtime</span>
                </div>
                <div className={`text-2xl font-bold ${productionStats.machines.downtime >= 60 ? 'text-yellow-400' : ''}`}>
                  {productionStats.machines.downtime} min
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Robotics Stats */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Bot className="w-6 h-6 text-purple-400" />
              Robotics & Automation
            </CardTitle>
            <CardDescription className="text-sm mt-1">Automated production performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Bottles</span>
                </div>
                <div className="text-2xl font-bold">{productionStats.robotics.totalBottles.toLocaleString()}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bottles/Hour</span>
                </div>
                <div className="text-2xl font-bold">{productionStats.robotics.bottlesPerHour.toLocaleString()}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cost/Bottle</span>
                </div>
                <div className="text-2xl font-bold">${productionStats.robotics.costPerBottle.toFixed(3)}</div>
              </div>
              
              <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/15 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pick Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{productionStats.robotics.pickRate} units/hr</div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Utilization</span>
                </div>
                <div className={`text-2xl font-bold ${productionStats.robotics.utilization >= 0.85 ? 'text-green-400' : ''}`}>
                  {(productionStats.robotics.utilization * 100).toFixed(0)}%
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Idle Time</span>
                </div>
                <div className={`text-2xl font-bold ${productionStats.robotics.idleTime >= 100 ? 'text-yellow-400' : ''}`}>
                  {productionStats.robotics.idleTime} min
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Comparison Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Production Comparison</CardTitle>
            <CardDescription className="text-sm mt-1">Bottles produced per hour</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Machines</span>
                  <span className="text-lg font-bold font-mono">{productionStats.machines.bottlesPerHour.toLocaleString()} bottles/hr</span>
                </div>
                <div className="h-8 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500/80 flex items-center justify-end pr-3"
                    initial={{ width: 0 }}
                    animate={{ width: `${(productionStats.machines.bottlesPerHour / 1500) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-sm font-semibold text-white">{(productionStats.machines.bottlesPerHour / 1500 * 100).toFixed(0)}%</span>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Robotics</span>
                  <span className="text-lg font-bold font-mono">{productionStats.robotics.bottlesPerHour.toLocaleString()} bottles/hr</span>
                </div>
                <div className="h-8 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-500/80 flex items-center justify-end pr-3"
                    initial={{ width: 0 }}
                    animate={{ width: `${(productionStats.robotics.bottlesPerHour / 1500) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <span className="text-sm font-semibold text-white">{(productionStats.robotics.bottlesPerHour / 1500 * 100).toFixed(0)}%</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Cost Efficiency</CardTitle>
            <CardDescription className="text-sm mt-1">Cost per bottle comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Machines</span>
                  <span className="text-lg font-bold font-mono">${productionStats.machines.costPerBottle.toFixed(3)}</span>
                </div>
                <div className="h-8 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500/80 flex items-center justify-end pr-3"
                    initial={{ width: 0 }}
                    animate={{ width: `${(productionStats.machines.costPerBottle / 0.12) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-sm font-semibold text-white">${productionStats.machines.costPerBottle.toFixed(3)}</span>
                  </motion.div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Robotics</span>
                  <span className="text-lg font-bold font-mono">${productionStats.robotics.costPerBottle.toFixed(3)}</span>
                </div>
                <div className="h-8 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full flex items-center justify-end pr-3 ${
                      productionStats.robotics.costPerBottle < productionStats.machines.costPerBottle 
                        ? 'bg-green-500/80' 
                        : 'bg-purple-500/80'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(productionStats.robotics.costPerBottle / 0.12) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <span className="text-sm font-semibold text-white">${productionStats.robotics.costPerBottle.toFixed(3)}</span>
                  </motion.div>
                </div>
              </div>

              {productionStats.robotics.costPerBottle < productionStats.machines.costPerBottle && (
                <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-400">
                      Robotics is {((productionStats.machines.costPerBottle - productionStats.robotics.costPerBottle) / productionStats.machines.costPerBottle * 100).toFixed(1)}% more cost-efficient
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* One Week Overall Cost Comparison */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            One Week Overall Cost Comparison
          </CardTitle>
          <CardDescription className="text-sm mt-1">Detailed weekly cost breakdown based on Dashboard values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Calculation Explanation */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start gap-3">
                <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-2">Calculation Basis</p>
                  <p className="text-xs text-muted-foreground leading-relaxed space-y-1">
                    <strong>Production:</strong> Machines: 1,350 bottles/hour × 14 hours/day × 7 days = 132,300 bottles/week
                    <br />
                    <strong>Production:</strong> Robotics: 980 bottles/hour × 14 hours/day × 7 days = 96,040 bottles/week
                    <br />
                    <strong>Energy:</strong> Machines: 245 kWh/day × 7 days = 1,715 kWh/week | Robotics: 117 kWh/day × 7 days = 819 kWh/week
                    <br />
                    <strong>Energy Cost:</strong> $0.12 per kWh (industrial rate)
                    <br />
                    <strong>Labor:</strong> Machines: $125/hour × 14 hours × 7 days | Robotics: $50/hour × 14 hours × 7 days
                    <br />
                    <strong>Cost per Bottle:</strong> Machines: $0.095 | Robotics: $0.090
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Cost Breakdown */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Machines Weekly Costs */}
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    Machines - Weekly Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <span className="text-sm font-medium">Production</span>
                      <span className="text-lg font-bold">132,300 bottles</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <span className="text-sm font-medium">Energy (1,715 kWh)</span>
                      <span className="text-lg font-bold">${(1715 * 0.12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <span className="text-sm font-medium">Labor (5 workers)</span>
                      <span className="text-lg font-bold">${(125 * 14 * 7).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <span className="text-sm font-medium">Maintenance & Other</span>
                      <span className="text-lg font-bold">${((132300 * 0.095) - (1715 * 0.12) - (125 * 14 * 7)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/30">
                      <span className="text-base font-semibold">Total Weekly Cost</span>
                      <span className="text-2xl font-bold">${(132300 * 0.095).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Cost per Bottle</span>
                      <span className="text-base font-semibold">$0.095</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Robotics Weekly Costs */}
              <Card className="border-purple-500/20 bg-purple-500/5">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bot className="w-4 h-4 text-purple-400" />
                    Robotics - Weekly Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="text-sm font-medium">Production</span>
                      <span className="text-lg font-bold">96,040 bottles</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="text-sm font-medium">Energy (819 kWh)</span>
                      <span className="text-lg font-bold">${(819 * 0.12).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="text-sm font-medium">Labor (2 workers)</span>
                      <span className="text-lg font-bold">${(50 * 14 * 7).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <span className="text-sm font-medium">Maintenance & Other</span>
                      <span className="text-lg font-bold">${((96040 * 0.090) - (819 * 0.12) - (50 * 14 * 7)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-purple-500/20 border-2 border-purple-500/30">
                      <span className="text-base font-semibold">Total Weekly Cost</span>
                      <span className="text-2xl font-bold">${(96040 * 0.090).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-muted-foreground">Cost per Bottle</span>
                      <span className="text-base font-semibold">$0.090</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Comparison Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Total Weekly Production</div>
                <div className="text-2xl font-bold">{(132300 + 96040).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">bottles</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Total Weekly Cost</div>
                <div className="text-2xl font-bold">${((132300 * 0.095) + (96040 * 0.090)).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">all systems</div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Weekly Savings (Robotics)</div>
                <div className="text-2xl font-bold text-green-400">${((132300 * 0.095) - (96040 * 0.090)).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">vs machines cost</div>
              </div>
            </div>

            {/* Cost Breakdown Chart */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-sm font-semibold mb-4">Weekly Cost Breakdown</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Machines Total: ${(132300 * 0.095).toLocaleString()}</span>
                    <span>{((132300 * 0.095) / ((132300 * 0.095) + (96040 * 0.090)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-4 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500/80 flex items-center justify-end pr-2"
                      style={{ width: `${((132300 * 0.095) / ((132300 * 0.095) + (96040 * 0.090)) * 100)}%` }}
                    >
                      <span className="text-xs font-semibold text-white">${(132300 * 0.095).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Robotics Total: ${(96040 * 0.090).toLocaleString()}</span>
                    <span>{((96040 * 0.090) / ((132300 * 0.095) + (96040 * 0.090)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-4 bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500/80 flex items-center justify-end pr-2"
                      style={{ width: `${((96040 * 0.090) / ((132300 * 0.095) + (96040 * 0.090)) * 100)}%` }}
                    >
                      <span className="text-xs font-semibold text-white">${(96040 * 0.090).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights */}
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-400 mb-2">Weekly Cost Analysis</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Over one week, <strong className="text-foreground">Robotics save ${((132300 * 0.095) - (96040 * 0.090)).toFixed(2)}</strong> compared to machines 
                    producing the same volume. This represents a <strong className="text-foreground">
                      {(((132300 * 0.095) - (96040 * 0.090)) / (132300 * 0.095) * 100).toFixed(1)}% cost reduction
                    </strong> per bottle. The primary savings come from lower energy consumption (819 kWh vs 1,715 kWh) 
                    and reduced labor requirements (2 workers vs 5 workers).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Summary & Recommendations</CardTitle>
          <CardDescription className="text-sm mt-1">Key insights and optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="p-5 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-start gap-4">
                <BarChart3 className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold mb-2">Production Leader</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {productionStats.comparison.winner === 'machines' 
                      ? `Machines produce ${productionStats.comparison.machineShare}% of total output, making them the volume leader.`
                      : `Robotics produce ${productionStats.comparison.robotShare}% of total output, making them the volume leader.`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold mb-2">Cost Efficiency</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {productionStats.comparison.efficiencyWinner === 'robotics'
                      ? `Robotics has a ${((productionStats.machines.costPerBottle - productionStats.robotics.costPerBottle) / productionStats.machines.costPerBottle * 100).toFixed(1)}% lower cost per bottle. Consider expanding robotic capacity.`
                      : `Machines have a ${((productionStats.robotics.costPerBottle - productionStats.machines.costPerBottle) / productionStats.robotics.costPerBottle * 100).toFixed(1)}% lower cost per bottle. Traditional machines remain cost-effective.`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex items-start gap-4">
                <Activity className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-base font-semibold mb-2">Optimization Opportunity</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {productionStats.machines.utilization < 0.85 && productionStats.robotics.utilization < 0.85
                      ? 'Both systems have room for improvement. Focus on reducing downtime and idle time to increase utilization.'
                      : productionStats.machines.utilization < 0.85
                      ? 'Machines have lower utilization. Consider better scheduling and maintenance planning.'
                      : 'Robotics have lower utilization. Review automation workflows and task allocation.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
