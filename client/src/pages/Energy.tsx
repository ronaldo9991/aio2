import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Zap, 
  Bot, 
  Wrench, 
  DollarSign,
  Activity,
  Info,
  BarChart3,
  Lightbulb,
  TrendingDown,
  CheckCircle2,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PageSkeleton } from '@/components/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface EnergyStats {
  machines: {
    kwhPer1000Bottles: number;
    dailyKwh: number;
    costPerBottle: number;
    dailyCost: number;
    efficiency: number;
    peakLoad: number;
  };
  robotics: {
    kwhPer1000Bottles: number;
    dailyKwh: number;
    costPerBottle: number;
    dailyCost: number;
    efficiency: number;
    peakLoad: number;
  };
  comparison: {
    totalDailyKwh: number;
    totalDailyCost: number;
    energyWinner: 'machines' | 'robotics';
    costWinner: 'machines' | 'robotics';
    efficiencyWinner: 'machines' | 'robotics';
    savings: number;
    savingsPercent: number;
  };
}

export function Energy() {
  const { data: energyStats, isLoading } = useQuery<EnergyStats>({
    queryKey: ['/api/energy/comparison'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Default values - MATCH DASHBOARD VALUES EXACTLY
  const stats = energyStats || {
    machines: {
      kwhPer1000Bottles: 18.5, // Fixed: 18.5 kWh (matches Dashboard)
      dailyKwh: 245, // Fixed: 245 kWh (matches Energy endpoint)
      costPerBottle: 0.0022, // Fixed: $0.0022 (matches Energy endpoint)
      dailyCost: 29.11, // Fixed: $29.11 (matches Energy endpoint)
      efficiency: 0.84, // Fixed: 84% (matches Energy endpoint)
      peakLoad: 280, // Fixed: 280 kW (matches Energy endpoint)
    },
    robotics: {
      kwhPer1000Bottles: 15.2, // Fixed: 15.2 kWh (matches Energy endpoint)
      dailyKwh: 117, // Fixed: 117 kWh (matches Energy endpoint)
      costPerBottle: 0.0018, // Fixed: $0.0018 (matches Energy endpoint)
      dailyCost: 13.80, // Fixed: $13.80 (matches Energy endpoint)
      efficiency: 0.91, // Fixed: 91% (matches Energy endpoint)
      peakLoad: 195, // Fixed: 195 kW (matches Energy endpoint)
    },
    comparison: {
      totalDailyKwh: 362, // Fixed: 245 + 117 = 362 (matches Energy endpoint)
      totalDailyCost: 42.91, // Fixed: 29.11 + 13.80 = 42.91 (matches Energy endpoint)
      energyWinner: 'robotics',
      costWinner: 'robotics',
      efficiencyWinner: 'robotics',
      savings: 15.31, // Fixed: 29.11 - 13.80 = 15.31 (matches Energy endpoint)
      savingsPercent: 52.6, // Fixed: (15.31 / 29.11) * 100 = 52.6% (matches Energy endpoint)
    },
  };

  // Chart data - FIXED VALUES
  const energyComparisonData = [
    { metric: 'kWh/1K Bottles', machines: stats.machines.kwhPer1000Bottles, robotics: stats.robotics.kwhPer1000Bottles },
    { metric: 'Daily kWh', machines: stats.machines.dailyKwh, robotics: stats.robotics.dailyKwh },
    { metric: 'Peak Load (kW)', machines: stats.machines.peakLoad, robotics: stats.robotics.peakLoad },
  ];

  const costComparisonData = [
    { metric: 'Cost/Bottle', machines: stats.machines.costPerBottle * 1000, robotics: stats.robotics.costPerBottle * 1000 },
    { metric: 'Daily Cost', machines: stats.machines.dailyCost, robotics: stats.robotics.dailyCost },
  ];

  const efficiencyData = [
    { name: 'Machines', efficiency: stats.machines.efficiency * 100 },
    { name: 'Robotics', efficiency: stats.robotics.efficiency * 100 },
  ];

  // Hourly energy consumption - FIXED VALUES
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const hourlyEnergyData = hours.map((hour) => ({
    hour,
    machines: Math.round(stats.machines.dailyKwh / 10), // Fixed: average per hour
    robotics: Math.round(stats.robotics.dailyKwh / 10), // Fixed: average per hour
  }));

  const pieData = [
    { name: 'Machines', value: stats.machines.dailyKwh },
    { name: 'Robotics', value: stats.robotics.dailyKwh },
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Energy & Sustainability</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Compare energy consumption and efficiency between machines and robotics
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Energy Comparison</AlertTitle>
        <AlertDescription>
          This page compares energy consumption, costs, and efficiency between machines and robotics.
          <strong> Lower energy = Lower costs = Better for the environment.</strong>
        </AlertDescription>
      </Alert>

      {/* WINNER BANNER */}
      <Card className={`border-2 ${
        stats.comparison.energyWinner === 'robotics' 
          ? 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-500/5' 
          : 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5'
      }`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Award className={`w-6 h-6 ${stats.comparison.energyWinner === 'robotics' ? 'text-green-400' : 'text-blue-400'}`} />
            Energy Efficiency Winner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {stats.comparison.energyWinner === 'robotics' ? (
                <Bot className="w-16 h-16 text-green-400" />
              ) : (
                <Wrench className="w-16 h-16 text-blue-400" />
              )}
              <div>
                <div className="text-3xl font-bold mb-2">
                  {stats.comparison.energyWinner === 'robotics' ? 'Robotics' : 'Machines'}
                </div>
                <div className="text-sm text-muted-foreground">
                  More energy efficient
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1 text-green-400">
                {stats.comparison.savingsPercent.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Energy Savings
              </div>
            </div>
          </div>
          {stats.comparison.savings > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">
                  Daily Savings: ${stats.comparison.savings.toFixed(2)} per day
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Using robotics saves <strong className="text-foreground">${stats.comparison.savings.toFixed(2)}</strong> daily in energy costs compared to machines-only production.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Machines Panel */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="w-5 h-5 text-blue-400" />
              Manufacturing Machines
            </CardTitle>
            <CardDescription className="text-sm">Energy consumption and costs</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">kWh/1K Bottles</div>
                <div className="text-xl font-bold">{stats.machines.kwhPer1000Bottles.toFixed(1)}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Daily kWh</div>
                <div className="text-xl font-bold">{stats.machines.dailyKwh.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Cost/Bottle</div>
                <div className="text-xl font-bold">${stats.machines.costPerBottle.toFixed(4)}</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Daily Cost</div>
                <div className="text-xl font-bold">${stats.machines.dailyCost.toFixed(2)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
                <div className="text-xl font-bold">{(stats.machines.efficiency * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Peak Load</div>
                <div className="text-xl font-bold">{stats.machines.peakLoad} kW</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Robotics Panel */}
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-green-400">
              <Bot className="w-5 h-5 text-green-400" />
              Robotics & Automation
            </CardTitle>
            <CardDescription className="text-sm">Energy consumption and costs</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">kWh/1K Bottles</div>
                <div className="text-xl font-bold text-green-400">{stats.robotics.kwhPer1000Bottles.toFixed(1)}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Daily kWh</div>
                <div className="text-xl font-bold text-green-400">{stats.robotics.dailyKwh.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Cost/Bottle</div>
                <div className="text-xl font-bold text-green-400">${stats.robotics.costPerBottle.toFixed(4)}</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Daily Cost</div>
                <div className="text-xl font-bold text-green-400">${stats.robotics.dailyCost.toFixed(2)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Efficiency</div>
                <div className="text-xl font-bold text-green-400">{(stats.robotics.efficiency * 100).toFixed(0)}%</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-xs text-muted-foreground mb-1">Peak Load</div>
                <div className="text-xl font-bold text-green-400">{stats.robotics.peakLoad} kW</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Consumption Comparison Chart */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Energy Consumption Comparison</CardTitle>
          <CardDescription className="text-sm">Side-by-side comparison of energy metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyComparisonData}>
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

      {/* Cost & Efficiency Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cost Comparison */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Cost Comparison</CardTitle>
            <CardDescription className="text-sm">Energy costs: Machines vs Robotics</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costComparisonData}>
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
                  formatter={(value: number) => `$${value.toFixed(2)}`}
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
                  ${(stats.machines.dailyCost - stats.robotics.dailyCost).toFixed(2)} less
                </strong> per day in energy costs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency Comparison */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Energy Efficiency</CardTitle>
            <CardDescription className="text-sm">Efficiency scores comparison</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={efficiencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                  formatter={(value: number) => `${value.toFixed(0)}%`}
                />
                <Bar 
                  dataKey="efficiency" 
                  fill={(entry: any) => entry.name === 'Robotics' ? '#10b981' : '#3b82f6'}
                  radius={[0, 4, 4, 0]}
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Robotics' ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">Efficiency Winner: Robotics</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Robotics are <strong className="text-foreground">
                  {((stats.robotics.efficiency - stats.machines.efficiency) / stats.machines.efficiency * 100).toFixed(0)}% more efficient
                </strong> than machines.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Energy Consumption */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Hourly Energy Consumption</CardTitle>
          <CardDescription className="text-sm">Energy usage throughout the day</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyEnergyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="hour" 
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
              <Line 
                type="monotone" 
                dataKey="machines" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Machines"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="robotics" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Robotics"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Energy Distribution */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Daily Energy Distribution</CardTitle>
          <CardDescription className="text-sm">Share of total daily energy consumption</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
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
                  formatter={(value: number) => `${value} kWh`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">Machines</span>
                </div>
                <div className="text-2xl font-bold">{stats.machines.dailyKwh} kWh</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((stats.machines.dailyKwh / stats.comparison.totalDailyKwh) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-semibold text-green-400">Robotics</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{stats.robotics.dailyKwh} kWh</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((stats.robotics.dailyKwh / stats.comparison.totalDailyKwh) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-sm font-semibold text-green-400 mb-2">Energy Efficiency Winner</div>
              <div className="text-xl font-bold mb-1">
                {stats.comparison.energyWinner === 'robotics' ? 'Robotics' : 'Machines'}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.comparison.energyWinner === 'robotics' 
                  ? `${((stats.machines.kwhPer1000Bottles - stats.robotics.kwhPer1000Bottles) / stats.machines.kwhPer1000Bottles * 100).toFixed(1)}% more efficient`
                  : 'More efficient than robotics'
                }
              </div>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-sm font-semibold text-green-400 mb-2">Daily Savings</div>
              <div className="text-xl font-bold mb-1">${stats.comparison.savings.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {stats.comparison.savingsPercent.toFixed(1)}% reduction with robotics
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="text-sm font-semibold mb-2">Total Daily Energy</div>
              <div className="text-xl font-bold mb-1">{stats.comparison.totalDailyKwh} kWh</div>
              <div className="text-xs text-muted-foreground">
                ${stats.comparison.totalDailyCost.toFixed(2)} total cost
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
