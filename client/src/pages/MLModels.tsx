import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Play, CheckCircle2, Clock, Archive, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { DataTable } from '@/components/DataTable';

interface MLModel {
  id: string;
  name: string;
  type: string;
  version: number;
  status: string;
  metricsJson: any;
  featureImportanceJson: any;
  trainedAt: string | null;
}

export function MLModels() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: models, isLoading } = useQuery<MLModel[]>({
    queryKey: ['/api/models'],
  });

  const trainMutation = useMutation({
    mutationFn: async (modelName: string) => {
      return apiRequest('POST', `/models/train/${modelName}`, {
        datasetId: null,
        config: {},
      });
    },
    onSuccess: (_, modelName) => {
      queryClient.invalidateQueries({ queryKey: ['/api/models'] });
      toast({
        title: 'Training Started',
        description: `${modelName} model training has been initiated.`,
      });
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const modelList = models || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'training':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'draft':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'forecast':
        return 'Forecasting';
      case 'classification':
        return 'Classification';
      case 'anomaly':
        return 'Anomaly Detection';
      default:
        return type;
    }
  };

  const modelColumns = [
    {
      key: 'name',
      header: 'Model Name',
      sortable: true,
      render: (model: MLModel) => (
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{model.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (model: MLModel) => (
        <Badge variant="outline">{getTypeLabel(model.type)}</Badge>
      ),
    },
    {
      key: 'version',
      header: 'Version',
      render: (model: MLModel) => (
        <span className="font-mono text-sm">v{model.version}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (model: MLModel) => (
        <Badge className={getStatusColor(model.status)}>
          {model.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'metrics',
      header: 'Metrics',
      render: (model: MLModel) => {
        if (!model.metricsJson) return <span className="text-muted-foreground">-</span>;
        const metrics = model.metricsJson;
        return (
          <div className="flex items-center gap-4 text-sm">
            {metrics.accuracy && (
              <span>Acc: {(metrics.accuracy * 100).toFixed(1)}%</span>
            )}
            {metrics.precision && (
              <span>Prec: {(metrics.precision * 100).toFixed(1)}%</span>
            )}
            {metrics.recall && (
              <span>Rec: {(metrics.recall * 100).toFixed(1)}%</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (model: MLModel) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => trainMutation.mutate(model.name)}
          disabled={trainMutation.isPending || model.status === 'training'}
        >
          {model.status === 'training' ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Training...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Train
            </>
          )}
        </Button>
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
          <Brain className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">ML Models Lab</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Train, evaluate, and manage machine learning models for predictive analytics
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How ML Models Work</AlertTitle>
        <AlertDescription>
          Machine Learning models learn from your factory data to make predictions.
          <br />
          • <strong>Failure Risk Classifier:</strong> Predicts which machines will break (uses logistic regression)
          <br />
          • <strong>Throughput Forecaster:</strong> Predicts how many bottles you'll produce
          <br />
          • <strong>Quality Anomaly Detector:</strong> Finds unusual quality problems
          <br />
          • <strong>Accuracy:</strong> How often the model is correct (higher = better, aim for 85%+)
          <br />
          Click "Train" to teach the model with your latest data. Training takes 1-2 minutes.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modelList.filter(m => m.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modelList.filter(m => m.status === 'training').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modelList.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Machine Learning Models</CardTitle>
          <CardDescription>
            Manage and train ML models for failure prediction, forecasting, and anomaly detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={modelList}
            columns={modelColumns}
            emptyMessage="No ML models found. Train a model to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
}
