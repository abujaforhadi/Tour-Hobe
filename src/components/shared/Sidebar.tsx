'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ActivitySquare
} from 'lucide-react';

import Swal from 'sweetalert2';
import useAuth from '@/hooks/useAuth';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { name: 'Users', href: '/admin/user-management', icon: Users },
    { name: 'Plans', href: '/admin/plan-management', icon: Layers },
    { name: 'All Transactions', href: '/admin/transaction-history', icon: Activity },
    { name: 'All Reviews', href: '/admin/all-reviews', icon: ActivitySquare },
    { name: 'Home', href: '/', icon: Home },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EA580C', // orange-500
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
      background: '#ffffff',
      color: '#1F2937',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        confirmButton: 'bg-gradient-to-r from-primary to-primary text-white font-semibold py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300',
        cancelButton: 'bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-xl hover:bg-gray-300 transition-all duration-300'
      }
    });

    if (result.isConfirmed) {
      await logout();

      await Swal.fire({
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonColor: '#EA580C',
        background: '#ffffff',
        color: '#1F2937',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          confirmButton: 'bg-gradient-to-r from-primary to-primary text-white font-semibold py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300'
        }
      });
      window.location.href = '/login';
    }
  };

  return (
    <>
   
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-primary" />
      </button>

   
      <aside
        className={`bg-white dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-300 flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          fixed md:sticky top-0 left-0 h-screen z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transform`}
        aria-label="Main sidebar"
      >
    
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed && (
             
                
                <span className="text-base font-extrabold bg-linear-to-r from-primary to-gray-700 bg-clip-text text-transparent leading-tight">
                  Admin Dashboard
                </span>
             
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

     
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group
                      ${isActive
                        ? 'bg-linear-to-r from-orange-50 to-gray-50 dark:from-orange-900/10 dark:to-gray-800/10 text-primary shadow'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary'
                      }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      size={20}
                      className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}
                    />
                    {!isCollapsed && <span className="font-semibold text-sm">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

       
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className={`flex items-center gap-3 p-3 rounded-xl ${isCollapsed ? 'justify-center' : ''} bg-gray-50 dark:bg-gray-800/50 mb-4`}>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-gray-700 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <LogOut size={18} className="text-red-600" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
