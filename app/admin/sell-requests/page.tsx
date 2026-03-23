'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MoreHorizontal, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSellRequests } from '@/hooks/useSellRequests';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['pending', 'reviewing', 'accepted', 'rejected'];

const statusConfig: Record<string, string> = {
  pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  reviewing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  accepted:  'bg-green-500/20 text-green-400 border-green-500/30',
  rejected:  'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function AdminSellRequestsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading }             = useSellRequests({ status: statusFilter });
  const queryClient                     = useQueryClient();
  const requests                        = data?.requests || [];

  const { mutateAsync: updateRequest } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.put(`/api/sell-requests/${id}`, { status });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sell-requests'] }),
  });

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateRequest({ id, status });
      toast.success(`Request marked as ${status}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl font-black text-foreground">Sell Requests</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{data?.pagination?.total || 0} total requests</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                statusFilter === s
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-red-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-muted-foreground">No sell requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seller</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Car</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req: any, i: number) => (
                  <motion.tr
                    key={req._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground text-sm">{req.user?.name || 'Unknown'}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Phone className="w-3 h-3" />
                        {req.phone || req.user?.phone || '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm font-medium text-foreground">
                        {req.year} {req.make} {req.carModel}
                      </p>
                      <p className="text-xs text-muted-foreground">{req.fuelType} · {req.transmission} · {req.kmDriven?.toLocaleString()} km</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm font-bold text-red-500">NPR {req.price?.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <Badge
                              variant="outline"
                              className={`text-xs cursor-pointer capitalize hover:opacity-80 ${statusConfig[req.status] || statusConfig.pending}`}
                            >
                              {req.status}
                            </Badge>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleStatusChange(req._id, s)}
                              className={`capitalize ${req.status === s ? 'font-semibold' : ''}`}
                            >
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleStatusChange(req._id, s)}
                              className="capitalize"
                            >
                              Mark as {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}