"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "../Loader";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (loading) return <Loader />;

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-semibold" : "text-muted-foreground";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          Tour<span className="text-primary">Hobe</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={isActive("/")}>
            Home
          </Link>

          <Link href="/explore" className={isActive("/explore")}>
            Explore
          </Link>

          <Link href="/travel-plans" className={isActive("/travel-plans")}>
            All Plans
          </Link>

          <Link href="/about" className={isActive("/about")}>
            About
          </Link>

          <Link href="/faq" className={isActive("/faq")}>
            FAQ
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm">
                    {user.email}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Signed in as
                  <div className="truncate font-medium text-foreground">
                    {user.email}
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/user")}>
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>

                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    Admin
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
