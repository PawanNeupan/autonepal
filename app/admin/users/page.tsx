'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Loader2, MoreHorizontal,
  Shield, ShieldOff, Trash2, Ban, CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch         = useDebounce(search, 400);
  const { user: currentUser }   = useAuthStore();

  const { data, isLoading }            = useUsers({ search: debouncedSearch, role: roleFilter });
  const { mutateAsync: updateUser }    = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: deleting } = useDeleteUser();

  const users = data?.users || [];

  const handleToggleRole = async (user: any) => {
    if (user._id === currentUser?._id) {
      toast.error('You cannot change your own role');
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await updateUser({ id: user._id, data: { role: newRole } });
      toast.success(`${user.name} is now ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleToggleBan = async (user: any) => {
    if (user._id === currentUser?._id) {
      toast.error('You cannot ban yourself');
      return;
    }
    try {
      await updateUser({ id: user._id, data: { isBanned: !user.isBanned } });
      toast.success(user.isBanned ? `${user.name} unbanned` : `${user.name} banned`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
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
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h2 className="text-2xl font-black text-foreground">Users</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {data?.pagination?.total || 0} registered users
          </p>
        </div>

        {/* Role filter */}
        <div className="flex gap-2">
          {['', 'user', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                roleFilter === r
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {r || 'All'}
            </button>
          ))}
        </div>
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
          placeholder="Search by name, email or phone..."
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
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-red-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-3">👤</div>
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user: any, i: number) => {
                  const isCurrentUser = user._id === currentUser?._id;
                  return (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* User info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarImage src={user.avatar?.url} />
                            <AvatarFallback className="bg-red-600 text-white text-sm font-bold">
                              {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground text-sm">{user.name}</p>
                              {isCurrentUser && (
                                <span className="text-[10px] bg-red-600/20 text-red-500 px-1.5 py-0.5 rounded font-bold">You</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-40">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {user.phone || '—'}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${
                            user.role === 'admin'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                          {user.role}
                        </Badge>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            user.isBanned
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                          }`}
                        >
                          {user.isBanned ? 'Banned' : 'Active'}
                        </Badge>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
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

                            {/* Toggle role */}
                            <DropdownMenuItem
                              onClick={() => handleToggleRole(user)}
                              disabled={isCurrentUser}
                            >
                              {user.role === 'admin'
                                ? <><ShieldOff className="w-4 h-4 mr-2" /> Remove Admin</>
                                : <><Shield className="w-4 h-4 mr-2" /> Make Admin</>
                              }
                            </DropdownMenuItem>

                            {/* Toggle ban */}
                            <DropdownMenuItem
                              onClick={() => handleToggleBan(user)}
                              disabled={isCurrentUser}
                            >
                              {user.isBanned
                                ? <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Unban User</>
                                : <><Ban className="w-4 h-4 mr-2 text-yellow-500" /> Ban User</>
                              }
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Delete */}
                            <DropdownMenuItem
                              onClick={() => setDeleteId(user._id)}
                              disabled={isCurrentUser}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
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

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2"
        >
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${
                data.pagination.page === p
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-accent text-muted-foreground border-border hover:border-red-500/50'
              }`}
            >
              {p}
            </button>
          ))}
        </motion.div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All data associated with this user will be permanently removed.
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