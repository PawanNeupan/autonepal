'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNotifications, useMarkAllRead } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const typeEmoji: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
};

const typeColor: Record<string, string> = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
};

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { data, isLoading } = useNotifications();
    const { mutateAsync: markAllRead, isPending } = useMarkAllRead();

    const notifications = data?.notifications || [];
    const unreadCount = data?.unreadCount || 0;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await markAllRead();
            toast.success('All marked as read');
        } catch {
            toast.error('Failed');
        }
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
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center px-1"
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
                        className="absolute right-0 top-12 w-90 bg-card border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden z-50"
                    >

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-foreground text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        disabled={isPending}
                                        className="text-xs text-red-500 hover:text-red-400 font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        {isPending
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
                        <div className="overflow-y-auto max-h-105">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                                    <p className="text-sm font-semibold text-foreground mb-1">All caught up!</p>
                                    <p className="text-xs text-muted-foreground">No notifications yet</p>
                                </div>
                            ) : (
                                <div>
                                    {notifications.map((notif: any, i: number) => (
                                        <motion.div
                                            key={notif._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-accent/50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-red-500/5' : ''
                                                }`}
                                        >
                                            {/* Icon */}
                                            <div className="relative shrink-0 mt-0.5">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                                                    {typeEmoji[notif.type] || '🔔'}
                                                </div>
                                                {!notif.isRead && (
                                                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${typeColor[notif.type] || 'bg-red-500'}`} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm leading-snug ${!notif.isRead ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                                    {new Date(notif.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>

                                            {/* Unread dot */}
                                            {!notif.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-border bg-muted/30">
                                <a
                                    href="/notifications"
                                    className="text-xs text-red-500 hover:text-red-400 font-semibold transition-colors flex items-center justify-center gap-1"
                                    onClick={() => setOpen(false)}
                                >
                                    View all notifications
                                </a>
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}