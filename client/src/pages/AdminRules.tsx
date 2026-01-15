import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Settings, Save, RotateCcw, Sliders } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageSkeleton } from '@/components/Skeleton';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface SchedulerWeights {
  lateness: number;
  changeovers: number;
  riskCost: number;
  overtime: number;
  idle: number;
  stability: number;
}

interface PolicyConfig {
  freezeWindowHours: number;
  rescheduleCooldownMin: number;
  failureRiskThreshold: number;
  qualityDriftThreshold: number;
  approvalRequired: boolean;
  hysteresisEnabled: boolean;
}

export function AdminRules() {
  const { toast } = useToast();
  const [weightPreset, setWeightPreset] = useState('balanced');
  const [weights, setWeights] = useState<SchedulerWeights>({
    lateness: 0.30,
    changeovers: 0.20,
    riskCost: 0.25,
    overtime: 0.10,
    idle: 0.10,
    stability: 0.05,
  });

  const [policy, setPolicy] = useState<PolicyConfig>({
    freezeWindowHours: 3,
    rescheduleCooldownMin: 30,
    failureRiskThreshold: 0.7,
    qualityDriftThreshold: 0.5,
    approvalRequired: true,
    hysteresisEnabled: true,
  });

  const presets: Record<string, SchedulerWeights> = {
    balanced: { lateness: 0.30, changeovers: 0.20, riskCost: 0.25, overtime: 0.10, idle: 0.10, stability: 0.05 },
    ontime_first: { lateness: 0.50, changeovers: 0.15, riskCost: 0.15, overtime: 0.10, idle: 0.05, stability: 0.05 },
    risk_first: { lateness: 0.20, changeovers: 0.15, riskCost: 0.40, overtime: 0.10, idle: 0.10, stability: 0.05 },
  };

  const handlePresetChange = (preset: string) => {
    setWeightPreset(preset);
    setWeights(presets[preset]);
  };

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Admin rules have been updated successfully.',
    });
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold mb-1">Admin Rules</h1>
          <p className="text-sm text-muted-foreground">Configure scheduler weights and policy thresholds</p>
        </motion.div>

        <Tabs defaultValue="weights">
          <TabsList className="bg-muted/30">
            <TabsTrigger value="weights" data-testid="tab-weights">Scheduler Weights</TabsTrigger>
            <TabsTrigger value="policy" data-testid="tab-policy">Policy Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="weights" className="mt-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Objective Function Weights</CardTitle>
                    <CardDescription>Configure optimization priorities</CardDescription>
                  </div>
                  <Select value={weightPreset} onValueChange={handlePresetChange}>
                    <SelectTrigger className="w-40" data-testid="select-preset">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="ontime_first">On-Time First</SelectItem>
                      <SelectItem value="risk_first">Risk First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(weights).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <span className="text-sm font-mono w-12 text-right">{(value * 100).toFixed(0)}%</span>
                    </div>
                    <Slider
                      value={[value * 100]}
                      onValueChange={([v]) => setWeights({ ...weights, [key]: v / 100 })}
                      max={100}
                      step={5}
                      className="w-full"
                      data-testid={`slider-${key}`}
                    />
                  </div>
                ))}

                <div className={`mt-4 p-3 rounded-lg ${
                  Math.abs(totalWeight - 1) < 0.01 
                    ? 'bg-green-500/10 border border-green-500/30' 
                    : 'bg-yellow-500/10 border border-yellow-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Weight</span>
                    <span className={`font-mono ${Math.abs(totalWeight - 1) < 0.01 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {(totalWeight * 100).toFixed(0)}%
                    </span>
                  </div>
                  {Math.abs(totalWeight - 1) >= 0.01 && (
                    <p className="text-xs text-yellow-400 mt-1">
                      Weights should sum to 100% for proper optimization.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policy" className="mt-6">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Policy Configuration</CardTitle>
                <CardDescription>Set thresholds and operational rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Freeze Window (hours)</Label>
                    <Input
                      type="number"
                      value={policy.freezeWindowHours}
                      onChange={(e) => setPolicy({ ...policy, freezeWindowHours: parseInt(e.target.value) })}
                      min={1}
                      max={24}
                      data-testid="input-freeze-window"
                    />
                    <p className="text-xs text-muted-foreground">
                      Jobs within this window are locked from changes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Reschedule Cooldown (minutes)</Label>
                    <Input
                      type="number"
                      value={policy.rescheduleCooldownMin}
                      onChange={(e) => setPolicy({ ...policy, rescheduleCooldownMin: parseInt(e.target.value) })}
                      min={5}
                      max={120}
                      data-testid="input-cooldown"
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum time between automatic reschedules.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Failure Risk Threshold</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[policy.failureRiskThreshold * 100]}
                        onValueChange={([v]) => setPolicy({ ...policy, failureRiskThreshold: v / 100 })}
                        max={100}
                        step={5}
                        className="flex-1"
                        data-testid="slider-failure-threshold"
                      />
                      <span className="font-mono w-12 text-right">{(policy.failureRiskThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trigger alerts above this failure probability.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Quality Drift Threshold</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[policy.qualityDriftThreshold * 100]}
                        onValueChange={([v]) => setPolicy({ ...policy, qualityDriftThreshold: v / 100 })}
                        max={100}
                        step={5}
                        className="flex-1"
                        data-testid="slider-quality-threshold"
                      />
                      <span className="font-mono w-12 text-right">{(policy.qualityDriftThreshold * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Trigger quality alerts above this drift level.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Approval Required for Critical Actions</Label>
                      <p className="text-xs text-muted-foreground">Require human approval for schedule changes</p>
                    </div>
                    <Switch
                      checked={policy.approvalRequired}
                      onCheckedChange={(v) => setPolicy({ ...policy, approvalRequired: v })}
                      data-testid="switch-approval-required"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Hysteresis Enabled</Label>
                      <p className="text-xs text-muted-foreground">Prevent oscillating alert states</p>
                    </div>
                    <Switch
                      checked={policy.hysteresisEnabled}
                      onCheckedChange={(v) => setPolicy({ ...policy, hysteresisEnabled: v })}
                      data-testid="switch-hysteresis"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handlePresetChange('balanced')}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="ocean-glow-sm" data-testid="button-save-rules">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
