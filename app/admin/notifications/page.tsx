'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Send, Loader2, Users, User,
  Info, CheckCircle, AlertTriangle, XCircle,
  ShoppingBag, CalendarCheck, Handshake, BadgeDollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNotifications, useSendNotification } from '@/hooks/useNotifications';
import { toast } from 'sonner';

const typeConfig: Record<string, string> = {
  info:        'bg-blue-500/20 text-blue-400 border-blue-500/30',
  success:     'bg-green-500/20 text-green-400 border-green-500/30',
  warning:     'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error:       'bg-red-500/20 text-red-400 border-red-500/30',
  order:       'bg-purple-500/20 text-purple-400 border-purple-500/30',
  appointment: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  offer:       'bg-orange-500/20 text-orange-400 border-orange-500/30',
  deal:        'bg-green-500/20 text-green-400 border-green-500/30',
  system:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const typeIcon: Record<string, { icon: any; color: string; bg: string }> = {
  info:        { icon: Info,            color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  success:     { icon: CheckCircle,     color: 'text-green-400',  bg: 'bg-green-500/10' },
  warning:     { icon: AlertTriangle,   color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  error:       { icon: XCircle,         color: 'text-red-400',    bg: 'bg-red-500/10' },
  order:       { icon: ShoppingBag,     color: 'text-purple-400', bg: 'bg-purple-500/10' },
  appointment: { icon: CalendarCheck,   color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  offer:       { icon: Handshake,       color: 'text-orange-400', bg: 'bg-orange-500/10' },
  deal:        { icon: BadgeDollarSign, color: 'text-green-400',  bg: 'bg-green-500/10' },
  system:      { icon: Bell,            color: 'text-gray-400',   bg: 'bg-gray-500/10' },
};

const TYPE_OPTIONS = [
  'info', 'success', 'warning', 'error',
  'order', 'appointment', 'offer', 'deal', 'system',
];

function NotifIcon({ type }: { type: string }) {
  const config = typeIcon[type] || typeIcon.info;
  const Icon   = config.icon;
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
    </div>
  );
}

export default function AdminNotificationsPage() {
  const { data, isLoading }                          = useNotifications();
  const { mutateAsync: sendNotification, isPending } = useSendNotification();

  const [title, setTitle]     = useState('');
  const [message, setMessage] = useState('');
  const [type, setType]       = useState('info');
  const [target, setTarget]   = useState('all');

  const notifications = data?.notifications || [];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    try {
      await sendNotification({
        title,
        message,
        type,
        userId: target !== 'all' ? target : undefined,
      });
      toast.success('Notification sent successfully');
      setTitle('');
      setMessage('');
      setType('info');
      setTarget('all');
    } catch {
      toast.error('Failed to send notification');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-foreground">Notifications</h2>
        <p className="text-muted-foreground text-sm mt-0.5">Send and manage notifications</p>
      </motion.div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6">

        {/* Send form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <form
            onSubmit={handleSend}
            className="bg-card border border-border rounded-2xl p-5 space-y-4 sticky top-24"
          >
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-red-500" />
              <h3 className="font-bold text-foreground">Send Notification</h3>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => {
                    const cfg  = typeIcon[t] || typeIcon.info;
                    const Icon = cfg.icon;
                    return (
                      <SelectItem key={t} value={t}>
                        <div className="flex items-center gap-2 capitalize">
                          <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Target */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Target</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      All Users
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title..."
                className="bg-background border-border"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Message *</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification message..."
                className="bg-background border-border resize-none min-h-25"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20"
            >
              {isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><Send className="w-4 h-4 mr-2" /> Send Notification</>
              }
            </Button>
          </form>
        </motion.div>

        {/* Notifications list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-foreground">Recent Notifications</h3>
            <span className="text-xs text-muted-foreground">{notifications.length} total</span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-7 h-7 animate-spin text-red-500" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-24 bg-card border border-border rounded-2xl">
              <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif: any, i: number) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-card border rounded-xl p-4 flex items-start gap-3 ${
                  notif.isRead ? 'border-border opacity-60' : 'border-border'
                }`}
              >
                <NotifIcon type={notif.type} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-foreground text-sm">{notif.title}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-xs capitalize ${typeConfig[notif.type] || typeConfig.info}`}
                      >
                        {notif.type}
                      </Badge>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {notif.user
                        ? <><User className="w-3 h-3" /> {notif.user?.name || 'Specific user'}</>
                        : <><Users className="w-3 h-3" /> All users</>
                      }
                    </span>
                    <span>
                      {new Date(notif.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

      </div>
    </div>
  );
}