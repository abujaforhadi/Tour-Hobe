'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sparkles,
  LayoutDashboard,
  CreditCard,
  Compass,
  History,
  User,
  X,
  Plane
} from 'lucide-react';

import Swal from 'sweetalert2';
import useAuth from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function UserSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Navigation grouping
  const menuGroups = [
    {
      group: "Core",
      items: [
        { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
        { name: 'Explore Home', href: '/', icon: Home },
      ]
    },
    {
      group: "Travel Management",
      items: [
        { name: 'My Posted Plans', href: '/user/my-posted-plan', icon: Compass },
        { name: 'Buddy Matches', href: '/user/dashboard/matches', icon: Plane },
      ]
    },
    {
      group: "Billing & Account",
      items: [
        { name: 'Make Payment', href: '/user/payment', icon: CreditCard },
        { name: 'Payment History', href: '/user/my-payment-history', icon: History },
        { name: 'My Profile', href: '/profile', icon: User },
      ]
    }
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to end your session?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#18181b',
      confirmButtonText: 'Yes, Sign Out',
      customClass: {
        popup: 'rounded-[2rem] border-none shadow-2xl',
        confirmButton: 'rounded-xl font-bold px-6 py-3',
        cancelButton: 'rounded-xl font-bold px-6 py-3'
      }
    });

    if (result.isConfirmed) {
      await logout();
      window.location.href = '/login';
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-xl bg-white shadow-xl border-zinc-200"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} className="text-primary" />}
      </Button>

      {/* Sidebar Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-white border-r border-zinc-100 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="bg-zinc-900 p-2 rounded-xl">
                <Sparkles className="text-primary w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter text-zinc-900 italic">
                Tour <span className="text-primary">Hobe</span>
              </span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex rounded-full hover:bg-zinc-50"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pt-2 pb-6">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-2">
                {!isCollapsed && (
                  <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {group.group}
                  </h3>
                )}
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`relative flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                            active 
                              ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                              : 'text-zinc-500 hover:bg-zinc-50 hover:text-primary'
                          }`}
                        >
                          <item.icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary'} />
                          {!isCollapsed && (
                            <span className="text-sm font-bold tracking-tight">{item.name}</span>
                          )}
                          {active && !isCollapsed && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="p-4 border-t border-zinc-100">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-100 ${isCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
              <AvatarImage src={user?.profileImage || undefined} />
              <AvatarFallback className="bg-primary text-white font-black text-xs">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-zinc-900 truncate tracking-tight">
                  {user?.fullName || 'Traveler'}
                </p>
                <p className="text-[10px] text-zinc-400 font-bold truncate uppercase tracking-tighter">
                  {user?.isPremium ? 'Premium Explorer' : 'Standard'}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`mt-4 w-full flex items-center gap-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 font-bold text-sm ${
              isCollapsed ? 'justify-center' : 'justify-start px-4'
            }`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}