import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Activity,
  PieChart,
  LineChart,
  Target,
  Zap,
  Wrench,
  Bot,
  Sparkles,
  Cpu,
  Network
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar
} from 'recharts';

// Fixed values
const MACHINES_BOTTLES_PER_HOUR = 1350;
const ROBOTICS_BOTTLES_PER_HOUR = 980;
const TOTAL_BOTTLES_PER_HOUR = 2330;
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

// Chart data preparation
const hourlyProductionData = HOURS.map(hour => ({
  hour,
  machines: MACHINES_BOTTLES_PER_HOUR,
  robotics: ROBOTICS_BOTTLES_PER_HOUR,
  total: TOTAL_BOTTLES_PER_HOUR,
}));

const pieChartData = [
  { name: 'Machines', value: MACHINES_BOTTLES_PER_HOUR, fill: '#00f0ff' },
  { name: 'Robotics', value: ROBOTICS_BOTTLES_PER_HOUR, fill: '#ff00ff' },
];

const efficiencyData = [
  { metric: 'Production', machines: 135, robotics: 196, max: 200 },
  { metric: 'Efficiency', machines: 86, robotics: 81, max: 100 },
  { metric: 'Utilization', machines: 84, robotics: 81, max: 100 },
  { metric: 'Cost', machines: 90, robotics: 95, max: 100 },
  { metric: 'Reliability', machines: 92, robotics: 88, max: 100 },
];

const cumulativeData = HOURS.map((hour, index) => ({
  hour,
  machines: MACHINES_BOTTLES_PER_HOUR * (index + 1),
  robotics: ROBOTICS_BOTTLES_PER_HOUR * (index + 1),
  total: TOTAL_BOTTLES_PER_HOUR * (index + 1),
}));

const radialData = [
  { name: 'Machines', value: (MACHINES_BOTTLES_PER_HOUR / TOTAL_BOTTLES_PER_HOUR) * 100, fill: '#00f0ff' },
  { name: 'Robotics', value: (ROBOTICS_BOTTLES_PER_HOUR / TOTAL_BOTTLES_PER_HOUR) * 100, fill: '#ff00ff' },
];

const chartConfig = {
  machines: {
    label: 'Machines',
    color: '#00f0ff',
  },
  robotics: {
    label: 'Robotics',
    color: '#ff00ff',
  },
  total: {
    label: 'Total',
    color: '#00ff88',
  },
};

const COLORS = ['#00f0ff', '#ff00ff'];

