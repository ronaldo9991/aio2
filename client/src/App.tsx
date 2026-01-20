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
import { ProfessionalDashboard } from '@/pages/ProfessionalDashboard';
import { FuturisticDashboard } from '@/pages/FuturisticDashboard';
import { Schedule } from '@/pages/Schedule';
import { Machines } from '@/pages/Machines';
import { Robotics } from '@/pages/Robotics';
import { MachineHealth } from '@/pages/MachineHealth';
import { Energy } from '@/pages/Energy';
import { MachinesVsRobotics } from '@/pages/MachinesVsRobotics';
import { QualityControl } from '@/pages/QualityControl';
import { Alerts } from '@/pages/Alerts';
import { Tickets } from '@/pages/Tickets';
import { Approvals } from '@/pages/Approvals';
import { UploadCenter } from '@/pages/UploadCenter';
import { AdminRules } from '@/pages/AdminRules';
import { WhatsApp } from '@/pages/WhatsApp';
import { AIRecommendations } from '@/pages/AIRecommendations';
import { AIReport } from '@/pages/AIReport';
import NotFound from '@/pages/not-found';

function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/app" component={Dashboard} />
        <Route path="/app/dashboard" component={Dashboard} />
        <Route path="/app/professional-dashboard" component={ProfessionalDashboard} />
        <Route path="/app/futuristic-dashboard" component={FuturisticDashboard} />
        <Route path="/app/schedule" component={Schedule} />
        <Route path="/app/machines" component={Machines} />
        <Route path="/app/robotics" component={Robotics} />
        <Route path="/app/machine-health" component={MachineHealth} />
        <Route path="/app/energy" component={Energy} />
        <Route path="/app/machines-vs-robotics" component={MachinesVsRobotics} />
        <Route path="/app/quality-control" component={QualityControl} />
        <Route path="/app/alerts" component={Alerts} />
        <Route path="/app/tickets" component={Tickets} />
        <Route path="/app/approvals" component={Approvals} />
        <Route path="/app/upload-center" component={UploadCenter} />
        <Route path="/app/ai-recommendations" component={AIRecommendations} />
        <Route path="/app/ai-report" component={AIReport} />
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
