import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function TopbarProfileMenu() {
  const { user, logout } = useAuthStore();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  if (!user) return null;

  const initials = user.email
    .split('@')[0]
    .split('.')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    supervisor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    operator: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="gap-2 pl-2 pr-3"
          data-testid="button-profile-menu"
        >
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline">{user.email.split('@')[0]}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span className="font-medium">{user.email}</span>
          <Badge 
            variant="outline" 
            className={`w-fit text-[10px] uppercase ${roleColors[user.role] || roleColors.viewer}`}
          >
            {user.role}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-red-400 focus:text-red-400 cursor-pointer"
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
