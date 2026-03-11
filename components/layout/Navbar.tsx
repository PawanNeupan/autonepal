'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Car, Heart, ShoppingBag, Bell, Menu, X,
  ChevronDown, User, Settings, LogOut,
  Shield, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Cars', href: '/cars' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const USER_LINKS = [
  { label: 'My Orders', href: '/my-orders' },
  { label: 'Favorites', href: '/favorites' },
  { label: 'Sell Your Car', href: '/sell' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Hide navbar on admin pages
  if (pathname.startsWith('/admin')) return null;
  // Hide on auth pages
  if (pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password')) return null;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── LOGO ── */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-600/30"
              >
                <Car className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-black text-lg tracking-wider">
                AUTO<span className="text-red-500">NEPAL</span>
              </span>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ y: -1 }}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* ── RIGHT SECTION ── */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {theme === 'dark'
                    ? <Sun className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />}
                </motion.button>
              )}

              {isAuthenticated && user ? (
                <>
                  {/* Favorites */}
                  <Link href="/favorites">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.div>
                  </Link>

                  {/* Orders */}
                  <Link href="/my-orders">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </motion.div>
                  </Link>

                  {/* Notifications */}
                  <Link href="/notifications">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.div>
                  </Link>

                  {/* User dropdown */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="hidden sm:flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:border-red-500/30 hover:bg-accent transition-all"
                      >
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user.avatar?.url} />
                          <AvatarFallback className="bg-red-600 text-white text-xs font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium max-w-20 truncate">
                          {user.name?.split(' ')[0]}
                        </span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                      </motion.button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52 mt-2">
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => router.push('/sell')}>
                        <Car className="w-4 h-4 mr-2" />
                        Sell Your Car
                      </DropdownMenuItem>

                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push('/admin')}>
                            <Shield className="w-4 h-4 mr-2 text-red-500" />
                            <span className="text-red-500 font-medium">Admin Panel</span>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-500 focus:text-red-500"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-500 text-white font-medium shadow-md shadow-red-600/20"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="sm:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>

            </div>
          </div>
        </div>
      </motion.header>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background border-l border-border shadow-2xl sm:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                    <Car className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black tracking-wider text-sm">
                    AUTO<span className="text-red-500">NEPAL</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User info (if logged in) */}
              {isAuthenticated && user && (
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar?.url} />
                      <AvatarFallback className="bg-red-600 text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <div className="p-4 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest px-3 mb-2">
                  Navigation
                </p>
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? 'bg-red-600/10 text-red-500'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
                      )}
                    </Link>
                  </motion.div>
                ))}

                {/* User links if authenticated */}
                {isAuthenticated && (
                  <>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest px-3 mt-4 mb-2">
                      My Account
                    </p>
                    {USER_LINKS.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.06 }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    {user?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
              </div>

              {/* Bottom actions */}
              <div className="p-4 border-t border-border space-y-2 mt-auto">
                {/* Theme toggle */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors"
                  >
                    {theme === 'dark'
                      ? <Sun className="w-4 h-4" />
                      : <Moon className="w-4 h-4" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-red-600 hover:bg-red-500 text-white">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide under navbar */}
      <div className="h-16" />
    </>
  );
}