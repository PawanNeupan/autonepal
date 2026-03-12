'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/ModeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/admin':                'Dashboard',
  '/admin/cars':           'Manage Cars',
  '/admin/orders':         'Orders',
  '/admin/appointments':   'Appointments',
  '/admin/negotiations':   'Negotiations',
  '/admin/sell-requests':  'Sell Requests',
  '/admin/users':          'Users',
  '/admin/reviews':        'Reviews',
  '/admin/gallery':        'Gallery',
  '/admin/notifications':  'Notifications',
  '/admin/contact':        'Contact Info',
  '/admin/settings':       'Settings',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const title = PAGE_TITLES[pathname] || 'Admin';

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      <h1 className="font-bold text-foreground text-lg">{title}</h1>

      <div className="flex items-center gap-3">
        <ModeToggle />

        <button className="relative w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2.5 pl-1">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar?.url} />
            <AvatarFallback className="bg-red-600 text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">{user?.name}</p>
            <p className="text-xs text-red-500 mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}