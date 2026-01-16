"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "../Loader";
import { Menu, LogIn, UserPlus, LayoutDashboard, User } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
        
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[300px] flex flex-col p-0">
              <div className="bg-muted/40 p-6 border-b">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-xl font-bold mb-4">
                    Tour<span className="text-primary">Hobe</span>
                  </SheetTitle>
                </SheetHeader>
                
                {user ? (
                   <div className="flex items-center gap-3">
                     <Avatar className="h-10 w-10 border">
                       <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                         {user.email?.charAt(0).toUpperCase()}
                       </AvatarFallback>
                     </Avatar>
                     <div className="overflow-hidden">
                       <p className="text-sm font-medium truncate">{user.email}</p>
                       <p className="text-xs text-muted-foreground">Welcome back</p>
                     </div>
                   </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Menu
                  </p>
                )}
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 overflow-auto py-4 px-4">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`justify-start text-base ${isActive(item.path)}`}
                      onClick={() => handleMobileLinkClick(item.path)}
                    >
                      {item.name}
                    </Button>
                  ))}

                  {!user && (
                    <>
                      <Separator className="my-4" />
                      <Button 
                        variant="ghost" 
                        className="justify-start text-base"
                        onClick={() => handleMobileLinkClick("/register")}
                      >
                         <UserPlus className="mr-2 h-4 w-4" /> Register
                      </Button>
                    </>
                  )}

                  {user && (
                    <>
                      <Separator className="my-4" />
                      <Button
                        variant="ghost"
                        className="justify-start text-base"
                        onClick={() => handleMobileLinkClick("/user/dashboard")}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-base"
                        onClick={() => handleMobileLinkClick("/profile")}
                      >
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start text-base text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="text-2xl font-bold">
            Tour<span className="text-primary">Hobe</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={isActive(item.path)}>
              {item.name}
            </Link>
          ))}
        </div>

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
                  <span className="hidden md:block text-sm font-medium">{user.email}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push("/user/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // NOT LOGGED IN
            <div className="flex items-center gap-2">
              {/* Login Button - Visible on ALL screens */}
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => router.push("/login")}
              >
                Login
              </Button>

              {/* Register Button - Hidden on Mobile, Visible on Desktop */}
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}