/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { MatchesTravelPlan } from "@/types/matches.interface";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Search,
  Compass
} from "lucide-react";

export default function MatchesPage() {
  const { user } = useAuth();
  const [upcomingPlans, setUpcomingPlans] = useState<MatchesTravelPlan[]>([]);
  const [matchesByPlan, setMatchesByPlan] = useState<Record<string, MatchesTravelPlan[]>>({});
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
      const json = await res.json();
      if (res.ok && json.success) {
        setUpcomingPlans(json.upcomingPlans || []);
        setMatchesByPlan(json.matchesByPlan || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-zinc-100 rounded-full text-zinc-400">
          <Users className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold">Please login to view matches</h2>
        <Button asChild className="rounded-xl">
          <Link href="/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      {/* Header Section */}
      <header className="bg-white border-b py-10 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" asChild>
                  <Link href="/user/dashboard">
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
                  Buddy Finder
                </Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                Matched <span className="text-primary italic">Travelers</span>
              </h1>
              <p className="text-muted-foreground font-medium">
                We found people heading to the same destinations during your dates.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl font-bold bg-white shadow-sm" asChild>
              <Link href="/user/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-10">
        {upcomingPlans.length === 0 ? (
          <Card className="border-dashed bg-white py-20 rounded-[3rem] text-center max-w-2xl mx-auto border-2">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mx-auto">
                <Compass className="w-10 h-10 text-zinc-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">No upcoming plans</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                  You need to have an active trip plan to find matching travel buddies.
                </p>
              </div>
              <Button asChild className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
                <Link href="/travel-plans/add">Create a Plan</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {upcomingPlans.map((plan) => {
              const matches = matchesByPlan[plan.id] || [];
              return (
                <section key={plan.id} className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-zinc-900 text-primary rounded-2xl">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                          Matches for {plan.title || plan.destination}
                        </h2>
                        <div className="flex items-center gap-3 text-sm font-bold text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(plan.startDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{matches.length} Travelers Found</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="link" className="text-primary font-bold p-0 h-auto" asChild>
                      <Link href={`/travel-plans/${plan.id}`}>View My Itinerary</Link>
                    </Button>
                  </div>

                  {matches.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-10 border border-dashed border-zinc-200 text-center">
                      <p className="text-zinc-500 font-medium italic">Searching for buddies... We&apos;ll notify you when someone matches your destination.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {matches.map((match) => (
                        <BuddyCard key={match.id} match={match} />
                      ))}
                    </div>
                  )}
                  <Separator className="mt-8 opacity-50" />
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------ REFINED BUDDY CARD ------------------ */

function BuddyCard({ match }: { match: MatchesTravelPlan }) {
  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString("en-BD", { month: "short", day: "numeric" });

  return (
    <Card className="group overflow-hidden rounded-[2.5rem] border-zinc-100 transition-all hover:border-primary/20 hover:shadow-2xl bg-white flex flex-col">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 border-4 border-white shadow-md">
            <AvatarImage src={match.host.profileImage || ""} />
            <AvatarFallback className="bg-primary/5 text-primary font-bold">
              {match.host.fullName?.substring(0, 2).toUpperCase() || "TH"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-zinc-900 line-clamp-1">{match.host.fullName || "Traveler"}</h4>
              {match.host.isVerifiedBadge && (
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10" />
              )}
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest truncate">
              {match.title || match.destination}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-4 flex-1">
        <div className="flex items-center justify-between bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Travel Dates</p>
            <p className="text-xs font-bold text-zinc-700">
              {formatDate(match.startDate)} - {formatDate(match.endDate)}
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold">
            Match Found
          </Badge>
        </div>
      </CardContent>

      <div className="px-6 pb-6">
        <Button className="w-full rounded-xl font-bold group-hover:bg-primary transition-colors" asChild>
          <Link href={`/travel-plans/${match.id}`}>
            View Plan & Connect
          </Link>
        </Button>
      </div>
    </Card>
  );
}