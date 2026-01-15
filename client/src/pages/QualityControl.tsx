import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  TestTube2, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { PageSkeleton } from '@/components/Skeleton';

interface QualityMeasurement {
  id: string;
  machineId: string;
  ts: string;
  bottleWeightG: number;
  wallThicknessMm: number;
  defectLabel: string | null;
}

export function QualityControl() {
  const { data: measurements, isLoading } = useQuery<QualityMeasurement[]>({
    queryKey: ['/api/quality/measurements'],
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockMeasurements: QualityMeasurement[] = measurements || [
    { id: '1', machineId: 'M-001', ts: '2025-01-15T08:30:00Z', bottleWeightG: 24.8, wallThicknessMm: 0.42, defectLabel: null },
    { id: '2', machineId: 'M-001', ts: '2025-01-15T09:00:00Z', bottleWeightG: 25.1, wallThicknessMm: 0.44, defectLabel: null },
    { id: '3', machineId: 'M-002', ts: '2025-01-15T08:45:00Z', bottleWeightG: 24.5, wallThicknessMm: 0.39, defectLabel: 'thin_wall' },
    { id: '4', machineId: 'M-002', ts: '2025-01-15T09:15:00Z', bottleWeightG: 25.3, wallThicknessMm: 0.43, defectLabel: null },
    { id: '5', machineId: 'M-003', ts: '2025-01-15T08:20:00Z', bottleWeightG: 26.2, wallThicknessMm: 0.48, defectLabel: 'overweight' },
  ];

  const defectCount = mockMeasurements.filter(m => m.defectLabel).length;
  const defectRate = defectCount / mockMeasurements.length;
  const avgWeight = mockMeasurements.reduce((acc, m) => acc + m.bottleWeightG, 0) / mockMeasurements.length;
  const avgThickness = mockMeasurements.reduce((acc, m) => acc + m.wallThicknessMm, 0) / mockMeasurements.length;

  const columns = [
    { key: 'machineId', header: 'Machine', sortable: true },
    {
      key: 'ts',
      header: 'Timestamp',
      sortable: true,
      render: (m: QualityMeasurement) => new Date(m.ts).toLocaleString(),
    },
    {
      key: 'bottleWeightG',
      header: 'Weight (g)',
      sortable: true,
      render: (m: QualityMeasurement) => {
        const isOutOfSpec = m.bottleWeightG < 24 || m.bottleWeightG > 26;
        return (
          <span className={`font-mono ${isOutOfSpec ? 'text-yellow-400' : ''}`}>
            {m.bottleWeightG.toFixed(1)}
          </span>
        );
      },
    },
    {
      key: 'wallThicknessMm',
      header: 'Thickness (mm)',
      sortable: true,
      render: (m: QualityMeasurement) => {
        const isOutOfSpec = m.wallThicknessMm < 0.40 || m.wallThicknessMm > 0.46;
        return (
          <span className={`font-mono ${isOutOfSpec ? 'text-yellow-400' : ''}`}>
            {m.wallThicknessMm.toFixed(2)}
          </span>
        );
      },
    },
    {
      key: 'defectLabel',
      header: 'Defect',
      render: (m: QualityMeasurement) => (
        m.defectLabel ? (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400">
            {m.defectLabel}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">None</span>
        )
      ),
    },
  ];

  const spcData = [
    { time: '08:00', value: 24.8 },
    { time: '08:15', value: 25.1 },
    { time: '08:30', value: 24.9 },
    { time: '08:45', value: 25.2 },
    { time: '09:00', value: 24.7 },
    { time: '09:15', value: 25.4 },
    { time: '09:30', value: 25.0 },
    { time: '09:45', value: 25.3 },
  ];

  const ucl = 26;
  const lcl = 24;
  const cl = 25;

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Quality Control</h1>
        <p className="text-sm text-muted-foreground">Statistical process control and defect tracking</p>
      </motion.div>

      <KPIGrid>
        <KPIChip
          label="Total Samples"
          value={mockMeasurements.length}
          icon={<TestTube2 className="w-5 h-5" />}
        />
        <KPIChip
          label="Defect Rate"
          value={`${(defectRate * 100).toFixed(1)}%`}
          icon={<AlertCircle className="w-5 h-5" />}
          variant={defectRate > 0.05 ? 'warning' : 'success'}
        />
        <KPIChip
          label="Avg Weight"
          value={`${avgWeight.toFixed(1)}g`}
          icon={<Target className="w-5 h-5" />}
        />
        <KPIChip
          label="Avg Thickness"
          value={`${avgThickness.toFixed(2)}mm`}
          icon={<Target className="w-5 h-5" />}
        />
      </KPIGrid>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">SPC Chart - Weight</CardTitle>
            <CardDescription>X-bar control chart with ±3σ limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-48">
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground py-2">
                <span>{ucl}g (UCL)</span>
                <span>{cl}g (CL)</span>
                <span>{lcl}g (LCL)</span>
              </div>
              
              <div className="absolute left-12 right-0 top-0 bottom-0">
                <div className="absolute top-[10%] left-0 right-0 h-px bg-red-500/30 border-dashed" />
                <div className="absolute top-[50%] left-0 right-0 h-px bg-primary/50" />
                <div className="absolute top-[90%] left-0 right-0 h-px bg-red-500/30 border-dashed" />
                
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="hsl(199, 89%, 48%)"
                    strokeWidth="2"
                    points={spcData.map((d, i) => {
                      const x = (i / (spcData.length - 1)) * 100;
                      const y = 90 - ((d.value - lcl) / (ucl - lcl)) * 80;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                  />
                  {spcData.map((d, i) => {
                    const x = (i / (spcData.length - 1)) * 100;
                    const y = 90 - ((d.value - lcl) / (ucl - lcl)) * 80;
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
            
            <div className="flex justify-between text-xs text-muted-foreground mt-2 pl-12">
              {spcData.map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Defect Distribution</CardTitle>
            <CardDescription>Breakdown by defect type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'thin_wall', count: 3, percentage: 40 },
                { type: 'overweight', count: 2, percentage: 27 },
                { type: 'surface_flaw', count: 1, percentage: 13 },
                { type: 'other', count: 1, percentage: 20 },
              ].map((defect, i) => (
                <div key={defect.type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize">{defect.type.replace('_', ' ')}</span>
                    <span className="font-mono">{defect.count} ({defect.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${defect.percentage}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Measurements</CardTitle>
          <CardDescription>Quality data from production</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={mockMeasurements}
            columns={columns}
            emptyMessage="No measurements found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
