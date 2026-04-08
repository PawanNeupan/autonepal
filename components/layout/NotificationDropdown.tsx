'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCheck, Loader2, X, Trash2,
  Info, CheckCircle, AlertTriangle, XCircle,
  ShoppingBag, CalendarCheck, Handshake, BadgeDollarSign,
} from 'lucide-react';
import { useNotifications, useMarkAllRead, useMarkRead } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const typeIcon: Record<string, { icon: any; color: string; bg: string; dot: string }> = {
  info:        { icon: Info,            color: 'text-blue-400',   bg: 'bg-blue-500/10',   dot: 'bg-blue-500' },
  success:     { icon: CheckCircle,     color: 'text-green-400',  bg: 'bg-green-500/10',  dot: 'bg-green-500' },
  warning:     { icon: AlertTriangle,   color: 'text-yellow-400', bg: 'bg-yellow-500/10', dot: 'bg-yellow-500' },
  error:       { icon: XCircle,         color: 'text-red-400',    bg: 'bg-red-500/10',    dot: 'bg-red-500' },
  order:       { icon: ShoppingBag,     color: 'text-purple-400', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
  appointment: { icon: CalendarCheck,   color: 'text-blue-400',   bg: 'bg-blue-500/10',   dot: 'bg-blue-500' },
  offer:       { icon: Handshake,       color: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  deal:        { icon: BadgeDollarSign, color: 'text-green-400',  bg: 'bg-green-500/10',  dot: 'bg-green-500' },
  system:      { icon: Bell,            color: 'text-gray-400',   bg: 'bg-gray-500/10',   dot: 'bg-gray-500' },
};

function NotifIcon({ type }: { type: string }) {
  const config = typeIcon[type] || typeIcon.system;
  const Icon   = config.icon;
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
    </div>
  );
}

function timeAgo(date: string) {
  const diff  = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function getRoute(notif: any): string {
  if (notif.type === 'order')            return '/my/orders';
  if (notif.type === 'appointment')      return '/my/appointments';
  if (notif.type === 'offer')            return '/my/orders';
  if (notif.type === 'deal')             return '/my/orders';
  return '/notifications';
}

const PREVIEW_COUNT = 5;

export default function NotificationDropdown() {
  const [open, setOpen]           = useState(false);
  const [showAll, setShowAll]     = useState(false);
  const ref                       = useRef<HTMLDivElement>(null);
  const router                    = useRouter();

  const { data, isLoading }                     = useNotifications();
  const { mutateAsync: markAllRead, isPending: markingAll }   = useMarkAllRead();
  const { mutateAsync: markRead }                             = useMarkRead();

  const allNotifications  = data?.notifications || [];
  const unreadCount       = data?.unreadCount   || 0;
  const notifications     = showAll ? allNotifications : allNotifications.slice(0, PREVIEW_COUNT);
  const hasMore           = allNotifications.length > PREVIEW_COUNT;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowAll(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Reset showAll when closed
  useEffect(() => {
    if (!open) setShowAll(false);
  }, [open]);

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAllRead();
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleNotifClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await markRead(notif._id);
      } catch (err) {
        // silent fail
      }
    }
    setOpen(false);
    router.push(getRoute(notif));
  };

  return (
    <div ref={ref} className="relative">

      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center px-1"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 w-[380px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markingAll}
                    className="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {markingAll
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <CheckCheck className="w-3 h-3" />
                    }
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[460px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                </div>
              ) : allNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground mb-1">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div>
                  <AnimatePresence initial={false}>
                    {notifications.map((notif: any, i: number) => {
                      const cfg = typeIcon[notif.type] || typeIcon.system;
                      return (
                        <motion.div
                          key={notif._id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`group flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-accent/40 transition-colors cursor-pointer ${
                            !notif.isRead ? 'bg-red-500/5' : ''
                          }`}
                          onClick={() => handleNotifClick(notif)}
                        >
                          {/* Icon */}
                          <div className="relative shrink-0 mt-0.5">
                            <NotifIcon type={notif.type} />
                            {!notif.isRead && (
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${cfg.dot}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${
                              !notif.isRead
                                ? 'font-semibold text-foreground'
                                : 'font-medium text-foreground/80'
                            }`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-muted-foreground/60">
                                {timeAgo(notif.createdAt)}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize font-medium ${cfg.bg} ${cfg.color}`}>
                                {notif.type}
                              </span>
                            </div>
                          </div>

                          {/* Right side — unread dot */}
                          <div className="flex flex-col items-center gap-2 shrink-0">
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-red-500 mt-1" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {/* View all / Show less toggle */}
                  {hasMore && (
                    <div className="px-4 py-2.5 border-t border-border">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowAll(!showAll); }}
                        className="w-full text-xs text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center justify-center gap-1.5 py-1"
                      >
                        {showAll
                          ? `Show less`
                          : `View all ${allNotifications.length} notifications`
                        }
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer — go to full notifications page */}
            {allNotifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-border bg-muted/30">
                <button
                  onClick={() => { setOpen(false); router.push('/notifications'); }}
                  className="w-full text-xs text-red-500 hover:text-red-400 font-semibold transition-colors flex items-center justify-center gap-1 py-1"
                >
                  Open notifications page
                </button>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}