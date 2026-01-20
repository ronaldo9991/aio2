import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, Clock, User, CheckCircle2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPIChip, KPIGrid } from '@/components/KPIChip';
import { DataTable } from '@/components/DataTable';
import { PageSkeleton } from '@/components/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

interface TicketItem {
  id: string;
  ts: string;
  type: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo: string | null;
  dueBy: string | null;
  entityType: string;
  entityId: string;
}

export function Tickets() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery<TicketItem[]>({
    queryKey: ['/api/tickets'],
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const result = await apiRequest<{ ok: boolean; ticketRef: string; ticketId: string }>('POST', '/ticket', data);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('No data returned from server');
      }
      return result.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Ticket Created',
        description: `Ticket ${data.ticketRef} has been created successfully. n8n notification sent.`,
      });
      setIsCreateDialogOpen(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        subject: '',
        message: '',
        priority: 'medium',
      });
      // Refresh tickets list
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ticket',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicketMutation.mutate(formData);
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  const mockTickets: TicketItem[] = tickets || [
    { id: 'T-001', ts: '2025-01-15T08:00:00Z', type: 'MAINTENANCE', status: 'open', assignedTo: 'operator1', dueBy: '2025-01-16T12:00:00Z', entityType: 'machine', entityId: 'M-003' },
    { id: 'T-002', ts: '2025-01-15T09:30:00Z', type: 'QUALITY_ISSUE', status: 'in_progress', assignedTo: 'operator2', dueBy: '2025-01-15T18:00:00Z', entityType: 'machine', entityId: 'M-002' },
    { id: 'T-003', ts: '2025-01-14T14:00:00Z', type: 'SCHEDULE_CHANGE', status: 'resolved', assignedTo: 'supervisor1', dueBy: '2025-01-15T08:00:00Z', entityType: 'job', entityId: 'J-012' },
    { id: 'T-004', ts: '2025-01-14T10:00:00Z', type: 'APPROVAL_REQUEST', status: 'open', assignedTo: null, dueBy: '2025-01-15T12:00:00Z', entityType: 'approval', entityId: 'A-005' },
    { id: 'T-005', ts: '2025-01-13T16:00:00Z', type: 'MAINTENANCE', status: 'closed', assignedTo: 'operator1', dueBy: '2025-01-14T12:00:00Z', entityType: 'machine', entityId: 'M-001' },
  ];

  const openTickets = mockTickets.filter(t => t.status === 'open').length;
  const inProgressTickets = mockTickets.filter(t => t.status === 'in_progress').length;
  const overdueTickets = mockTickets.filter(t => 
    t.dueBy && new Date(t.dueBy) < new Date() && t.status !== 'closed' && t.status !== 'resolved'
  ).length;

  const statusColors: Record<string, string> = {
    open: 'bg-blue-500/10 text-blue-400',
    in_progress: 'bg-yellow-500/10 text-yellow-400',
    resolved: 'bg-green-500/10 text-green-400',
    closed: 'bg-muted text-muted-foreground',
  };

  const columns = [
    { 
      key: 'id', 
      header: 'Ticket ID', 
      sortable: true,
      render: (t: TicketItem) => <span className="font-mono text-sm">{t.id}</span>
    },
    { key: 'type', header: 'Type', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t: TicketItem) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[t.status]}`}>
          {t.status.replace('_', ' ')}
        </span>
      ),
    },
    { 
      key: 'assignedTo', 
      header: 'Assigned To',
      render: (t: TicketItem) => t.assignedTo || <span className="text-muted-foreground text-xs">Unassigned</span>
    },
    { key: 'entityId', header: 'Entity' },
    {
      key: 'dueBy',
      header: 'Due By',
      sortable: true,
      render: (t: TicketItem) => {
        if (!t.dueBy) return '-';
        const isOverdue = new Date(t.dueBy) < new Date() && t.status !== 'closed' && t.status !== 'resolved';
        return (
          <span className={isOverdue ? 'text-red-400' : ''}>
            {new Date(t.dueBy).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (t: TicketItem) => (
        t.status === 'open' && (
          <Button size="sm" variant="outline" data-testid={`button-view-${t.id}`}>
            View
          </Button>
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
        <h1 className="text-2xl font-bold mb-1">Tickets</h1>
        <p className="text-sm text-muted-foreground">Work orders and task management</p>
      </motion.div>

      <KPIGrid>
        <KPIChip
          label="Open Tickets"
          value={openTickets}
          icon={<Ticket className="w-5 h-5" />}
        />
        <KPIChip
          label="In Progress"
          value={inProgressTickets}
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
        />
        <KPIChip
          label="Overdue"
          value={overdueTickets}
          icon={<Clock className="w-5 h-5" />}
          variant={overdueTickets > 0 ? 'danger' : 'default'}
        />
        <KPIChip
          label="Resolved Today"
          value={mockTickets.filter(t => t.status === 'resolved').length}
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
      </KPIGrid>

      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">All Tickets</CardTitle>
            <CardDescription>Work orders and maintenance tasks</CardDescription>
          </div>
          <Button 
            size="sm" 
            data-testid="button-create-ticket"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={mockTickets}
            columns={columns}
            emptyMessage="No tickets"
          />
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Create a new customer support ticket. This will automatically notify the operation manager via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                required
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Brief description of the issue"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                placeholder="Detailed description of the issue..."
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createTicketMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTicketMutation.isPending}>
                {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
