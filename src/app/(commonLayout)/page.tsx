"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import HomeMatchedTravelers from "@/components/modules/homePage/SuggestedBuddy/HomeMatchedTravelers";
import { TravelPlan } from "@/types/homePage.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Users,
  ShieldCheck,
  ArrowRight,
  Backpack,
  Map,
  Zap,
  Globe,
  MessageSquare,
  Search,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchMatches();
  }, [user]);

  async function fetchMatches() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
        credentials: "include",
      });
      await res.json();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <section className="relative overflow-hidden bg-zinc-50 py-10">
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="outline"
              className="mb-6 rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 font-bold uppercase tracking-widest text-primary"
            >
              Bangladesh&apos;s Premier Travel Network
            </Badge>
            <h1 className="text-5xl font-black leading-[1.1] tracking-tighter text-zinc-900 md:text-7xl lg:text-8xl">
              Stop Waiting. <br />
              <span className="italic text-primary underline decoration-zinc-200 underline-offset-8">Tour Hobe!</span>
            </h1>
            <p className="mx-auto mt-10 max-w-2xl text-lg font-medium leading-relaxed text-zinc-600 md:text-xl">
              No more cancelled plans. Connect with verified travel partners across Bangladesh. 
              Share the costs, double the fun, and make every journey a reality.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-16 rounded-2xl px-12 text-lg font-black shadow-2xl shadow-primary/20 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/travel-plans">Find a Travel Buddy</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 rounded-2xl border-2 bg-white px-12 text-lg font-black hover:bg-zinc-50"
                asChild
              >
                <Link href="/explore">Explore Recent Trips</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4 text-sm font-bold text-zinc-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-4 border-zinc-50 bg-zinc-200" />
                ))}
              </div>
              <p>Trusted by <span className="text-zinc-900">12,000+</span> Explorers</p>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </section>

      {user && (
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <HomeMatchedTravelers />
          </div>
        </section>
      )}

    

      <section className="container mx-auto px-6 pb-32">
        <div className="relative overflow-hidden rounded-[4rem] bg-zinc-900 p-12 text-center text-white shadow-2xl md:p-24 lg:p-32">
          <div className="relative z-10 mx-auto max-w-3xl space-y-10">
            <h2 className="text-5xl font-black leading-tight tracking-tighter md:text-7xl">
              Don&apos;t travel <span className="text-primary italic">solo</span> unless you want to.
            </h2>
            <p className="text-xl font-medium opacity-70 md:text-2xl">
              Join the movement that&apos;s changing the way Bangladeshis explore. Find your tribe in minutes.
            </p>
            <div className="pt-6">
              <Button
                size="lg"
                className="h-20 rounded-full bg-primary px-16 text-2xl font-black text-white transition-transform hover:scale-105"
                asChild
              >
                <Link href="/register">Join the Community</Link>
              </Button>
            </div>
          </div>

          <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
        </div>
      </section>
    </div>
  );
}