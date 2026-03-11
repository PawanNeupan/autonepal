'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

// Reusable fade-up animation
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${data.user.name}`);
      router.push(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-600 focus:ring-0 transition-colors rounded-lg';
  const labelClass = 'text-zinc-400 text-xs uppercase tracking-widest';

  return (
    <div className="space-y-7">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="space-y-1.5">
        <p className="text-xs text-red-500 tracking-[0.2em] uppercase font-medium">
          Welcome back
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Sign in to AutoNepal
        </h1>
        <p className="text-zinc-500 text-sm">
          Access your garage, orders and listings
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <motion.div {...fadeUp(0.07)} className="space-y-1.5">
          <Label htmlFor="email" className={labelClass}>Email Address</Label>
          <Input
            id="email" name="email" type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </motion.div>

        {/* Password */}
        <motion.div {...fadeUp(0.14)} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className={labelClass}>Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-red-500/70 hover:text-red-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password" name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div {...fadeUp(0.21)} className="pt-1">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide rounded-lg transition-all duration-200 group shadow-lg shadow-red-600/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </motion.div>

      </form>

      {/* Divider */}
      <motion.div {...fadeUp(0.28)} className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-xs">or</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </motion.div>

      {/* Register link */}
      <motion.div {...fadeUp(0.35)}>
        <Link href="/register">
          <Button
            variant="outline"
            className="w-full h-12 bg-transparent border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 rounded-lg transition-all duration-200 font-medium"
          >
            Create a new account
          </Button>
        </Link>
      </motion.div>

    </div>
  );
}