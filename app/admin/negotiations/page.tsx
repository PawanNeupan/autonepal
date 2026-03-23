'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNegotiations, useUpdateNegotiation } from '@/hooks/useNegotiations';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['pending', 'accepted', 'rejected', 'countered'];

const statusConfig: Record<string, string> = {
  pending:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  accepted:  'bg-green-500/20 text-green-400 border-green-500/30',
  rejected:  'bg-red-500/20 text-red-400 border-red-500/30',
  countered: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function AdminNegotiationsPage() {
  const [statusFilter, setStatusFilter]         = useState('');
  const { data, isLoading }                     = useNegotiations({ status: statusFilter });
  const { mutateAsync: updateNegotiation }      = useUpdateNegotiation();
  const negotiations                            = data?.negotiations || [];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateNegotiation({ id, data: { status } });
      toast.success(`Negotiation marked as ${status}`);
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
          <h2 className="text-2xl font-black text-foreground">Negotiations</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{negotiations.length} total negotiations</p>
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
        ) : negotiations.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-3">🤝</div>
            <p className="text-muted-foreground">No negotiations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Buyer</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Car</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Offer</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Message</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {negotiations.map((neg: any, i: number) => (
                  <motion.tr
                    key={neg._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground text-sm">{neg.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{neg.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {neg.car?.images?.[0]?.url && (
                          <div className="w-10 h-8 rounded overflow-hidden bg-muted shrink-0">
                            <img src={neg.car.images[0].url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground truncate max-w-32.5">{neg.car?.title}</p>
                          <p className="text-xs text-muted-foreground">Ask: NPR {neg.car?.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-red-500">
                        NPR {neg.offeredPrice?.toLocaleString()}
                      </span>
                      {neg.car?.price && (
                        <p className="text-[10px] text-muted-foreground">
                          {((1 - neg.offeredPrice / neg.car.price) * 100).toFixed(1)}% off
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground truncate max-w-37.5 block">
                        {neg.message || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <button>
                            <Badge
                              variant="outline"
                              className={`text-xs cursor-pointer capitalize hover:opacity-80 ${statusConfig[neg.status] || statusConfig.pending}`}
                            >
                              {neg.status}
                            </Badge>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {STATUS_OPTIONS.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleStatusChange(neg._id, s)}
                              className={`capitalize ${neg.status === s ? 'font-semibold' : ''}`}
                            >
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                              onClick={() => handleStatusChange(neg._id, s)}
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