import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Calendar, Wrench, TestTube2, CheckSquare, FileText, Shield, Scale, BarChart3, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { CursorHalo } from '@/components/CursorHalo';
import { BrowserFrame } from '@/components/BrowserFrame';
import { BottleBackground } from '@/components/BottleBackground';

const features = [
  { icon: Calendar, title: 'Plan', description: 'Optimal job scheduling with risk-aware optimization' },
  { icon: Wrench, title: 'Predict', description: '72-hour machine failure prediction with ML models' },
  { icon: TestTube2, title: 'Prevent', description: 'SPC-based quality drift detection and alerts' },
  { icon: CheckSquare, title: 'Approve', description: 'Human-in-the-loop for critical operations' },
  { icon: FileText, title: 'Audit', description: 'Complete traceability and compliance logging' },
];

const modules = [
  { icon: Upload, title: 'Upload Center', description: 'CSV-based data ingestion with validation and mapping wizard' },
  { icon: Calendar, title: 'Scheduling', description: 'Baseline vs Risk-Aware scheduling with Gantt visualization' },
  { icon: Wrench, title: 'Maintenance', description: 'Predictive maintenance with failure risk scores' },
  { icon: TestTube2, title: 'Quality', description: 'Statistical process control and defect tracking' },
  { icon: Settings, title: 'Policy', description: 'Configurable rules engine for automation' },
  { icon: CheckSquare, title: 'Approvals', description: 'Workflow management with WhatsApp integration' },
  { icon: Scale, title: 'Fairness', description: 'Bias monitoring across shifts and operators' },
  { icon: BarChart3, title: 'Evaluation', description: 'Before vs After comparison with KPI breakdown' },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center p-6 rounded-xl glass-card text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
        <feature.icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
    </motion.div>
  );
}

function ModuleCard({ module, index }: { module: typeof modules[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-start gap-4 p-5 rounded-xl border border-border/50 bg-card/30 hover-elevate"
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <module.icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold mb-1">{module.title}</h4>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>
    </motion.div>
  );
}

function ScheduleComparison() {
  const [showRiskAware, setShowRiskAware] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setShowRiskAware((prev) => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        className="absolute -inset-4 bg-primary/5 rounded-2xl blur-xl"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${showRiskAware ? 'bg-primary' : 'bg-muted'}`} />
            <span className="text-sm font-medium">
              {showRiskAware ? 'Risk-Aware Schedule' : 'Baseline Schedule'}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={!showRiskAware ? 'default' : 'outline'}
              onClick={() => setShowRiskAware(false)}
            >
              Before
            </Button>
            <Button
              size="sm"
              variant={showRiskAware ? 'default' : 'outline'}
              onClick={() => setShowRiskAware(true)}
            >
              After
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {['Machine 1', 'Machine 2', 'Machine 3'].map((machine, i) => (
            <div key={machine} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-20">{machine}</span>
              <div className="flex-1 h-8 bg-muted/30 rounded-md overflow-hidden flex">
                <motion.div
                  className={`h-full rounded-md ${showRiskAware ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: showRiskAware 
                      ? `${[75, 85, 90][i]}%` 
                      : `${[60, 70, 65][i]}%` 
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-mono w-12">
                {showRiskAware ? `${[75, 85, 90][i]}%` : `${[60, 70, 65][i]}%`}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-ocean">
              {showRiskAware ? '94%' : '78%'}
            </div>
            <div className="text-xs text-muted-foreground">On-Time Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-ocean">
              {showRiskAware ? '12%' : '28%'}
            </div>
            <div className="text-xs text-muted-foreground">Risk Cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient-ocean">
              {showRiskAware ? '85%' : '72%'}
            </div>
            <div className="text-xs text-muted-foreground">Utilization</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <CursorHalo />
      <Navbar />

      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 gradient-ocean animate-gradient" />
        
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <BottleBackground heroRef={heroRef as React.RefObject<HTMLElement>} />

        <motion.div
          className="relative max-w-5xl mx-auto px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale, zIndex: 20 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="text-gradient-ocean">AQUAINTEL</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              PETBottle AI Ops
            </p>
            <p className="text-base md:text-lg text-muted-foreground/80 max-w-2xl mx-auto mb-8">
              Risk-aware scheduling + machine health + quality drift control — with approvals and audit trails.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button 
              size="lg" 
              className="gap-2 ocean-glow"
              data-testid="button-explore"
            >
              Explore
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline"
                data-testid="button-login-hero"
              >
                Login
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-2.5 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What It Does</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete AI-powered operations platform for smart manufacturing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Risk-Aware Dynamic Scheduling
              </h2>
              <p className="text-muted-foreground mb-6">
                See how AI risk scores transform scheduling decisions. Compare baseline scheduling 
                against risk-aware optimization with real-time KPI improvements.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  <Shield className="w-4 h-4" />
                  Freeze Window Protection
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
                  <BarChart3 className="w-4 h-4" />
                  72h Risk Prediction
                </div>
              </div>
            </motion.div>

            <ScheduleComparison />
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Modules</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for every aspect of smart factory operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {modules.map((module, index) => (
              <ModuleCard key={module.title} module={module} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-background to-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven manufacturing operations with complete visibility and control.
            </p>
            <Link href="/login">
              <Button size="lg" className="gap-2 ocean-glow" data-testid="button-get-started-footer">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              AQ
            </div>
            <span className="text-sm text-muted-foreground">AQUAINTEL</span>
          </div>
          <p className="text-sm text-muted-foreground">
            PETBottle AI Ops Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
