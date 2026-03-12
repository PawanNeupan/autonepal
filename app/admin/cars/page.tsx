'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Search, Pencil, Trash2, Loader2,
  MoreHorizontal, Star, StarOff, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCars, useDeleteCar, useUpdateCar } from '@/hooks/useCars';
import { toast } from 'sonner';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

const statusConfig: Record<string, { label: string; class: string }> = {
  available:   { label: 'Available',   class: 'bg-green-500/20 text-green-400 border-green-500/30' },
  reserved:    { label: 'Reserved',    class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  sold:        { label: 'Sold',        class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  maintenance: { label: 'Maintenance', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  pending:     { label: 'Pending',     class: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export default function AdminCarsPage() {
  const [search, setSearch]           = useState('');
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const debouncedSearch               = useDebounce(search, 400);

  const { data, isLoading, isError }  = useCars({ search: debouncedSearch, limit: 50 });
  const { mutateAsync: deleteCar, isPending: deleting } = useDeleteCar();
  const { mutateAsync: updateCar }    = useUpdateCar();

  const cars = data?.cars || [];

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCar(deleteId);
      toast.success('Car deleted successfully');
    } catch {
      toast.error('Failed to delete car');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (car: any) => {
    try {
      await updateCar({ id: car._id, data: { isFeatured: !car.isFeatured } });
      toast.success(car.isFeatured ? 'Removed from featured' : 'Marked as featured');
    } catch {
      toast.error('Failed to update car');
    }
  };

  const handleStatusChange = async (car: any, status: string) => {
    try {
      await updateCar({ id: car._id, data: { status } });
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h2 className="text-2xl font-black text-foreground">Cars</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {cars.length} cars in inventory
          </p>
        </div>
        <Link href="/admin/cars/new">
          <Button className="bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg shadow-red-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Add New Car
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative max-w-sm"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cars..."
          className="pl-10 bg-background border-border"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-red-500" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-24 text-muted-foreground">
            Failed to load cars.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && cars.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-3">🚗</div>
            <p className="text-muted-foreground mb-4">No cars found</p>
            <Link href="/admin/cars/new">
              <Button className="bg-red-600 hover:bg-red-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Car
              </Button>
            </Link>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && cars.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Car</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Details</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Featured</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cars.map((car: any, i: number) => {
                  const img = car.images?.find((x: any) => x.isPrimary)?.url
                           || car.images?.[0]?.url
                           || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&q=60';
                  const s = statusConfig[car.status] || statusConfig.available;

                  return (
                    <motion.tr
                      key={car._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Car info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img src={img} alt={car.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm truncate max-w-40">
                              {car.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{car.make} · {car.year}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="font-bold text-red-500 text-sm">
                          NPR {car.price?.toLocaleString()}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          <div>{car.fuelType} · {car.transmission}</div>
                          <div>{car.kmDriven?.toLocaleString()} km</div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <Badge
                                variant="outline"
                                className={`text-xs cursor-pointer hover:opacity-80 ${s.class}`}
                              >
                                {s.label}
                              </Badge>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {Object.entries(statusConfig).map(([key, val]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => handleStatusChange(car, key)}
                                className={car.status === key ? 'font-semibold' : ''}
                              >
                                {val.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>

                      {/* Featured */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <button
                          onClick={() => handleToggleFeatured(car)}
                          className={`transition-colors ${
                            car.isFeatured
                              ? 'text-yellow-400 hover:text-yellow-500'
                              : 'text-muted-foreground/30 hover:text-yellow-400'
                          }`}
                        >
                          {car.isFeatured
                            ? <Star className="w-4 h-4 fill-yellow-400" />
                            : <StarOff className="w-4 h-4" />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/cars/${car._id}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                View Listing
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/cars/${car._id}/edit`}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(car._id)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this car?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The car listing will be permanently removed.
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