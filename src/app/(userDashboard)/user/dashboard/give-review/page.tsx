/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { ReviewTravelPlan } from "@/types/review.interface";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  User, 
  MessageSquareHeart,
  History,
  ChevronRight
} from "lucide-react";

export default function GiveReviewPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<ReviewTravelPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchReviewable();
  }, [user]);

  async function fetchReviewable() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTrips(json.reviewableTrips || []);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <User className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
        <p className="text-muted-foreground max-w-xs">Please login to see your reviewable travel history.</p>
        <Button asChild className="rounded-xl px-8">
          <Link href="/login">Login Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header Section */}
      <header className="bg-background border-b py-12 px-6">
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
                  Community Feedback
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Give <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Review</span>
              </h1>
              <p className="text-muted-foreground font-medium max-w-md">
                Share your journey experience. Your reviews help keep the Tour Hobe community safe and trustable.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 mt-10">
        {trips.length === 0 ? (
          <Card className="border-dashed bg-background py-20 rounded-[3rem] text-center max-w-2xl mx-auto border-2">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <History className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">No pending reviews</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                  Only completed trips where you were a participant will appear here for feedback.
                </p>
              </div>
              <Button variant="outline" asChild className="rounded-full px-8 border-border hover:bg-muted">
                <Link href="/travel-plans">Explore More Trips</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <ReviewTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* --- REUSABLE TRIP ITEM COMPONENT --- */

function ReviewTripCard({ trip }: { trip: ReviewTravelPlan }) {
  const dateRange = `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`;

  return (
    <Card className="group overflow-hidden rounded-[2.5rem] border-border hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 bg-background flex flex-col">
      <CardHeader className="p-7 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors">
            <MessageSquareHeart className="w-6 h-6 text-primary" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black uppercase tracking-widest">
            Completed
          </Badge>
        </div>
        <CardTitle className="text-xl font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
          {trip.title || trip.destination}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mt-2">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          {trip.destination}
        </div>
      </CardHeader>

      <CardContent className="p-7 pt-2 flex-1 space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground/80 uppercase tracking-tighter">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateRange}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/50 p-4 rounded-2xl border border-border/50">
          <Avatar className="h-10 w-10 border-2 border-background">
            <AvatarImage src={trip.host?.profileImage} />
            <AvatarFallback className="text-[10px] font-black">
              {trip.host?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Host</p>
            <p className="text-sm font-bold text-foreground">@{trip.host?.fullName || "traveler"}</p>
          </div>
        </div>
      </CardContent>

      <div className="p-7 pt-0">
        <Button className="w-full rounded-2xl h-12 font-black shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all" asChild>
          <Link href={`/travel-plans/${trip.id}`}>
            <Star className="w-4 h-4 mr-2 fill-background" />
            Share Your Experience
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}