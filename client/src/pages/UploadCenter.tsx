import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowRight, Download, Database, Sparkles, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

interface UploadHistory {
  id: string;
  ts: string;
  uploadType: string;
  filename: string;
  rowCount: number;
  status: 'ok' | 'error';
}

interface Dataset {
  id: string;
  name: string;
  type: string;
  filename: string;
  rowCount: number;
  status: string;
  uploadedAt: string;
  description: string | null;
  tags?: string[];
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
  const queryClient = useQueryClient();

  const { data: history, isLoading: historyLoading } = useQuery<UploadHistory[]>({
    queryKey: ['/api/upload/history'],
  });

  const { data: datasets, isLoading: datasetsLoading } = useQuery<Dataset[]>({
    queryKey: ['/api/datasets'],
  });

  const generateDemoMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/datasets/generate-demo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/upload/history'] });
      toast({
        title: 'Demo Data Generated',
        description: 'Unified dataset generated and model trained successfully.',
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/upload/history'] });
      setSelectedFile(null);
      setStep(1);
      toast({
        title: 'Upload Successful',
        description: 'CSV file uploaded and processed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Failed to upload CSV file',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStep(2);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  if (historyLoading || datasetsLoading) {
    return <PageSkeleton />;
  }

  const mockHistory: UploadHistory[] = history || [];
  const datasetList: Dataset[] = datasets || [];

  const successCount = mockHistory.filter(h => h.status === 'ok').length;
  const totalRows = datasetList.reduce((acc, d) => acc + d.rowCount, 0);

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

  const datasetColumns = [
    {
      key: 'name',
      header: 'Dataset Name',
      sortable: true,
      render: (ds: Dataset) => (
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{ds.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (ds: Dataset) => (
        <Badge variant="outline">{ds.type.toUpperCase()}</Badge>
      ),
    },
    {
      key: 'rowCount',
      header: 'Rows',
      sortable: true,
      render: (ds: Dataset) => <span className="font-mono">{ds.rowCount.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (ds: Dataset) => (
        <Badge variant={ds.status === 'active' ? 'default' : 'outline'}>
          {ds.status}
        </Badge>
      ),
    },
    {
      key: 'uploadedAt',
      header: 'Uploaded',
      sortable: true,
      render: (ds: Dataset) => new Date(ds.uploadedAt).toLocaleDateString(),
    },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      production: 'bg-blue-500/10 text-blue-400',
      robotics: 'bg-purple-500/10 text-purple-400',
      maintenance: 'bg-orange-500/10 text-orange-400',
      quality: 'bg-yellow-500/10 text-yellow-400',
      energy: 'bg-green-500/10 text-green-400',
      orders: 'bg-pink-500/10 text-pink-400',
      sensors: 'bg-cyan-500/10 text-cyan-400',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Upload Center</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload CSV files, manage datasets, and view all synthetic data
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How Upload Center Works</AlertTitle>
        <AlertDescription>
          Upload your CSV files or generate demo data to train ML models.
          <br />
          • <strong>Upload CSV:</strong> Drag & drop your data file. The system auto-detects what type it is.
          <br />
          • <strong>Generate Demo Data:</strong> Creates a unified dataset with 2000 rows of realistic factory data
          <br />
          • <strong>Synthetic Data:</strong> View all datasets currently being used by the system
          <br />
          • <strong>After Upload:</strong> Data is automatically used to train ML models for better predictions
        </AlertDescription>
      </Alert>

      <KPIGrid>
        <KPIChip
          label="Total Datasets"
          value={datasetList.length}
          icon={<Database className="w-5 h-5" />}
        />
        <KPIChip
          label="Total Rows"
          value={totalRows.toLocaleString()}
          icon={<FileSpreadsheet className="w-5 h-5" />}
        />
        <KPIChip
          label="Successful Uploads"
          value={successCount}
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Synthetic Data"
          value={datasetList.filter(d => d.tags && d.tags.includes('unified')).length}
          icon={<Sparkles className="w-5 h-5" />}
        />
      </KPIGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/30">
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="datasets">Synthetic Data</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6 space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Generate Demo Data</CardTitle>
              <CardDescription>Create unified dataset for ML training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => generateDemoMutation.mutate()}
                disabled={generateDemoMutation.isPending}
                className="w-full"
                variant="outline"
              >
                {generateDemoMutation.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Unified Dataset
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Generates a comprehensive unified dataset (2000 rows) with all machine features, sensors, production metrics, quality data, energy consumption, and failure labels for logistic regression training.
              </p>
            </CardContent>
          </Card>

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
                      <SelectTrigger>
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
                    <Button onClick={() => setStep(3)}>
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
                    <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                      {uploadMutation.isPending ? 'Uploading...' : 'Import Data'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="datasets" className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">All Synthetic Data</CardTitle>
              <CardDescription>Datasets currently being used by the system</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {datasetList.length === 0 ? (
                <div className="p-8 text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">No datasets found</p>
                  <Button onClick={() => generateDemoMutation.mutate()} variant="outline">
                    Generate Demo Data
                  </Button>
                </div>
              ) : (
                <DataTable
                  data={datasetList}
                  columns={datasetColumns}
                  emptyMessage="No datasets found"
                />
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
      </Tabs>
    </div>
  );
}
