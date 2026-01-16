"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import { MatchPlanCommon } from "@/types/explore.interface";
import { TravelCardSkeleton } from "@/components/modules/travelPlans/TravelCardSkeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  Compass,
  Plane,
  Loader2
} from "lucide-react";

export default function ExplorePage() {
  const { user } = useAuth();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelType, setTravelType] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchPlanCommon[]>([]);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (destination.trim()) params.set("destination", destination.trim());
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);
      if (travelType && travelType !== "all") params.set("travelType", travelType);

      const query = params.toString();
      const url = `${API_BASE}/travel-plans/match${query ? `?${query}` : ""}`;

      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setMatches([]);
      } else {
        setMatches(json.matches || []);
      }
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 lg:text-5xl">
                Explore <span className="text-primary italic">Buddies</span>
              </h1>
              <p className="text-muted-foreground font-medium text-lg">
                Find your perfect travel companion for your next journey across Bangladesh.
              </p>
            </div>
            {user && (
              <Badge variant="secondary" className="w-fit h-8 px-4 bg-primary/10 text-primary border-none font-bold text-sm">
                Active: {user.email}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 -mt-10 space-y-10">
        <section>
          <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-4 lg:p-8">
              <form onSubmit={fetchMatches} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" /> Destination
                  </Label>
                  <Input
                    placeholder="e.g. Sajek Valley"
                    className="h-12 rounded-xl bg-zinc-50 border-zinc-100 focus:ring-primary"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-primary" /> Start Date
                  </Label>
                  <Input
                    type="date"
                    className="h-12 rounded-xl bg-zinc-50 border-zinc-100 focus:ring-primary"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <Users className="w-3 h-3 text-primary" /> Travel Type
                  </Label>
                  <Select value={travelType} onValueChange={setTravelType}>
                    <SelectTrigger className="h-12 rounded-xl bg-zinc-50 border-zinc-100 focus:ring-primary">
                      <SelectValue placeholder="All Styles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      <SelectItem value="SOLO">Solo Traveler</SelectItem>
                      <SelectItem value="FAMILY">Family Trip</SelectItem>
                      <SelectItem value="FRIENDS">With Friends</SelectItem>
                      <SelectItem value="COUPLE">Couple Trip</SelectItem>
                      <SelectItem value="GROUP">Large Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button size="lg" className="h-12 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Finding...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4" /> Search Buddies
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-zinc-800">
                Matched Itineraries
              </h2>
            </div>
            {!loading && (
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {matches.length} Travelers Found
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <TravelCardSkeleton key={i} />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <Card className="border-dashed bg-zinc-50/50 py-24 rounded-[3.5rem] border-2">
              <CardContent className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center">
                  <Compass className="w-10 h-10 text-zinc-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">
                    {initialLoaded ? "No matches yet" : "Let's find your tribe"}
                  </h3>
                  <p className="text-muted-foreground max-w-sm font-medium">
                    {initialLoaded 
                      ? "Try broadening your filters or looking for popular spots like Cox's Bazar or Sylhet."
                      : "Enter a destination to see people heading your way."}
                  </p>
                </div>
                {initialLoaded && (
                  <Button variant="outline" className="rounded-full px-8 h-12 font-bold" onClick={() => { setDestination(""); fetchMatches(); }}>
                    Reset Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matches.map((plan) => (
                <MatchCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MatchCard({ plan }: { plan: MatchPlanCommon }) {
  const formatDate = (date?: string) => 
    date ? new Date(date).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" }) : "TBD";

  return (
    <Card className="group overflow-hidden rounded-[2.5rem] border-zinc-100 transition-all duration-300 hover:border-primary/20 hover:shadow-2xl bg-white">
      <CardHeader className="p-8 pb-4 space-y-4">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-black uppercase tracking-widest px-4 py-1.5 flex items-center gap-2">
             <Plane className="w-3 h-3" /> {plan.travelType}
          </Badge>
          <div className="flex items-center text-[11px] font-bold text-zinc-400 gap-1.5 uppercase tracking-tighter">
            <Calendar className="w-4 h-4" />
            {formatDate(plan.startDate)}
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {plan.title || plan.destination}
          </CardTitle>
          <div className="flex items-center gap-1.5 mt-2 text-zinc-500 font-bold text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            {plan.destination}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 pt-4">
        <div className="bg-zinc-50 rounded-2xl p-4 flex items-center justify-between border border-zinc-100">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={plan.host.profileImage || ""} />
              <AvatarFallback className="bg-zinc-200 text-xs font-bold text-zinc-600">
                {plan.host.fullName?.substring(0, 2).toUpperCase() || "TH"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-zinc-900 line-clamp-1">{plan.host.fullName || "Traveler"}</p>
                {plan.host.isVerifiedBadge && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
              </div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                Verified Host
              </p>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary hover:text-white transition-all" asChild>
            <Link href={`/travel-plans/${plan.id}`}>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>

      <CardFooter className="px-8 pb-8 pt-0">
        <Button className="w-full h-14 rounded-2xl font-black text-md tracking-tight transition-all shadow-md group-hover:shadow-primary/20" asChild>
          <Link href={`/travel-plans/${plan.id}`}>
            View Full Itinerary
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}