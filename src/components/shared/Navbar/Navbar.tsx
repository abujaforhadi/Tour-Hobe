"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "../Loader";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <Loader />;

  const isActive = (path: string) =>
    pathname === path ? "text-primary border-b-2 border-primary" : "text-muted-foreground";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-lg font-semibold">
          Tour<span className="text-primary">Hobe</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={`pb-1 text-sm font-medium ${isActive("/")}`}>
            Home
          </Link>

          <Link href="/explore" className={`pb-1 text-sm font-medium ${isActive("/explore")}`}>
            Explore
          </Link>

          <Link href="/travel-plans" className={`pb-1 text-sm font-medium ${isActive("/travel-plans")}`}>
            All Plans
          </Link>

          <Link href="/about" className={`pb-1 text-sm font-medium ${isActive("/about")}`}>
            About
          </Link>

          <Link href="/faq" className={`pb-1 text-sm font-medium ${isActive("/faq")}`}>
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
                      {user.name?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {user.name ?? "User"}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="truncate font-medium">{user.email}</div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/user")}>
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>

                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    Admin Panel
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
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
