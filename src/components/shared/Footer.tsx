"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-tighter">
              TOUR<span className="text-primary">HOBE</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate platform for modern explorers in Bangladesh. Discover 
              companion-led journeys, share costs, and create memories.
            </p>
          </div>

          {/* Quick Navigation - Validated Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Explore Destinations
              </Link>
              <Link href="/travel-plans" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                All Travel Plans
              </Link>
            </nav>
          </div>

          {/* Support & Company - Validated Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Frequently Asked Questions
              </Link>
            </nav>
          </div>

          {/* Platform Stats */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Community Impact</h3>
            <div className="grid grid-cols-2 gap-2">
              <Card className="bg-muted/50 border-none shadow-none rounded-xl">
                <CardContent className="p-3">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Explorers</p>
                  <p className="text-lg font-black text-primary">25k+</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50 border-none shadow-none rounded-xl">
                <CardContent className="p-3">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Trips</p>
                  <p className="text-lg font-black text-primary">12k+</p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            © {new Date().getFullYear()} Tour Hobe. Built for the Bangladeshi Travel Community.
          </p>
          
          {/* Social Links - Ensure these point to your professional profiles if possible */}
          <div className="flex items-center gap-6">
            <Link 
              href="https://linkedin.com/in/abujaforhadi" 
              target="_blank" 
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              LinkedIn
            </Link>
            <Link 
              href="https://github.com/abujaforhadi" 
              target="_blank" 
              className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;