export function FuturisticDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 min-h-screen relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 relative z-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Cpu className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            FUTURISTIC COMMAND CENTER
          </h1>
        </div>
        <p className="text-sm text-cyan-300/80">
          Advanced neural network analytics and quantum performance metrics
        </p>
      </motion.div>

      {/* Key Metrics Row with Glow Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-cyan-500/50 bg-slate-900/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-cyan-300 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                MACHINES PRODUCTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                {MACHINES_BOTTLES_PER_HOUR.toLocaleString()}
              </motion.div>
              <p className="text-xs text-cyan-300/60 mt-1">bottles/hour</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-purple-500/50 bg-slate-900/80 backdrop-blur-sm shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400" />
                ROBOTICS PRODUCTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                {ROBOTICS_BOTTLES_PER_HOUR.toLocaleString()}
              </motion.div>
              <p className="text-xs text-purple-300/60 mt-1">bottles/hour</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-green-500/50 bg-slate-900/80 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                TOTAL PRODUCTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {TOTAL_BOTTLES_PER_HOUR.toLocaleString()}
              </motion.div>
              <p className="text-xs text-green-300/60 mt-1">bottles/hour</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart Row 1: Neon Stacked Bar & Glowing Pie */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <BarChart3 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                NEURAL PRODUCTION MATRIX
              </CardTitle>
              <CardDescription className="text-cyan-300/60">Quantum stacked analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyProductionData}>
                    <defs>
                      <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#0066ff" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff00ff" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#9900ff" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00f0ff" strokeOpacity={0.2} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fill: '#00f0ff', fontSize: 12 }}
                      axisLine={{ stroke: '#00f0ff', strokeOpacity: 0.5 }}
                    />
                    <YAxis 
                      tick={{ fill: '#00f0ff', fontSize: 12 }}
                      axisLine={{ stroke: '#00f0ff', strokeOpacity: 0.5 }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-slate-900 border-cyan-500/50" />} 
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="machines" stackId="a" fill="url(#cyanGradient)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="robotics" stackId="a" fill="url(#purpleGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-purple-500/30 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-300">
                <PieChart className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]" />
                QUANTUM DISTRIBUTION
              </CardTitle>
              <CardDescription className="text-purple-300/60">Holographic production share</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          filter="url(#glow)"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-slate-900 border-purple-500/50" />} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart Row 2: Animated Line & Area Charts */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-green-500/30 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <LineChart className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
                TEMPORAL FLUX ANALYSIS
              </CardTitle>
              <CardDescription className="text-green-300/60">Chronological production vectors</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={hourlyProductionData}>
                    <defs>
                      <linearGradient id="lineCyan" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#0066ff" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="linePurple" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ff00ff" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#9900ff" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00ff88" strokeOpacity={0.2} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fill: '#00ff88', fontSize: 12 }}
                      axisLine={{ stroke: '#00ff88', strokeOpacity: 0.5 }}
                    />
                    <YAxis 
                      tick={{ fill: '#00ff88', fontSize: 12 }}
                      axisLine={{ stroke: '#00ff88', strokeOpacity: 0.5 }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-slate-900 border-green-500/50" />} 
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="machines" 
                      stroke="url(#lineCyan)" 
                      strokeWidth={4}
                      dot={{ fill: '#00f0ff', r: 6, filter: 'url(#glow)' }}
                      activeDot={{ r: 8, filter: 'url(#glow)' }}
                      animationDuration={1000}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="robotics" 
                      stroke="url(#linePurple)" 
                      strokeWidth={4}
                      strokeDasharray="5 5"
                      dot={{ fill: '#ff00ff', r: 6, filter: 'url(#glow)' }}
                      activeDot={{ r: 8, filter: 'url(#glow)' }}
                      animationDuration={1000}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-orange-500/30 shadow-[0_0_30px_rgba(255,165,0,0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-300">
                <Activity className="w-5 h-5 text-orange-400 drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]" />
                CUMULATIVE ENERGY MATRIX
              </CardTitle>
              <CardDescription className="text-orange-300/60">Accumulated production waveform</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeData}>
                    <defs>
                      <linearGradient id="areaCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="areaPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#ff00ff" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ff6600" strokeOpacity={0.2} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fill: '#ff6600', fontSize: 12 }}
                      axisLine={{ stroke: '#ff6600', strokeOpacity: 0.5 }}
                    />
                    <YAxis 
                      tick={{ fill: '#ff6600', fontSize: 12 }}
                      axisLine={{ stroke: '#ff6600', strokeOpacity: 0.5 }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-slate-900 border-orange-500/50" />} 
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="machines" 
                      stroke="#00f0ff" 
                      fillOpacity={1} 
                      fill="url(#areaCyan)" 
                      strokeWidth={3}
                      animationDuration={1000}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="robotics" 
                      stroke="#ff00ff" 
                      fillOpacity={1} 
                      fill="url(#areaPurple)" 
                      strokeWidth={3}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart Row 3: Radar & Radial Charts */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-yellow-500/30 shadow-[0_0_30px_rgba(255,255,0,0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-300">
                <Zap className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,0,0.5)]" />
                PERFORMANCE RADAR MATRIX
              </CardTitle>
              <CardDescription className="text-yellow-300/60">Multi-dimensional neural analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={efficiencyData}>
                    <PolarGrid stroke="#ffff00" strokeOpacity={0.3} />
                    <PolarAngleAxis 
                      dataKey="metric" 
                      tick={{ fill: '#ffff00', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: '#ffff00', fontSize: 9 }}
                    />
                    <Radar 
                      name="Machines" 
                      dataKey="machines" 
                      stroke="#00f0ff" 
                      fill="#00f0ff" 
                      fillOpacity={0.7}
                      strokeWidth={3}
                      filter="url(#glow)"
                    />
                    <Radar 
                      name="Robotics" 
                      dataKey="robotics" 
                      stroke="#ff00ff" 
                      fill="#ff00ff" 
                      fillOpacity={0.7}
                      strokeWidth={3}
                      filter="url(#glow)"
                    />
                    <ChartLegend />
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-slate-900 border-yellow-500/50" />} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-slate-900/80 backdrop-blur-sm border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-300">
                <Network className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                RADIAL EFFICIENCY SPHERE
              </CardTitle>
              <CardDescription className="text-indigo-300/60">Circular performance visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={radialData} startAngle={90} endAngle={-270}>
                    <RadialBar 
                      dataKey="value" 
                      cornerRadius={10} 
                      fill="#00f0ff"
                      animationDuration={1500}
                    >
                      {radialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RadialBar>
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-slate-900 border-indigo-500/50" />} 
                    />
                    <ChartLegend />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Summary Statistics with Neon Effects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm border-cyan-500/50 shadow-[0_0_40px_rgba(0,240,255,0.3)] relative z-10">
          <CardHeader>
            <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              QUANTUM PRODUCTION SUMMARY
            </CardTitle>
            <CardDescription className="text-cyan-300/60">Neural network performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <motion.div 
                className="text-center p-4 bg-slate-900/60 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0_0_25px_rgba(0,240,255,0.5)' }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {((MACHINES_BOTTLES_PER_HOUR / TOTAL_BOTTLES_PER_HOUR) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-cyan-300/60 mt-1">MACHINES SHARE</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-slate-900/60 rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0_0_25px_rgba(255,0,255,0.5)' }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {((ROBOTICS_BOTTLES_PER_HOUR / TOTAL_BOTTLES_PER_HOUR) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-purple-300/60 mt-1">ROBOTICS SHARE</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-slate-900/60 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0_0_25px_rgba(0,255,136,0.5)' }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  {(TOTAL_BOTTLES_PER_HOUR * 8).toLocaleString()}
                </div>
                <div className="text-sm text-green-300/60 mt-1">8-HOUR TOTAL</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-slate-900/60 rounded-lg border border-orange-500/30 shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                whileHover={{ scale: 1.05, boxShadow: '0_0_25px_rgba(255,165,0,0.5)' }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  {(MACHINES_BOTTLES_PER_HOUR - ROBOTICS_BOTTLES_PER_HOUR).toLocaleString()}
                </div>
                <div className="text-sm text-orange-300/60 mt-1">DIFFERENTIAL</div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
