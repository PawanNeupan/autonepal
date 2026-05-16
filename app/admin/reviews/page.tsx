'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useReviews, useDeleteReview, useUpdateReview } from '@/hooks/useReviews';
import { toast } from 'sonner';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage]         = useState(1);

  const { data, isLoading }                                 = useReviews(page);
  const { mutateAsync: deleteReview, isPending: deleting }  = useDeleteReview();
  const { mutate: updateReview }                            = useUpdateReview();
  const reviews                                             = data?.reviews || [];

  const handleToggleFeature = (id: string, currentStatus: boolean) => {
    updateReview({ id, payload: { isFeatured: !currentStatus } }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Removed from landing page' : 'Added to landing page');
      },
      onError: () => {
        toast.error('Failed to update status');
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview(deleteId);
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-black text-foreground">Reviews</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          {data?.pagination?.total || 0} total reviews
        </p>
      </motion.div>

      {/* Reviews grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 animate-spin text-red-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl">
          <div className="text-5xl mb-3">⭐</div>
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review: any, i: number) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4"
            >
              {/* User avatar */}
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={review.user?.avatar?.url} />
                <AvatarFallback className="bg-red-600 text-white font-bold text-sm">
                  {(review.user?.name || review.name || 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{review.user?.name || review.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{review.user?.email || 'Site Review'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StarRating rating={review.rating} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Car */}
                {review.car && (
                  <div className="flex items-center gap-2 mt-2 mb-2">
                    {review.car.images?.[0]?.url && (
                      <div className="w-8 h-6 rounded overflow-hidden bg-muted shrink-0">
                        <img src={review.car.images[0].url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {review.car.title}
                    </span>
                  </div>
                )}

                {/* Comment */}
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    &quot;{review.comment}&quot;
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col items-end justify-between h-full gap-4">
                <button
                  onClick={() => setDeleteId(review._id)}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Show on Landing
                  </span>
                  <Switch
                    checked={review.isFeatured}
                    onCheckedChange={() => handleToggleFeature(review._id, review.isFeatured)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${
                page === p
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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