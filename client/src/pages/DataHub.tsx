import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Trash2, Sparkles, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { DataTable } from '@/components/DataTable';

interface Dataset {
  id: string;
  name: string;
  type: string;
  filename: string;
  rowCount: number;
  status: string;
  uploadedAt: string;
  description: string | null;
}

export function DataHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ['/api/datasets'],
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
      setSelectedFile(null);
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

  const generateDemoMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/datasets/generate-demo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      toast({
        title: 'Demo Data Generated',
        description: '7 demo datasets have been generated successfully.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/datasets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      toast({
        title: 'Dataset Deleted',
        description: 'Dataset has been removed successfully.',
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid File',
        description: 'Please select a CSV file.',
      });
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  const datasetList = datasets || [];

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
        <Badge className={getTypeColor(ds.type)}>
          {ds.type.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'rowCount',
      header: 'Rows',
      sortable: true,
      render: (ds: Dataset) => (
        <span className="font-mono text-sm">{ds.rowCount?.toLocaleString() || 0}</span>
      ),
    },
    {
      key: 'uploadedAt',
      header: 'Uploaded',
      sortable: true,
      render: (ds: Dataset) => (
        <span className="text-sm text-muted-foreground">
          {new Date(ds.uploadedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (ds: Dataset) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // Preview dataset
              window.location.href = `/app/data-hub/${ds.id}`;
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => deleteMutation.mutate(ds.id)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
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
          <Database className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Data Hub</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload, manage, and analyze datasets for ML model training and analytics
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How Data Hub Works</AlertTitle>
        <AlertDescription>
          Upload your factory data (CSV files) to train AI models, or generate demo data to get started.
          <br />
          • <strong>Upload CSV:</strong> Drag & drop your data file. The system auto-detects what type it is.
          <br />
          • <strong>Generate Demo Data:</strong> Creates a unified dataset with 2000 rows of realistic factory data
          <br />
          • <strong>Dataset Types:</strong> Production, Robotics, Maintenance, Quality, Energy, Sensors
          <br />
          • <strong>After Upload:</strong> Data is automatically used to train ML models for better predictions
          <br />
          The unified dataset includes machine sensors, production metrics, quality data, and failure labels.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Upload CSV</CardTitle>
            <CardDescription>
              Upload CSV files with auto-detection and schema validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button variant="outline" asChild>
                  <span>Select CSV File</span>
                </Button>
              </label>
              {selectedFile && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected: {selectedFile.name}
                  </p>
                  <Button
                    onClick={handleUpload}
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? 'Uploading...' : 'Upload & Process'}
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>AI auto-detection will identify dataset type automatically</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Generate Demo Data</CardTitle>
            <CardDescription>
              Quickly generate realistic demo datasets for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => generateDemoMutation.mutate()}
              disabled={generateDemoMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {generateDemoMutation.isPending ? 'Generating...' : 'Generate Unified Dataset'}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Generates a comprehensive unified dataset (2000 rows) with all machine features, sensors, production metrics, quality data, energy consumption, and failure labels for logistic regression training.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Datasets</CardTitle>
          <CardDescription>
            {datasetList.length} dataset{datasetList.length !== 1 ? 's' : ''} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={datasetList}
            columns={datasetColumns}
            emptyMessage="No datasets found. Upload a CSV file or generate demo data to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
}
