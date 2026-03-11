'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, MoveRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(password) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-1.5 pt-1 overflow-hidden"
    >
      {checks.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
              c.pass ? 'bg-green-500/20' : 'bg-zinc-800'
            }`}
          >
            {c.pass
              ? <Check className="w-2 h-2 text-green-400" />
              : <X className="w-2 h-2 text-zinc-600" />}
          </div>
          <span
            className={`text-xs transition-colors duration-300 ${
              c.pass ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            {c.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(
        formData.name, formData.email,
        formData.phone, formData.password
      );
      toast.success(`Welcome, ${data.user.name}!`);
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-600 focus:ring-0 transition-colors rounded-lg';
  const labelClass = 'text-zinc-400 text-xs uppercase tracking-widest';

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="space-y-1.5">
        <p className="text-xs text-red-500 tracking-[0.2em] uppercase font-medium">
          New member
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Create your account
        </h1>
        <p className="text-zinc-500 text-sm">
          Join thousands of car buyers and sellers in Nepal
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name + Phone row */}
        <motion.div {...fadeUp(0.06)} className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className={labelClass}>Full Name</Label>
            <Input
              id="name" name="name"
              placeholder="Ram Bahadur"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className={labelClass}>Phone</Label>
            <Input
              id="phone" name="phone" type="tel"
              placeholder="98XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div {...fadeUp(0.12)} className="space-y-1.5">
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
        <motion.div {...fadeUp(0.18)} className="space-y-1.5">
          <Label htmlFor="password" className={labelClass}>Password</Label>
          <div className="relative">
            <Input
              id="password" name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
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
          <AnimatePresence>
            {formData.password && (
              <PasswordStrength password={formData.password} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Confirm Password */}
        <motion.div {...fadeUp(0.24)} className="space-y-1.5">
          <Label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword" name="confirmPassword" type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`${inputClass} pr-11 ${
                formData.confirmPassword
                  ? passwordsMatch ? 'border-green-600/50' : 'border-red-600/50'
                  : ''
              }`}
            />
            <AnimatePresence>
              {formData.confirmPassword && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                >
                  {passwordsMatch
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <X className="w-4 h-4 text-red-500" />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div {...fadeUp(0.30)} className="pt-1">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-red-600 hover:bg-red-500 text-white font-bold tracking-wide rounded-lg transition-all duration-200 group shadow-lg shadow-red-600/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account
                <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </motion.div>

      </form>

      {/* Divider */}
      <motion.div {...fadeUp(0.36)} className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-zinc-600 text-xs">already a member?</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </motion.div>

      {/* Login link */}
      <motion.div {...fadeUp(0.42)}>
        <Link href="/login">
          <Button
            variant="outline"
            className="w-full h-12 bg-transparent border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300 rounded-lg transition-all duration-200 font-medium"
          >
            Sign in instead
          </Button>
        </Link>
      </motion.div>

    </div>
  );
}