"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tighter">
              TOUR<span className="text-primary">HOBE</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate platform for modern explorers. Discover companion-led 
              journeys, share costs, and create memories that last a lifetime.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Platform</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/travel-plans" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Available Trips
              </Link>
              <Link href="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Find Companions
              </Link>
              <Link href="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Travel Community
              </Link>
              <Link href="/guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                How it Works
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/safety" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Safety Trust
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Platform Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-muted/50 border-none shadow-none">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">Explorers</p>
                  <p className="text-lg font-bold">25k+</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 border-none shadow-none">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">Destinations</p>
                  <p className="text-lg font-bold">180+</p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      <Separator />

      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tour Hobe Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Twitter</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">Instagram</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">LinkedIn</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;