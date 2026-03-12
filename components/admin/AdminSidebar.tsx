'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  LayoutDashboard, Car, ShoppingBag, CalendarCheck,
  MessageSquare, Users, Star, Image, Phone,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, FileText, Handshake,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/admin',               icon: LayoutDashboard },
  { label: 'Cars',         href: '/admin/cars',           icon: Car },
  { label: 'Orders',       href: '/admin/orders',         icon: ShoppingBag },
  { label: 'Appointments', href: '/admin/appointments',   icon: CalendarCheck },
  { label: 'Negotiations', href: '/admin/negotiations',   icon: Handshake },
  { label: 'Sell Requests',href: '/admin/sell-requests',  icon: FileText },
  { label: 'Users',        href: '/admin/users',          icon: Users },
  { label: 'Reviews',      href: '/admin/reviews',        icon: Star },
  { label: 'Gallery',      href: '/admin/gallery',        icon: Image },
  { label: 'Notifications',href: '/admin/notifications',  icon: Bell },
  { label: 'Contact Info', href: '/admin/contact',        icon: Phone },
  { label: 'Settings',     href: '/admin/settings',       icon: Settings },
];

export default function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-card border-r border-border flex flex-col h-screen top-0 shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
            <Car className="w-3.5 h-3.5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-black text-sm tracking-wider whitespace-nowrap overflow-hidden"
              >
                AUTO<span className="text-red-500">NEPAL</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <div className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-red-600/10 text-red-500'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-red-500' : ''}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="admin-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm z-10"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}