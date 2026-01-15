import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Wrench, 
  TestTube2, 
  AlertTriangle, 
  Ticket, 
  CheckSquare, 
  Upload, 
  Scale, 
  BarChart3, 
  Settings, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import { RoleGate } from './ProtectedRoute';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

const mainNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
  { title: 'Schedule', icon: Calendar, href: '/app/schedule' },
  { title: 'Machine Health', icon: Wrench, href: '/app/machine-health' },
  { title: 'Quality Control', icon: TestTube2, href: '/app/quality-control' },
  { title: 'Alerts', icon: AlertTriangle, href: '/app/alerts' },
  { title: 'Tickets', icon: Ticket, href: '/app/tickets' },
  { title: 'Approvals', icon: CheckSquare, href: '/app/approvals' },
  { title: 'Upload Center', icon: Upload, href: '/app/upload-center' },
];

const analyticsItems = [
  { title: 'Fairness', icon: Scale, href: '/app/fairness' },
  { title: 'Evaluation', icon: BarChart3, href: '/app/evaluation' },
];

const adminItems = [
  { title: 'Admin Rules', icon: Settings, href: '/app/admin-rules' },
  { title: 'WhatsApp', icon: MessageSquare, href: '/app/whatsapp' },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="px-4 py-4 border-b border-border/50">
        <Link href="/app/dashboard">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              AQ
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">AQUAINTEL</span>
              <span className="text-[10px] text-muted-foreground">PETBottle AI Ops</span>
            </div>
          </motion.div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.href}
                    className="gap-3"
                  >
                    <Link href={item.href} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.href}
                    className="gap-3"
                  >
                    <Link href={item.href} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <RoleGate allowedRoles={['admin']}>
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location === item.href}
                      className="gap-3"
                    >
                      <Link href={item.href} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </RoleGate>
      </SidebarContent>
    </Sidebar>
  );
}
