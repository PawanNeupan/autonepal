'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Loader2, Users, User } from 'lucide-react';
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
  info:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error:   'bg-red-500/20 text-red-400 border-red-500/30',
};

const typeEmoji: Record<string, string> = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  error:   '❌',
};

export default function AdminNotificationsPage() {
  const { data, isLoading }                         = useNotifications();
  const { mutateAsync: sendNotification, isPending } = useSendNotification();

  const [title, setTitle]     = useState('');
  const [message, setMessage] = useState('');
  const [type, setType]       = useState('info');
  const [target, setTarget]   = useState('all'); // 'all' or specific userId

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
        <p className="text-muted-foreground text-sm mt-0.5">
          Send and manage notifications
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6">

        {/* Send notification form */}
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

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['info', 'success', 'warning', 'error'].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {typeEmoji[t]} {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title..."
                className="bg-background border-border"
              />
            </div>

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
                <div className="text-xl shrink-0 mt-0.5">
                  {typeEmoji[notif.type] || '🔔'}
                </div>

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
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
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