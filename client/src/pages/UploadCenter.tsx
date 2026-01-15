import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';

interface UploadHistory {
  id: string;
  ts: string;
  uploadType: string;
  filename: string;
  rowCount: number;
  status: 'ok' | 'error';
}

type UploadType = 'jobs' | 'sensors' | 'quality';

const uploadTypeConfig: Record<UploadType, { label: string; requiredFields: string[] }> = {
  jobs: {
    label: 'Jobs',
    requiredFields: ['product_size', 'quantity', 'due_date', 'priority', 'processing_time_min', 'required_machine_type'],
  },
  sensors: {
    label: 'Sensor Readings',
    requiredFields: ['machine_id', 'ts', 'vibration', 'temperature', 'air_pressure', 'cycle_time'],
  },
  quality: {
    label: 'Quality Measurements',
    requiredFields: ['machine_id', 'ts', 'bottle_weight_g', 'wall_thickness_mm', 'defect_label'],
  },
};

export function UploadCenter() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadType, setUploadType] = useState<UploadType>('jobs');
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: history, isLoading } = useQuery<UploadHistory[]>({
    queryKey: ['/api/upload/history'],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStep(2);
    }
  };

  const handleUpload = () => {
    toast({
      title: 'Upload Complete',
      description: `Successfully imported ${selectedFile?.name}`,
    });
    setStep(1);
    setSelectedFile(null);
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockHistory: UploadHistory[] = history || [
    { id: '1', ts: '2025-01-15T10:00:00Z', uploadType: 'jobs', filename: 'january_jobs.csv', rowCount: 45, status: 'ok' },
    { id: '2', ts: '2025-01-14T16:30:00Z', uploadType: 'sensors', filename: 'sensor_data_week2.csv', rowCount: 1250, status: 'ok' },
    { id: '3', ts: '2025-01-14T09:15:00Z', uploadType: 'quality', filename: 'quality_batch_5.csv', rowCount: 380, status: 'ok' },
    { id: '4', ts: '2025-01-13T14:00:00Z', uploadType: 'jobs', filename: 'rush_orders.csv', rowCount: 0, status: 'error' },
    { id: '5', ts: '2025-01-12T11:45:00Z', uploadType: 'sensors', filename: 'machine_readings.csv', rowCount: 892, status: 'ok' },
  ];

  const successCount = mockHistory.filter(h => h.status === 'ok').length;
  const totalRows = mockHistory.reduce((acc, h) => acc + h.rowCount, 0);

  const historyColumns = [
    {
      key: 'ts',
      header: 'Date',
      sortable: true,
      render: (h: UploadHistory) => new Date(h.ts).toLocaleString(),
    },
    { key: 'uploadType', header: 'Type', sortable: true },
    { key: 'filename', header: 'Filename' },
    {
      key: 'rowCount',
      header: 'Rows',
      sortable: true,
      render: (h: UploadHistory) => <span className="font-mono">{h.rowCount.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (h: UploadHistory) => (
        h.status === 'ok' ? (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Success
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            Error
          </span>
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
        <h1 className="text-2xl font-bold mb-1">Upload Center</h1>
        <p className="text-sm text-muted-foreground">Import data from CSV files</p>
      </motion.div>

      <KPIGrid>
        <KPIChip
          label="Total Uploads"
          value={mockHistory.length}
          icon={<Upload className="w-5 h-5" />}
        />
        <KPIChip
          label="Successful"
          value={successCount}
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Total Rows"
          value={totalRows.toLocaleString()}
          icon={<FileSpreadsheet className="w-5 h-5" />}
        />
      </KPIGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="upload" data-testid="tab-upload">Upload</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Upload Wizard</CardTitle>
              <CardDescription>Step {step} of 3: {step === 1 ? 'Select File' : step === 2 ? 'Map Columns' : 'Review & Import'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {s}
                    </div>
                    {s < 3 && (
                      <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Type</Label>
                    <Select value={uploadType} onValueChange={(v) => setUploadType(v as UploadType)}>
                      <SelectTrigger data-testid="select-upload-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jobs">Jobs</SelectItem>
                        <SelectItem value="sensors">Sensor Readings</SelectItem>
                        <SelectItem value="quality">Quality Measurements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Required Fields</Label>
                    <div className="flex flex-wrap gap-2">
                      {uploadTypeConfig[uploadType].requiredFields.map((field) => (
                        <span key={field} className="px-2 py-1 rounded bg-muted text-xs font-mono">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop a CSV file, or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                      data-testid="input-file"
                    />
                  </div>
                </div>
              )}

              {step === 2 && selectedFile && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                    <FileSpreadsheet className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Column Mapping</Label>
                    {uploadTypeConfig[uploadType].requiredFields.map((field) => (
                      <div key={field} className="flex items-center gap-4">
                        <span className="text-sm font-mono w-40">{field}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Select defaultValue={field}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={field}>{field}</SelectItem>
                            <SelectItem value={`column_${field}`}>column_{field}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} data-testid="button-next-step">
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Ready to Import</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name} • {uploadTypeConfig[uploadType].label}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleUpload} className="ocean-glow-sm" data-testid="button-import">
                      Import Data
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Upload History</CardTitle>
              <CardDescription>Previous data imports</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                data={mockHistory}
                columns={historyColumns}
                emptyMessage="No upload history"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            {(['jobs', 'sensors', 'quality'] as UploadType[]).map((type) => (
              <Card key={type} className="border-border/50 bg-card/50 hover-elevate">
                <CardHeader>
                  <CardTitle className="text-base capitalize">{type}</CardTitle>
                  <CardDescription>Download template CSV</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2" data-testid={`button-download-${type}`}>
                    <Download className="w-4 h-4" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
