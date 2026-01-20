import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sparkles, CheckCircle2, XCircle, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

interface Recommendation {
  id: string;
  type: string;
  entityType: string;
  entityId: string;
  title: string;
  description: string;
  confidence: number;
  impactEstimate: string | null;
  status: string;
  createdAt: string;
}

export function AIRecommendations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [overrideReason, setOverrideReason] = React.useState('');
  const [selectedRec, setSelectedRec] = React.useState<Recommendation | null>(null);

  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
  });

  const acceptMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('POST', `/recommendations/accept`, { id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: 'Recommendation Accepted',
        description: 'The AI recommendation has been accepted and will be implemented.',
      });
    },
  });

  const overrideMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest('POST', `/recommendations/override`, { id, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      setOverrideReason('');
      setSelectedRec(null);
      toast({
        title: 'Recommendation Overridden',
        description: 'Your override reason has been logged for audit purposes.',
      });
    },
  });

  if (isLoading) {
    return <PageSkeleton />;
  }

  const recs = recommendations || [];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'schedule':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'quality':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'energy':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">AI Recommendations</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          AI-powered recommendations to optimize operations, reduce risks, and improve efficiency
        </p>
      </motion.div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How AI Recommendations Work</AlertTitle>
        <AlertDescription>
          AI analyzes your factory data 24/7 and suggests actions to improve operations.
          <br />
          • <strong>Confidence:</strong> How sure the AI is (90%+ = very confident, 50% = uncertain)
          <br />
          • <strong>Impact Estimate:</strong> What benefit you'll get (e.g., "Avoid 8 hours downtime")
          <br />
          • <strong>Accept:</strong> Implement the recommendation automatically
          <br />
          • <strong>Override:</strong> Reject it (you must provide a reason for audit)
          <br />
          Recommendations are based on machine health, schedule optimization, and quality trends.
        </AlertDescription>
      </Alert>

      {recs.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pending recommendations at this time.</p>
            <p className="text-sm text-muted-foreground mt-2">
              AI recommendations will appear here as the system analyzes your operations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recs.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(rec.type)}>
                          {rec.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getConfidenceColor(rec.confidence)}>
                          {Math.round(rec.confidence * 100)}% Confidence
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <CardDescription className="mt-2">{rec.description}</CardDescription>
                      {rec.impactEstimate && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span>{rec.impactEstimate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptMutation.mutate(rec.id)}
                      disabled={acceptMutation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedRec(rec)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Override
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Override Recommendation</DialogTitle>
                          <DialogDescription>
                            Please provide a reason for overriding this AI recommendation. This will be logged for audit purposes.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reason">Override Reason *</Label>
                            <Textarea
                              id="reason"
                              placeholder="Explain why you're overriding this recommendation..."
                              value={overrideReason}
                              onChange={(e) => setOverrideReason(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setOverrideReason('');
                              setSelectedRec(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              if (overrideReason.trim()) {
                                overrideMutation.mutate({
                                  id: rec.id,
                                  reason: overrideReason,
                                });
                              } else {
                                toast({
                                  variant: 'destructive',
                                  title: 'Reason Required',
                                  description: 'Please provide a reason for overriding.',
                                });
                              }
                            }}
                            disabled={!overrideReason.trim() || overrideMutation.isPending}
                          >
                            Override
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
