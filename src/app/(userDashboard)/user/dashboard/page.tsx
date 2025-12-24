/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Users, 
  Star, 
  MapPin, 
  Calendar, 
  Compass, 
  ArrowUpRight,
  PlaneTakeoff,
  Luggage
} from "lucide-react";

type Host = {
  id: string;
  fullName?: string;
  profileImage?: string;
};

type TravelPlan = {
  id: string;
  title?: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  host: Host;
};

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-black">Authentication Required</h2>
        <p className="text-zinc-500">Please login to access your personal dashboard.</p>
        <Button asChild className="rounded-xl font-bold">
          <Link href="/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  if (loading) return <Loader />;

  const hostedPlans: TravelPlan[] = data?.hostedPlans || [];
  const joinedPlans: TravelPlan[] = data?.joinedPlans || [];
  const reviewableTrips: TravelPlan[] = data?.reviewableTrips || [];

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      {/* Header / Top Bar */}
      <div className="bg-white border-b py-10 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-4 border-zinc-50 shadow-sm">
                <AvatarImage src={user.profileImage || ""} />
                <AvatarFallback className="bg-primary text-white text-xl font-black">
                  {user.fullName?.substring(0, 2).toUpperCase() || "TH"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-zinc-900">
                  Welcome, <span className="text-primary italic">{user.fullName || user.email.split('@')[0]}</span>
                </h1>
                <div className="flex items-center gap-2 text-zinc-500 font-medium">
                  <Badge variant="secondary" className="bg-zinc-100">{hostedPlans.length + joinedPlans.length} Trips Total</Badge>
                  <span>•</span>
                  <p className="text-sm">Managing your BD adventures</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" className="rounded-xl border-zinc-200 font-bold" asChild>
                <Link href="/user/dashboard/matches">
                  <Users className="w-4 h-4 mr-2" />
                  Buddy Matches
                </Link>
              </Button>
              <Button className="rounded-xl font-black shadow-lg shadow-primary/20" asChild>
                <Link href="/travel-plans/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Trip
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 mt-10 space-y-12">
        {/* Hosted Trips */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <PlaneTakeoff className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-2xl font-black">Trips You&apos;re Hosting</h2>
          </div>
          
          {hostedPlans.length === 0 ? (
            <EmptyState message="You haven't posted any travel plans yet." link="/travel-plans/add" btnText="Create First Plan" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostedPlans.map((p) => (
                <PlanCardItem key={p.id} plan={p} type="HOST" />
              ))}
            </div>
          )}
        </section>

        {/* Joined Trips */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <Luggage className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-2xl font-black">Journeys You&apos;ve Joined</h2>
          </div>

          {joinedPlans.length === 0 ? (
            <EmptyState message="You haven't joined any travel buddies yet." link="/explore" btnText="Find a Trip" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedPlans.map((p) => (
                <PlanCardItem key={p.id} plan={p} type="JOINED" />
              ))}
            </div>
          )}
        </section>

        {/* Pending Reviews Card */}
        {reviewableTrips.length > 0 && (
          <Card className="rounded-[2.5rem] border-none shadow-xl bg-zinc-900 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-primary fill-primary" />
                <CardTitle className="text-2xl font-black">Share Your Experience</CardTitle>
              </div>
              <CardDescription className="text-zinc-400 font-medium">
                You have {reviewableTrips.length} completed trips waiting for a review. Help the community by rating your buddies.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              {reviewableTrips.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 group">
                  <div className="space-y-1">
                    <p className="font-bold text-zinc-100">{p.title || p.destination}</p>
                    <p className="text-xs text-zinc-400 font-medium">{new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90 font-bold rounded-xl" asChild>
                    <Link href={`/user/dashboard/give-review`}>Review Now</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function PlanCardItem({ plan, type }: { plan: TravelPlan; type: "HOST" | "JOINED" }) {
  const dateStr = `${new Date(plan.startDate).toLocaleDateString()} - ${new Date(plan.endDate).toLocaleDateString()}`;

  return (
    <Card className="group overflow-hidden rounded-[2.5rem] border-zinc-100 transition-all hover:border-primary/20 hover:shadow-2xl bg-white">
      <CardHeader className="p-6 pb-2">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="secondary" className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border-none ${type === "HOST" ? "bg-zinc-900 text-primary" : "bg-primary/10 text-primary"}`}>
            {type}
          </Badge>
          <div className="text-[10px] font-bold text-zinc-400 uppercaseer flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </div>
        </div>
        <CardTitle className="text-xl font-black group-hover:text-primary transition-colors line-clamp-1">
          {plan.title || plan.destination}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-2 space-y-4">
        <div className="flex items-center gap-2 text-zinc-500 font-bold text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          {plan.destination}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
           <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 border">
                <AvatarImage src={plan.host.profileImage} />
                <AvatarFallback className="text-[10px] font-black">{plan.host.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-zinc-600">@{plan.host.fullName || "traveler"}</span>
           </div>
           <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary" asChild>
              <Link href={`/travel-plans/${plan.id}`}>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message, link, btnText }: { message: string, link: string, btnText: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border border-dashed border-zinc-200 text-center space-y-5">
      <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center">
        <Compass className="w-8 h-8 text-zinc-300" />
      </div>
      <p className="text-zinc-500 font-medium max-w-[200px] leading-relaxed">{message}</p>
      <Button variant="outline" size="sm" className="rounded-full px-6 font-bold border-zinc-200" asChild>
        <Link href={link}>{btnText}</Link>
      </Button>
    </div>
  );
}