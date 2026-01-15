import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { TopbarProfileMenu } from './TopbarProfileMenu';
import { ProtectedRoute } from './ProtectedRoute';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <ProtectedRoute>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 py-3 border-b border-border/50 bg-background/80 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
              </div>
              <TopbarProfileMenu />
            </header>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
