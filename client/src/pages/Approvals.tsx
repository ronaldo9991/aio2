import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CheckSquare, XCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';

interface ApprovalItem {
  id: string;
  ts: string;
  actionType: string;
  entityType: string;
  entityId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'denied';
  notes: string | null;
}

export function Approvals() {
  const { toast } = useToast();

  const { data: approvals, isLoading } = useQuery<ApprovalItem[]>({
    queryKey: ['/api/approvals'],
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'approve' | 'deny' }) => {
      return apiRequest('POST', `/approvals/${id}/${action}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/approvals'] });
      toast({
        title: variables.action === 'approve' ? 'Approved' : 'Denied',
        description: `The request has been ${variables.action === 'approve' ? 'approved' : 'denied'}.`,
      });
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockApprovals: ApprovalItem[] = approvals || [
    { id: 'A-001', ts: '2025-01-15T10:00:00Z', actionType: 'RESCHEDULE', entityType: 'schedule', entityId: 'S-015', requestedBy: 'orchestrator', status: 'pending', notes: 'High risk detected on M-003' },
    { id: 'A-002', ts: '2025-01-15T09:30:00Z', actionType: 'MAINTENANCE_OVERRIDE', entityType: 'machine', entityId: 'M-002', requestedBy: 'operator2', status: 'pending', notes: 'Requesting early maintenance window' },
    { id: 'A-003', ts: '2025-01-15T08:45:00Z', actionType: 'PRIORITY_CHANGE', entityType: 'job', entityId: 'J-018', requestedBy: 'supervisor1', status: 'approved', notes: 'Customer escalation' },
    { id: 'A-004', ts: '2025-01-14T16:00:00Z', actionType: 'FREEZE_OVERRIDE', entityType: 'schedule', entityId: 'S-014', requestedBy: 'admin', status: 'denied', notes: 'Within freeze window' },
    { id: 'A-005', ts: '2025-01-14T14:30:00Z', actionType: 'QUALITY_EXCEPTION', entityType: 'machine', entityId: 'M-001', requestedBy: 'operator1', status: 'approved', notes: 'Temporary tolerance adjustment' },
  ];

  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending');
  const approvedToday = mockApprovals.filter(a => a.status === 'approved').length;
  const deniedToday = mockApprovals.filter(a => a.status === 'denied').length;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/10 text-green-400 border-green-500/30',
    denied: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">Approvals</h1>
        <p className="text-sm text-muted-foreground">Human-in-the-loop decision workflow</p>
      </motion.div>

      <KPIGrid>
        <KPIChip
          label="Pending"
          value={pendingApprovals.length}
          icon={<Clock className="w-5 h-5" />}
          variant={pendingApprovals.length > 0 ? 'warning' : 'default'}
        />
        <KPIChip
          label="Approved Today"
          value={approvedToday}
          icon={<CheckCircle className="w-5 h-5" />}
          variant="success"
        />
        <KPIChip
          label="Denied Today"
          value={deniedToday}
          icon={<XCircle className="w-5 h-5" />}
        />
        <KPIChip
          label="Total Requests"
          value={mockApprovals.length}
          icon={<CheckSquare className="w-5 h-5" />}
        />
      </KPIGrid>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Pending Approvals</h2>
        {pendingApprovals.length === 0 ? (
          <Card className="border-border/50 bg-card/50 p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pending approvals</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingApprovals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 hover-elevate">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CheckSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{approval.actionType.replace('_', ' ')}</CardTitle>
                          <CardDescription>
                            {approval.entityType}: {approval.entityId} • Requested by {approval.requestedBy}
                          </CardDescription>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[approval.status]}`}>
                        {approval.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {approval.notes && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {approval.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate({ id: approval.id, action: 'approve' })}
                        disabled={approveMutation.isPending}
                        className="gap-1"
                        data-testid={`button-approve-${approval.id}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveMutation.mutate({ id: approval.id, action: 'deny' })}
                        disabled={approveMutation.isPending}
                        className="gap-1"
                        data-testid={`button-deny-${approval.id}`}
                      >
                        <XCircle className="w-4 h-4" />
                        Deny
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Approval History</CardTitle>
          <CardDescription>Previously processed requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockApprovals.filter(a => a.status !== 'pending').map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
              >
                <div className="flex items-center gap-3">
                  {approval.status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{approval.actionType.replace('_', ' ')}</p>
                    <p className="text-xs text-muted-foreground">
                      {approval.entityId} • {new Date(approval.ts).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[approval.status]}`}>
                  {approval.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
