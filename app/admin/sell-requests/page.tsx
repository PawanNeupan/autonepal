'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MoreHorizontal, Phone, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Eye, Car, Image as ImageIcon } from 'lucide-react';
import { useSellRequests, useDeleteSellRequest } from '@/hooks/useSellRequests';
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
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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

  const { mutateAsync: deleteRequest, isPending: deleting } = useDeleteSellRequest();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateRequest({ id, status });
      toast.success(`Request marked as ${status}`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRequest(deleteId);
      toast.success('Request deleted successfully');
    } catch {
      toast.error('Failed to delete request');
    } finally {
      setDeleteId(null);
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
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
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
                      <span className="text-sm font-bold text-red-500">NPR {req.expectedPrice?.toLocaleString() || req.price?.toLocaleString()}</span>
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
                    <td className="px-5 py-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(req)}
                        className="text-xs font-medium bg-red-50/50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 transition-colors gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
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
                              className="capitalize cursor-pointer"
                            >
                              Mark as {s}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(req._id)}
                            className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Request
                          </DropdownMenuItem>
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

      {/* Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-border">
          <div className="bg-card border-b border-border sticky top-0 p-6 z-10 shadow-sm">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-red-600 dark:text-red-500" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {selectedRequest?.year} {selectedRequest?.make} {selectedRequest?.carModel}
                  </DialogTitle>
                  <DialogDescription>
                    Submitted by {selectedRequest?.user?.name || 'Anonymous'} on {selectedRequest && new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-8">
            {/* Seller Info */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Seller Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-semibold">{selectedRequest?.user?.name || 'Anonymous'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-semibold">{selectedRequest?.phone || selectedRequest?.user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-semibold">{selectedRequest?.user?.email || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Vehicle Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Expected Price', value: `NPR ${(selectedRequest?.expectedPrice || selectedRequest?.price || 0).toLocaleString()}`, className: 'text-red-500 font-black' },
                  { label: 'Condition', value: selectedRequest?.condition },
                  { label: 'KM Driven', value: selectedRequest?.kmDriven?.toLocaleString() },
                  { label: 'Fuel Type', value: selectedRequest?.fuelType },
                  { label: 'Transmission', value: selectedRequest?.transmission },
                  { label: 'Color', value: selectedRequest?.color || 'N/A' },
                  { label: 'Body Type', value: selectedRequest?.bodyType || 'Unknown' },
                ].map((item, i) => (
                  <div key={i} className="bg-card border border-border p-3 rounded-xl shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className={`text-sm font-semibold ${item.className || ''}`}>{item.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {selectedRequest?.description && (
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">Description</h3>
                <div className="bg-muted/30 p-4 rounded-xl border border-border text-sm leading-relaxed text-muted-foreground">
                  {selectedRequest.description}
                </div>
              </div>
            )}

            {/* Images */}
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Images ({selectedRequest?.images?.length || 0})
              </h3>
              {selectedRequest?.images?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedRequest.images.map((img: any, i: number) => (
                    <a key={i} href={img.url} target="_blank" rel="noopener noreferrer" className="block aspect-video rounded-xl overflow-hidden border border-border hover:opacity-90 transition-opacity">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="bg-muted/30 border border-dashed border-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground text-sm">No images uploaded</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-border bg-card flex justify-end gap-3 sticky bottom-0 z-10">
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this sell request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All information and images related to this request will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}