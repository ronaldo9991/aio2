import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, Clock, User, CheckCircle2, Plus, Trash2, MessageSquare, Send, Phone, Mail, Globe, Loader2 } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TicketItem {
  id: string;
  ts: string;
  type: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo: string | null;
  dueBy: string | null;
  entityType: string;
  entityId: string;
  ticketRef?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  subject?: string;
  priority?: string;
}

interface TicketMessage {
  id: string;
  sender: 'customer' | 'manager';
  channel: 'web' | 'whatsapp' | 'sms' | 'email';
  body: string;
  mediaUrl: string | null;
  createdAt: string;
}

interface TicketWithMessages {
  ticket: TicketItem;
  messages: TicketMessage[];
}

export function Tickets() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [viewTicketRef, setViewTicketRef] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
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

  // Fetch ticket details with messages when viewing - with auto-refresh for real-time
  const { data: ticketDetails, isLoading: isLoadingTicketDetails, refetch: refetchTicketDetails } = useQuery<TicketWithMessages>({
    queryKey: ['/api/ticket', viewTicketRef],
    queryFn: async () => {
      if (!viewTicketRef) return null;
      // Use fetch directly since this endpoint might not require auth
      const response = await fetch(`/api/ticket/${viewTicketRef}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch ticket');
      }
      const result = await response.json();
      return result;
    },
    enabled: !!viewTicketRef,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!viewTicketRef) throw new Error('No ticket selected');
      
      const response = await fetch('/api/ticket/inbound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '44214f24e57b423afecff36860965a1ae979f15a884703166a6aafbd05f8d5ca', // Manager API key
        },
        body: JSON.stringify({
          ticketRef: viewTicketRef,
          message: message,
          from: '+919655716000', // Manager phone
          channel: 'web',
          externalId: `WEB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      setMessageInput('');
      // Refetch immediately to show the new message
      refetchTicketDetails();
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('[Tickets] Creating ticket with data:', data);
      // Use fetch directly since /api/ticket is a public endpoint (no auth required)
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Tickets] API error:', response.status, errorText);
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('[Tickets] API response:', result);
      
      if (!result.ok) {
        throw new Error(result.message || 'Ticket creation failed');
      }
      
      return result;
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

  const deleteTicketMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await apiRequest('DELETE', `/tickets/${id}`);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      toast({
        title: 'Ticket Deleted',
        description: 'Ticket has been deleted successfully.',
      });
      setDeleteTicketId(null);
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete ticket',
        variant: 'destructive',
      });
    },
  });

  const deleteAllTicketsMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest('DELETE', '/tickets');
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data: any) => {
      toast({
        title: 'All Tickets Deleted',
        description: data?.message || 'All tickets have been deleted successfully.',
      });
      setIsDeleteAllDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete tickets',
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
      key: 'ticketRef', 
      header: 'Ticket ID', 
      sortable: true,
      render: (t: TicketItem) => <span className="font-mono text-sm">{t.ticketRef || t.id}</span>
    },
    { 
      key: 'subject', 
      header: 'Subject', 
      sortable: true,
      render: (t: TicketItem) => t.subject || '-'
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
      key: 'customerName', 
      header: 'Customer',
      render: (t: TicketItem) => t.customerName || '-'
    },
    { 
      key: 'priority', 
      header: 'Priority',
      sortable: true,
      render: (t: TicketItem) => (
        <span className="capitalize text-xs">
          {t.priority || 'medium'}
        </span>
      )
    },
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
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            data-testid={`button-view-${t.id}`}
            onClick={() => {
              // Try ticketRef first, fallback to id
              const ref = t.ticketRef || t.id;
              setViewTicketRef(ref);
            }}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setDeleteTicketId(t.id)}
            className="text-red-400 hover:text-red-300"
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

      {/* Delete Ticket Confirmation */}
      <AlertDialog open={deleteTicketId !== null} onOpenChange={(open) => !open && setDeleteTicketId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ticket {deleteTicketId}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTicketId && deleteTicketMutation.mutate(deleteTicketId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteTicketMutation.isPending}
            >
              {deleteTicketMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Tickets Confirmation */}
      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Tickets</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all {mockTickets.length} tickets? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAllTicketsMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAllTicketsMutation.isPending}
            >
              {deleteAllTicketsMutation.isPending ? 'Deleting...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Ticket Conversation Dialog */}
      <Dialog open={!!viewTicketRef} onOpenChange={(open) => !open && setViewTicketRef(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ticket Conversation
            </DialogTitle>
            <DialogDescription>
              {ticketDetails?.ticket.ticketRef && (
                <span className="font-mono">Ticket: {ticketDetails.ticket.ticketRef}</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {isLoadingTicketDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading conversation...</div>
            </div>
          ) : ticketDetails ? (
            <div className="flex-1 overflow-hidden flex flex-col space-y-4">
              {/* Ticket Info */}
              <Card className="border-border/50">
                <CardContent className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Subject:</span>
                      <p className="font-medium">{ticketDetails.ticket.subject || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[ticketDetails.ticket.status]}`}>
                          {ticketDetails.ticket.status.replace('_', ' ')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Customer:</span>
                      <p className="font-medium">{ticketDetails.ticket.customerName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Priority:</span>
                      <p className="capitalize">{ticketDetails.ticket.priority || 'medium'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-mono text-xs">{ticketDetails.ticket.customerPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="text-xs">{ticketDetails.ticket.customerEmail || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                  <span>Conversation ({ticketDetails.messages.length} messages)</span>
                  {isLoadingTicketDetails && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {ticketDetails.messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  ticketDetails.messages.map((msg, idx) => {
                    const isManager = msg.sender === 'manager';
                    const isCustomer = msg.sender === 'customer';
                    
                    const channelIcons = {
                      web: Globe,
                      whatsapp: MessageSquare,
                      sms: Phone,
                      email: Mail,
                    };
                    
                    const ChannelIcon = channelIcons[msg.channel] || MessageSquare;
                    
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex gap-3 ${isManager ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`flex-1 ${isManager ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              isManager
                                ? 'bg-blue-500/20 border border-blue-500/30'
                                : 'bg-muted border border-border'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium ${isManager ? 'text-blue-400' : 'text-muted-foreground'}`}>
                                {isManager ? 'Manager' : 'Customer'}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ChannelIcon className="w-3 h-3" />
                                <span className="capitalize">{msg.channel}</span>
                              </div>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                            {msg.mediaUrl && (
                              <a
                                href={msg.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:underline mt-2 block"
                              >
                                View Media
                              </a>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (messageInput.trim() && !sendMessageMutation.isPending) {
                          sendMessageMutation.mutate(messageInput.trim());
                        }
                      }
                    }}
                    rows={2}
                    className="flex-1 resize-none"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={() => {
                      if (messageInput.trim() && !sendMessageMutation.isPending) {
                        sendMessageMutation.mutate(messageInput.trim());
                      }
                    }}
                    disabled={!messageInput.trim() || sendMessageMutation.isPending}
                    size="icon"
                    className="shrink-0"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Ticket not found
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setViewTicketRef(null);
              setMessageInput('');
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
