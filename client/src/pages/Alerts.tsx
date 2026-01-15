import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, Bell, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

interface Alert {
  id: string;
  ts: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  type: string;
  entityType: string;
  entityId: string;
  message: string;
  acknowledgedBy: string | null;
  acknowledgedAt: string | null;
}

export function Alerts() {
  const { toast } = useToast();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['/api/alerts'],
  });

  const ackMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('POST', `/alerts/${alertId}/ack`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: 'Alert Acknowledged',
        description: 'The alert has been marked as acknowledged.',
      });
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockAlerts: Alert[] = alerts || [
    { id: '1', ts: '2025-01-15T10:30:00Z', severity: 'CRITICAL', type: 'MACHINE_FAILURE', entityType: 'machine', entityId: 'M-003', message: 'High vibration detected - potential bearing failure', acknowledgedBy: null, acknowledgedAt: null },
    { id: '2', ts: '2025-01-15T10:15:00Z', severity: 'WARNING', type: 'QUALITY_DRIFT', entityType: 'machine', entityId: 'M-002', message: 'Wall thickness approaching UCL', acknowledgedBy: null, acknowledgedAt: null },
    { id: '3', ts: '2025-01-15T09:45:00Z', severity: 'INFO', type: 'SCHEDULE', entityType: 'job', entityId: 'J-015', message: 'Job priority automatically upgraded due to due date', acknowledgedBy: 'admin', acknowledgedAt: '2025-01-15T10:00:00Z' },
    { id: '4', ts: '2025-01-15T09:30:00Z', severity: 'WARNING', type: 'MAINTENANCE', entityType: 'machine', entityId: 'M-005', message: 'Scheduled maintenance due in 24 hours', acknowledgedBy: null, acknowledgedAt: null },
    { id: '5', ts: '2025-01-15T09:00:00Z', severity: 'INFO', type: 'SYSTEM', entityType: 'system', entityId: 'orchestrator', message: 'Orchestrator run completed successfully', acknowledgedBy: 'admin', acknowledgedAt: '2025-01-15T09:05:00Z' },
  ];

  const activeAlerts = mockAlerts.filter(a => !a.acknowledgedAt);
  const criticalCount = mockAlerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledgedAt).length;
  const warningCount = mockAlerts.filter(a => a.severity === 'WARNING' && !a.acknowledgedAt).length;

  const columns = [
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (alert: Alert) => {
        const colors: Record<string, string> = {
          CRITICAL: 'bg-red-500/10 text-red-400',
          WARNING: 'bg-yellow-500/10 text-yellow-400',
          INFO: 'bg-blue-500/10 text-blue-400',
        };
        return (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[alert.severity]}`}>
            {alert.severity}
          </span>
        );
      },
    },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'message', header: 'Message' },
    { key: 'entityId', header: 'Entity' },
    {
      key: 'ts',
      header: 'Time',
      sortable: true,
      render: (alert: Alert) => new Date(alert.ts).toLocaleString(),
    },
    {
      key: 'acknowledgedAt',
      header: 'Status',
      render: (alert: Alert) => (
        alert.acknowledgedAt ? (
          <span className="flex items-center gap-1 text-xs text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Acknowledged
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => ackMutation.mutate(alert.id)}
            disabled={ackMutation.isPending}
            data-testid={`button-ack-${alert.id}`}
          >
            Acknowledge
          </Button>
        )
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-1">Alerts</h1>
          <p className="text-sm text-muted-foreground">System notifications and warnings</p>
        </motion.div>

        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <KPIGrid>
        <KPIChip
          label="Active Alerts"
          value={activeAlerts.length}
          icon={<Bell className="w-5 h-5" />}
          variant={activeAlerts.length > 5 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Critical"
          value={criticalCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={criticalCount > 0 ? 'danger' : 'default'}
        />
        <KPIChip
          label="Warnings"
          value={warningCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          variant={warningCount > 3 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Acknowledged Today"
          value={mockAlerts.filter(a => a.acknowledgedAt).length}
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
      </KPIGrid>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">All Alerts</CardTitle>
          <CardDescription>Recent system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={mockAlerts}
            columns={columns}
            emptyMessage="No alerts"
          />
        </CardContent>
      </Card>
    </div>
  );
}
