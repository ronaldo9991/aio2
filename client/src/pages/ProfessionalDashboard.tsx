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
  Bot
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
  Radar
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
  { name: 'Machines', value: MACHINES_BOTTLES_PER_HOUR, fill: '#3b82f6' },
  { name: 'Robotics', value: ROBOTICS_BOTTLES_PER_HOUR, fill: '#a855f7' },
];

const efficiencyData = [
  { metric: 'Production Rate', machines: 135, robotics: 196, max: 200 },
  { metric: 'Efficiency', machines: 86, robotics: 81, max: 100 },
  { metric: 'Utilization', machines: 84, robotics: 81, max: 100 },
  { metric: 'Cost Efficiency', machines: 90, robotics: 95, max: 100 },
  { metric: 'Reliability', machines: 92, robotics: 88, max: 100 },
];

const cumulativeData = HOURS.map((hour, index) => ({
  hour,
  machines: MACHINES_BOTTLES_PER_HOUR * (index + 1),
  robotics: ROBOTICS_BOTTLES_PER_HOUR * (index + 1),
  total: TOTAL_BOTTLES_PER_HOUR * (index + 1),
}));

const chartConfig = {
  machines: {
    label: 'Machines',
    color: '#3b82f6',
  },
  robotics: {
    label: 'Robotics',
    color: '#a855f7',
  },
  total: {
    label: 'Total',
    color: '#10b981',
  },
};

const COLORS = ['#3b82f6', '#a855f7'];

export function ProfessionalDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Professional Command Center</h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Comprehensive production analytics and performance metrics dashboard
        </p>
      </motion.div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Machines Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {MACHINES_BOTTLES_PER_HOUR.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">bottles per hour</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Robotics Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {ROBOTICS_BOTTLES_PER_HOUR.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">bottles per hour</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 bg-white dark:bg-slate-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Total Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {TOTAL_BOTTLES_PER_HOUR.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">bottles per hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Row 1: Stacked Bar Chart & Pie Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Hourly Production Breakdown
            </CardTitle>
            <CardDescription>Stacked bar chart showing machines vs robotics production</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="machines" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="robotics" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Production Distribution
            </CardTitle>
            <CardDescription>Pie chart showing production share by system type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Chart Row 2: Line Chart & Area Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-600 dark:text-green-400" />
              Production Trend Analysis
            </CardTitle>
            <CardDescription>Line chart comparing machines and robotics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={hourlyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="machines" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="robotics" 
                    stroke="#a855f7" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#a855f7', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              Cumulative Production
            </CardTitle>
            <CardDescription>Area chart showing cumulative production throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cumulativeData}>
                  <defs>
                    <linearGradient id="colorMachines" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRobotics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="machines" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorMachines)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="robotics" 
                    stroke="#a855f7" 
                    fillOpacity={1} 
                    fill="url(#colorRobotics)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Chart Row 3: Radar Chart & Grouped Bar Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              Performance Radar
            </CardTitle>
            <CardDescription>Multi-dimensional performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={efficiencyData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Radar 
                    name="Machines" 
                    dataKey="machines" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Radar 
                    name="Robotics" 
                    dataKey="robotics" 
                    stroke="#a855f7" 
                    fill="#a855f7" 
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <ChartLegend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Side-by-Side Comparison
            </CardTitle>
            <CardDescription>Grouped bar chart for direct comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="machines" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="robotics" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Production Summary</CardTitle>
          <CardDescription>Key performance indicators and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {((MACHINES_BOTTLES_PER_HOUR / TOTAL_BOTTLES_PER_HOUR) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Machines Share</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {((ROBOTICS_BOTTLES_PER_HOUR / TOTAL_BOTTLES_PER_HOUR) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Robotics Share</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(TOTAL_BOTTLES_PER_HOUR * 8).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">8-Hour Total</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {(MACHINES_BOTTLES_PER_HOUR - ROBOTICS_BOTTLES_PER_HOUR).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">Difference</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
