"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import { MatchedPlan, MatchesByPlan } from "@/types/matches.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, CheckCircle2, Compass } from "lucide-react";

export default function HomeMatchedTravelers() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMatches();
  }, [user]);

  async function fetchMatches() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
        credentials: "include",
      });
      const json = await res.json();

      if (!json.success) return;

      const matchesByPlan: MatchesByPlan = json.matchesByPlan || {};
      const uniqueMap = new Map<string, MatchedPlan>();

      Object.values(matchesByPlan).forEach((plans) => {
        plans.forEach((plan) => {
          if (!uniqueMap.has(plan.host.id)) {
            uniqueMap.set(plan.host.id, plan);
          }
        });
      });

      setMatches(Array.from(uniqueMap.values()).slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user || loading) return null;

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900">
              Matches Found for You
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              Based on your recent interests and destinations
            </p>
          </div>
          {matches.length > 0 && (
            <Button variant="ghost" asChild className="hidden sm:flex font-bold text-primary">
              <Link href="/explore">View All Matches</Link>
            </Button>
          )}
        </div>

        {matches.length === 0 ? (
          <Card className="border-dashed bg-zinc-50/50 shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <Compass className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">No buddies matched yet</h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs font-medium">
                Post a travel plan or update your preferences to find like-minded travelers.
              </p>
              <Button asChild className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
                <Link href="/explore">
                  <Search className="w-4 h-4 mr-2" />
                  Search Travel Buddy
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 3).map((plan) => (
              <Card key={plan.host.id} className="group overflow-hidden border-zinc-100 transition-all hover:border-primary/20 hover:shadow-xl">
                <CardHeader className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage src={plan.host.profileImage || ""} alt={plan.host.fullName || "User"} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                          {plan.host.fullName?.substring(0, 2).toUpperCase() || "TH"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-zinc-900 line-clamp-1">
                            {plan.host.fullName || "Traveler"}
                          </h4>
                          {plan.host.isVerifiedBadge && (
                            <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/10" />
                          )}
                        </div>
                        <div className="flex items-center text-xs text-zinc-500 font-medium mt-0.5">
                          <MapPin className="w-3 h-3 mr-1 text-primary" />
                          {plan.destination}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-100 text-[10px] font-bold uppercase tracking-wider">
                      {plan.travelType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-2">
                  <div className="h-px bg-zinc-100 w-full mb-4" />
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Suggested For</p>
                  <p className="text-sm font-semibold text-zinc-700 mt-1">Upcoming {plan.destination} Journey</p>
                </CardContent>
                <CardFooter className="p-6">
                  <Button asChild className="w-full rounded-xl font-bold transition-all group-hover:bg-primary group-hover:text-white" variant="outline">
                    <Link href={`/travel-plans/${plan.id}`}>
                      View Full Plan
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}