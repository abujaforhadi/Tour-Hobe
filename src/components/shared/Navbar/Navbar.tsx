"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "../Loader";
import { Menu } from "lucide-react"; // Icon for hamburger menu

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  if (loading) return <Loader />;

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-semibold" : "text-muted-foreground";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  // Define navigation items to map through them (DRY principle)
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "All Plans", path: "/travel-plans" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Left Side: Logo & Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left text-2xl font-bold">
                  Tour<span className="text-primary">Hobe</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-6 py-6">
                {/* Mobile Nav Links */}
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg ${isActive(item.path)}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Buttons (Only if not logged in) */}
                {!user && (
                  <div className="flex flex-col gap-3 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleMobileLinkClick("/login")}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => handleMobileLinkClick("/register")}
                      className="w-full"
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Tour<span className="text-primary">Hobe</span>
          </Link>
        </div>

        {/* Desktop Nav (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={isActive(item.path)}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side: Auth (Avatar or Desktop Login Buttons) */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-muted outline-none focus:ring-2 ring-primary/20">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">
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

                <DropdownMenuItem onClick={() => router.push("/user/dashboard")}>
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
            // Desktop Login Buttons (Hidden on mobile to save space)
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
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