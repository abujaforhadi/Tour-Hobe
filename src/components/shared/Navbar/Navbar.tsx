/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, LogOut, Compass, Map, Home, Info, HelpCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type TourStep = 0 | 1 | 2;

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState<TourStep>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("Tour Hobe_nav_tour_seen");
    if (!seen) {
      setShowTour(true);
      setTourStep(0);
    }
  }, []);

  const closeTour = () => {
    setShowTour(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("Tour Hobe_nav_tour_seen", "1");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) return <Loader />;

  const tourRing = "ring-2 ring-primary ring-offset-4 ring-offset-background animate-pulse";
  const highlightExplore = showTour && tourStep === 0 ? tourRing : "";
  const highlightPlans = showTour && tourStep === 1 ? tourRing : "";
  const highlightAuth = showTour && tourStep === 2 ? tourRing : "";

  const navLinks = [
    { name: "Home", href: "/", icon: Home, highlight: highlightExplore },
    { name: "Explore", href: "/explore", icon: Compass, highlight: highlightExplore },
    { name: "All Plans", href: "/travel-plans", icon: Map, highlight: highlightPlans },
    { name: "About", href: "/about", icon: Info, highlight: "" },
    { name: "FAQ", href: "/faq", icon: HelpCircle, highlight: "" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg">
            <Compass className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            TOUR<span className="text-primary">HOBE</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              asChild
              className={`text-sm font-medium transition-all ${link.highlight}`}
            >
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Badge variant="secondary" className="font-mono">ADMIN</Badge>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleLogout}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className={highlightAuth}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className={highlightAuth}>
                  <Link href="/register">Join Now</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left font-bold text-xl">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-muted ${link.highlight}`}
                  >
                    <link.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-lg">{link.name}</span>
                  </Link>
                ))}
                
                <div className="h-px bg-border my-2" />
                
                {user ? (
                  <div className="space-y-3">
                    <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-lg">My Profile</span>
                    </Link>
                    <Button variant="destructive" className="w-full justify-start gap-4 px-4 h-12 rounded-xl" onClick={() => { handleLogout(); setOpen(false); }}>
                      <LogOut className="w-5 h-5" />
                      <span className="text-lg">Logout</span>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" asChild className="h-12 rounded-xl">
                      <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="h-12 rounded-xl">
                      <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}