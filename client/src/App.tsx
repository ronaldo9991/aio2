import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence } from 'framer-motion';
import { LoaderIntro } from '@/components/LoaderIntro';
import { AppLayout } from '@/components/AppLayout';

import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Schedule } from '@/pages/Schedule';
import { MachineHealth } from '@/pages/MachineHealth';
import { QualityControl } from '@/pages/QualityControl';
import { Alerts } from '@/pages/Alerts';
import { Tickets } from '@/pages/Tickets';
import { Approvals } from '@/pages/Approvals';
import { UploadCenter } from '@/pages/UploadCenter';
import { Fairness } from '@/pages/Fairness';
import { Evaluation } from '@/pages/Evaluation';
import { AdminRules } from '@/pages/AdminRules';
import { WhatsApp } from '@/pages/WhatsApp';
import NotFound from '@/pages/not-found';

function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/app" component={Dashboard} />
        <Route path="/app/dashboard" component={Dashboard} />
        <Route path="/app/schedule" component={Schedule} />
        <Route path="/app/machine-health" component={MachineHealth} />
        <Route path="/app/quality-control" component={QualityControl} />
        <Route path="/app/alerts" component={Alerts} />
        <Route path="/app/tickets" component={Tickets} />
        <Route path="/app/approvals" component={Approvals} />
        <Route path="/app/upload-center" component={UploadCenter} />
        <Route path="/app/fairness" component={Fairness} />
        <Route path="/app/evaluation" component={Evaluation} />
        <Route path="/app/admin-rules" component={AdminRules} />
        <Route path="/app/whatsapp" component={WhatsApp} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/app/:rest*" component={AppRoutes} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem('aquaintel-visited');
    if (visited) {
      setHasVisited(true);
      setShowLoader(false);
    }
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('aquaintel-visited', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {showLoader && !hasVisited && (
          <LoaderIntro onComplete={handleLoaderComplete} />
        )}
        {!showLoader && <Router />}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
