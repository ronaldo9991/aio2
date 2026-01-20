import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  TestTube2, 
  AlertCircle,
  Target,
  Info,
  CheckCircle2,
  XCircle,
  Wrench,
  Bot
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
  const goodCount = mockMeasurements.length - defectCount;
  
  // Separate by machines and robotics
  const machineMeasurements = mockMeasurements.filter(m => m.machineId.startsWith('M-'));
  const robotMeasurements = mockMeasurements.filter(m => m.machineId.startsWith('R-'));
  const machineDefects = machineMeasurements.filter(m => m.defectLabel).length;
  const robotDefects = robotMeasurements.filter(m => m.defectLabel).length;
  
  const avgWeight = mockMeasurements.reduce((acc, m) => acc + m.bottleWeightG, 0) / mockMeasurements.length;
  const avgThickness = mockMeasurements.reduce((acc, m) => acc + m.wallThicknessMm, 0) / mockMeasurements.length;

  // Quality specifications
  const weightMin = 24.0;
  const weightMax = 26.0;
  const thicknessMin = 0.40;
  const thicknessMax = 0.46;

  const columns = [
    { 
      key: 'machineId', 
      header: 'Machine/Robot', 
      sortable: true,
      render: (m: QualityMeasurement) => (
        <div className="flex items-center gap-2">
          {m.machineId.startsWith('R-') ? (
            <Bot className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <Wrench className="w-3.5 h-3.5 text-blue-400" />
          )}
          <span className="font-mono text-sm">{m.machineId}</span>
        </div>
      ),
    },
    {
      key: 'ts',
      header: 'Time',
      sortable: true,
      render: (m: QualityMeasurement) => new Date(m.ts).toLocaleTimeString(),
    },
    {
      key: 'bottleWeightG',
      header: 'Weight',
      sortable: true,
      render: (m: QualityMeasurement) => {
        const isGood = m.bottleWeightG >= weightMin && m.bottleWeightG <= weightMax;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm ${isGood ? '' : 'text-yellow-400'}`}>
              {m.bottleWeightG.toFixed(1)}g
            </span>
            {isGood ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-yellow-400" />
            )}
          </div>
        );
      },
    },
    {
      key: 'wallThicknessMm',
      header: 'Thickness',
      sortable: true,
      render: (m: QualityMeasurement) => {
        const isGood = m.wallThicknessMm >= thicknessMin && m.wallThicknessMm <= thicknessMax;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm ${isGood ? '' : 'text-yellow-400'}`}>
              {m.wallThicknessMm.toFixed(2)}mm
            </span>
            {isGood ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-yellow-400" />
            )}
          </div>
        );
      },
    },
    {
      key: 'defectLabel',
      header: 'Status',
      render: (m: QualityMeasurement) => (
        m.defectLabel ? (
          <Badge variant="destructive" className="text-xs">
            {m.defectLabel.replace('_', ' ')}
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-green-400 border-green-500/20">
            ✓ Good
          </Badge>
        )
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
          <TestTube2 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Quality Control</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitor bottle quality and detect defects in real-time
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How Quality Control Works</AlertTitle>
        <AlertDescription>
          This page monitors every bottle produced by machines and robotics to ensure they meet quality standards.
          <br />
          <strong>Quality Breakdown:</strong> Machines have {machineDefects} defects per 100 bottles, Robotics have {robotDefects} defects per 100 bottles.
          <br />
          <strong>Weight:</strong> Must be between {weightMin}g and {weightMax}g
          <br />
          <strong>Wall Thickness:</strong> Must be between {thicknessMin}mm and {thicknessMax}mm
          <br />
          <strong>Defect Rate:</strong> Shows what percentage of bottles have problems. Lower is better!
        </AlertDescription>
      </Alert>

      <KPIGrid>
        <KPIChip
          label="Good Bottles"
          value={goodCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Total Defects"
          value={defectCount}
          icon={<XCircle className="w-5 h-5" />}
          variant={defectCount > 0 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Defect Rate"
          value={`${(defectRate * 100).toFixed(1)}%`}
          icon={<AlertCircle className="w-5 h-5" />}
          variant={defectRate > 0.05 ? 'danger' : defectRate > 0.02 ? 'warning' : 'success'}
        />
        <KPIChip
          label="Machine Defects"
          value={machineDefects}
          icon={<Wrench className="w-5 h-5" />}
          variant={machineDefects > 0 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Robot Defects"
          value={robotDefects}
          icon={<Bot className="w-5 h-5" />}
          variant="success"
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

      {/* Quality Breakdown Card */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Quality Breakdown: Machines vs Robotics</CardTitle>
          <CardDescription>Defect analysis by production system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <span className="text-base font-semibold text-blue-400">Machines</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Per 100 Bottles: <strong className="text-foreground">100 measurements</strong></div>
                <div>Defects Found: <strong className="text-yellow-400">{machineDefects}</strong></div>
                <div>Defect Rate: <strong className="text-yellow-400">{machineDefects} per 100 bottles</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <span className="text-base font-semibold text-purple-400">Robotics</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Per 100 Bottles: <strong className="text-foreground">100 measurements</strong></div>
                <div>Defects Found: <strong className="text-green-400">{robotDefects}</strong></div>
                <div>Defect Rate: <strong className="text-green-400">{robotDefects} per 100 bottles</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-base font-semibold text-green-400">Summary</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Machines:</strong> <strong className="text-yellow-400">{machineDefects} defects per 100 bottles</strong>
                <br />
                <strong className="text-foreground">Robotics:</strong> <strong className="text-green-400">{robotDefects} defects per 100 bottles</strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Quality Standards</CardTitle>
            <CardDescription>Acceptable ranges for bottle measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Bottle Weight</span>
                  <Badge variant="outline" className="text-xs">
                    {weightMin}g - {weightMax}g
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Bottles outside this range are too light or too heavy
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Wall Thickness</span>
                  <Badge variant="outline" className="text-xs">
                    {thicknessMin}mm - {thicknessMax}mm
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Too thin = weak bottle, too thick = waste of material
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-sm text-green-400">Current Status</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {defectRate < 0.02 
                    ? "✅ Excellent quality! Defect rate is very low."
                    : defectRate < 0.05
                    ? "⚠️ Good quality, but watch for trends."
                    : "❌ Quality issues detected. Review machines and processes."
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Defect Types</CardTitle>
            <CardDescription>Common problems found in production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defectCount === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <p className="text-sm text-muted-foreground">No defects found! All bottles are good quality.</p>
                </div>
              ) : (
                <>
                  {[
                    { type: 'thin_wall', label: 'Thin Wall', description: 'Wall is too thin, bottle may break easily', count: mockMeasurements.filter(m => m.defectLabel === 'thin_wall').length },
                    { type: 'overweight', label: 'Overweight', description: 'Bottle weighs too much, wasting material', count: mockMeasurements.filter(m => m.defectLabel === 'overweight').length },
                    { type: 'surface_flaw', label: 'Surface Flaw', description: 'Visual defect on bottle surface', count: mockMeasurements.filter(m => m.defectLabel === 'surface_flaw').length },
                  ].filter(d => d.count > 0).map((defect) => (
                    <div key={defect.type} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{defect.label}</span>
                        <Badge variant="destructive" className="text-xs">
                          {defect.count} found
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {defect.description}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Recent Quality Measurements</CardTitle>
          <CardDescription>
            Latest bottle inspections from production line
          </CardDescription>
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
