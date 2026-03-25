'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Loader2, X, Pencil, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useGallery, useAddGalleryImage,
  useDeleteGalleryImage, useUpdateGalleryImage,
} from '@/hooks/useGallery';
import { useUploadCarImages } from '@/hooks/useCars';
import { toast } from 'sonner';

const CATEGORIES = ['general', 'showroom', 'team', 'events', 'cars'];

export default function AdminGalleryPage() {
  const [uploading, setUploading]   = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [editId, setEditId]         = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] = useState('general');
  const [filterCat, setFilterCat]   = useState('');

  const { data, isLoading }                                   = useGallery();
  const { mutateAsync: addImage }                             = useAddGalleryImage();
  const { mutateAsync: deleteImage, isPending: deleting }     = useDeleteGalleryImage();
  const { mutateAsync: updateImage, isPending: updating }     = useUpdateGalleryImage();
  const { mutateAsync: uploadImages }                         = useUploadCarImages();

  const gallery = (data?.gallery || []).filter((item: any) =>
    filterCat ? item.category === filterCat : true
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadImages(files);
      await Promise.all(
        uploaded.map((img) =>
          addImage({ url: img.url, publicId: img.publicId, category: 'general' })
        )
      );
      toast.success(`${files.length} image(s) added to gallery`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteImage(deleteId);
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item._id);
    setEditCaption(item.caption || '');
    setEditCategory(item.category || 'general');
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    try {
      await updateImage({ id: editId, data: { caption: editCaption, category: editCategory } });
      toast.success('Updated');
      setEditId(null);
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl font-black text-foreground">Gallery</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {data?.gallery?.length || 0} images
          </p>
        </div>

        {/* Upload button */}
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <Button
            asChild
            className="bg-red-600 hover:bg-red-500 text-white font-semibold shadow-lg shadow-red-600/20"
          >
            <span>
              {uploading
                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                : <Upload className="w-4 h-4 mr-2" />
              }
              {uploading ? 'Uploading...' : 'Upload Images'}
            </span>
          </Button>
        </label>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-2 flex-wrap"
      >
        {['', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              filterCat === cat
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
            }`}
          >
            {cat || 'All'}
          </button>
        ))}
      </motion.div>

      {/* Gallery grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 animate-spin text-red-500" />
        </div>
      ) : gallery.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl">
          <div className="text-5xl mb-3">🖼️</div>
          <p className="text-muted-foreground mb-4">No images in gallery</p>
          <label className="cursor-pointer">
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
            <Button className="bg-red-600 hover:bg-red-500 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload First Image
            </Button>
          </label>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        >
          {gallery.map((item: any, i: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border"
            >
              <img
                src={item.url}
                alt={item.caption || 'Gallery image'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">

                {/* Top actions */}
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="w-7 h-7 rounded-lg bg-red-600/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom info */}
                <div>
                  {item.caption && (
                    <p className="text-white text-xs font-medium truncate">{item.caption}</p>
                  )}
                  <span className="text-white/60 text-[10px] capitalize">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Edit modal */}
      {editId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Edit Image</h3>
              <button
                onClick={() => setEditId(null)}
                className="w-7 h-7 rounded-lg text-muted-foreground hover:bg-accent flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Caption</Label>
              <Input
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Image caption..."
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-widest">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setEditId(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updating}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white"
              >
                {updating
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><Check className="w-4 h-4 mr-1" /> Save</>
                }
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
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