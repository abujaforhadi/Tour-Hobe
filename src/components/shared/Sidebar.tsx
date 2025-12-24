'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Layers,
  Activity,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  X,
  LayoutDashboard
} from 'lucide-react';

import Swal from 'sweetalert2';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Optimized Navigation Groups for Admin
  const menuGroups = [
    {
      group: "Overview",
      items: [
        { name: ' Home', href: '/', icon: LayoutDashboard },
      ]
    },
    {
      group: "Management",
      items: [
        { name: 'User Registry', href: '/admin/user-management', icon: Users },
        { name: 'Global Plans', href: '/admin/plan-management', icon: Layers },
      ]
    },
    {
      group: "Monitoring",
      items: [
        { name: 'Transactions', href: '/admin/transaction-history', icon: Activity },
        { name: 'Review Feed', href: '/admin/all-reviews', icon: MessageSquare },
      ]
    }
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'End Session?',
      text: 'Are you sure you want to log out of the admin panel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#18181b',
      confirmButtonText: 'Yes, Logout',
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
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-xl bg-white shadow-xl border-zinc-200"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} className="text-primary" />}
      </Button>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 85 : 280 }}
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-white border-r border-zinc-100 flex flex-col transition-all duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="p-6 mb-2">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className="bg-zinc-900 p-2 rounded-xl shadow-lg shadow-zinc-200">
                  <Sparkles className="text-primary w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter text-zinc-900 italic leading-none">
                    Tour <span className="text-primary">Hobe</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Admin</span>
                </div>
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex rounded-full hover:bg-zinc-50 h-8 w-8"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>
        </div>

        {/* Navigation Content */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-8 pt-2 pb-6">
            {menuGroups.map((group, idx) => (
              <div key={idx} className="space-y-3">
                {!isCollapsed && (
                  <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">
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
                              ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200' 
                              : 'text-zinc-500 hover:bg-zinc-50 hover:text-primary'
                          }`}
                        >
                          <item.icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary transition-colors'} />
                          {!isCollapsed && (
                            <span className="text-sm font-bold tracking-tight">{item.name}</span>
                          )}
                          {active && !isCollapsed && (
                            <motion.div
                              layoutId="admin-active-pill"
                              className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary"
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

        {/* Admin Profile & Logout Section */}
        <div className="p-4 mt-auto border-t border-zinc-100 bg-zinc-50/50">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200/50 shadow-sm ${isCollapsed ? 'justify-center' : ''}`}>
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src={user?.profileImage || '/default-profile.png'} />
              <AvatarFallback className="bg-zinc-900 text-primary font-black text-xs">
                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-black text-zinc-900 truncate tracking-tight">
                    {user?.fullName || 'Administrator'}
                  </p>
                  <ShieldCheck className="w-3 h-3 text-primary" />
                </div>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter truncate">
                  Master Access
                </p>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`mt-4 w-full flex items-center gap-3 rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600 font-bold text-sm transition-all ${
              isCollapsed ? 'justify-center' : 'justify-start px-4'
            }`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>End Session</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Glass Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}