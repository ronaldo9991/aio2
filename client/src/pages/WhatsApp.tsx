import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MessageSquare, Phone, CheckCircle, XCircle, Settings, Send, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface WhatsAppConfig {
  provider: 'twilio' | 'meta';
  enabled: boolean;
  fromNumber: string;
  supervisorNumbers: string[];
  webhookSecret: string;
  lastHealthCheck: string | null;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy' | 'unconfigured';
}

interface MessageLog {
  id: string;
  ts: string;
  to: string;
  approvalId: string;
  status: 'sent' | 'delivered' | 'replied' | 'failed';
  reply: string | null;
}

export function WhatsApp() {
  const { toast } = useToast();
  
  const [config, setConfig] = useState<WhatsAppConfig>({
    provider: 'twilio',
    enabled: false,
    fromNumber: '',
    supervisorNumbers: [],
    webhookSecret: '',
    lastHealthCheck: null,
    healthStatus: 'unconfigured',
  });

  const [newNumber, setNewNumber] = useState('');

  const mockLogs: MessageLog[] = [
    { id: '1', ts: '2025-01-15T10:30:00Z', to: '+1234567890', approvalId: 'A-001', status: 'replied', reply: 'APPROVE' },
    { id: '2', ts: '2025-01-15T09:15:00Z', to: '+1234567890', approvalId: 'A-002', status: 'delivered', reply: null },
    { id: '3', ts: '2025-01-14T16:00:00Z', to: '+0987654321', approvalId: 'A-003', status: 'replied', reply: 'DENY' },
    { id: '4', ts: '2025-01-14T14:30:00Z', to: '+1234567890', approvalId: 'A-004', status: 'failed', reply: null },
  ];

  const handleAddNumber = () => {
    if (newNumber && !config.supervisorNumbers.includes(newNumber)) {
      setConfig({
        ...config,
        supervisorNumbers: [...config.supervisorNumbers, newNumber],
      });
      setNewNumber('');
    }
  };

  const handleRemoveNumber = (number: string) => {
    setConfig({
      ...config,
      supervisorNumbers: config.supervisorNumbers.filter(n => n !== number),
    });
  };

  const handleSave = () => {
    toast({
      title: 'Configuration Saved',
      description: 'WhatsApp settings have been updated.',
    });
  };

  const handleTestMessage = () => {
    toast({
      title: 'Test Message Sent',
      description: 'A test message has been sent to configured numbers.',
    });
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    healthy: { bg: 'bg-green-500/10', text: 'text-green-400' },
    degraded: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    unhealthy: { bg: 'bg-red-500/10', text: 'text-red-400' },
    unconfigured: { bg: 'bg-muted', text: 'text-muted-foreground' },
  };

  const messageStatusColors: Record<string, string> = {
    sent: 'bg-blue-500/10 text-blue-400',
    delivered: 'bg-green-500/10 text-green-400',
    replied: 'bg-primary/10 text-primary',
    failed: 'bg-red-500/10 text-red-400',
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-1">WhatsApp Integration</h1>
          <p className="text-sm text-muted-foreground">Configure WhatsApp HITL approvals</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Configuration</CardTitle>
                    <CardDescription>WhatsApp provider settings</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Enabled</span>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(v) => setConfig({ ...config, enabled: v })}
                      data-testid="switch-whatsapp-enabled"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select 
                      value={config.provider} 
                      onValueChange={(v) => setConfig({ ...config, provider: v as 'twilio' | 'meta' })}
                    >
                      <SelectTrigger data-testid="select-provider">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="meta">Meta WhatsApp Cloud API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>From Number</Label>
                    <Input
                      value={config.fromNumber}
                      onChange={(e) => setConfig({ ...config, fromNumber: e.target.value })}
                      placeholder="+1234567890"
                      data-testid="input-from-number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/api/whatsapp/webhook`}
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/api/whatsapp/webhook`);
                        toast({ title: 'Copied', description: 'Webhook URL copied to clipboard' });
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Supervisor Numbers</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value)}
                      placeholder="+1234567890"
                      data-testid="input-add-number"
                    />
                    <Button onClick={handleAddNumber} data-testid="button-add-number">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {config.supervisorNumbers.map((number) => (
                      <Badge
                        key={number}
                        variant="outline"
                        className="gap-1 cursor-pointer"
                        onClick={() => handleRemoveNumber(number)}
                      >
                        <Phone className="w-3 h-3" />
                        {number}
                        <XCircle className="w-3 h-3" />
                      </Badge>
                    ))}
                    {config.supervisorNumbers.length === 0 && (
                      <span className="text-xs text-muted-foreground">No numbers configured</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="ocean-glow-sm" data-testid="button-save-config">
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={handleTestMessage} disabled={!config.enabled}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Test
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Message Log</CardTitle>
                <CardDescription>Recent WhatsApp approval messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Approval {log.approvalId} → {log.to}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.ts).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {log.reply && (
                          <Badge variant="outline" className={log.reply === 'APPROVE' ? 'text-green-400' : 'text-red-400'}>
                            {log.reply}
                          </Badge>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${messageStatusColors[log.status]}`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${statusColors[config.healthStatus].bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {config.healthStatus === 'healthy' ? (
                      <CheckCircle className={`w-5 h-5 ${statusColors[config.healthStatus].text}`} />
                    ) : (
                      <AlertCircle className={`w-5 h-5 ${statusColors[config.healthStatus].text}`} />
                    )}
                    <span className={`font-medium capitalize ${statusColors[config.healthStatus].text}`}>
                      {config.healthStatus}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {config.healthStatus === 'unconfigured'
                      ? 'WhatsApp integration is not configured. Enable and configure to start using.'
                      : config.healthStatus === 'healthy'
                      ? 'All systems operational. Messages are being delivered successfully.'
                      : 'There may be issues with message delivery. Check provider dashboard.'}
                  </p>
                </div>

                {!config.enabled && (
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-xs text-blue-400">
                      WhatsApp is disabled. In-app approvals will still work normally.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Messages Today</span>
                  <span className="font-mono">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Rate</span>
                  <span className="font-mono text-green-400">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                  <span className="font-mono">4.2 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approval Rate</span>
                  <span className="font-mono">78%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
