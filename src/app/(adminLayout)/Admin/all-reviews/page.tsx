/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { ReviewPage } from "@/types/review.interface";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Star, 
  Trash2, 
  MessageSquare, 
  ShieldAlert, 
  Calendar, 
  ArrowRight,
  UserCheck,
  RefreshCw
} from "lucide-react";

export default function AdminReviewPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchReviews();
  }, [user]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reviews/admin/all`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) setReviews(json.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirm = await Swal.fire({
      title: "Delete review?",
      text: "This feedback will be permanently removed from the platform.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#18181b",
      confirmButtonText: "Yes, Delete",
      customClass: { popup: 'rounded-[2rem]' }
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/reviews/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        Swal.fire({ title: "Removed", text: "Inappropriate review deleted.", icon: "success", confirmButtonColor: "#f97316" });
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="border-destructive/20 bg-destructive/5 text-center">
          <CardContent className="pt-6 space-y-4">
            <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
            <p className="font-bold text-destructive uppercase tracking-widest text-xs">
              Unauthorized Access Restricted
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-muted/30 pb-20">
        {/* Header Section */}
        <header className="bg-background border-b py-10 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-zinc-900 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
                    Moderation Lab
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  Review <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Moderation</span>
                </h1>
                <p className="text-muted-foreground font-medium">
                  Ensuring community feedback remains helpful and respectful.
                </p>
              </div>
              <Button 
                onClick={fetchReviews} 
                variant="outline" 
                className="rounded-xl font-bold bg-background shadow-sm hover:bg-muted"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Sync Reviews
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 mt-10">
          <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-background">
            <CardHeader className="bg-zinc-900 text-white p-8">
               <CardTitle className="text-xl font-bold flex items-center gap-2">
                 Content Registry
               </CardTitle>
               <CardDescription className="text-zinc-400 font-medium italic">
                 Manage {reviews.length} active feedback entries across the platform.
               </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* DESKTOP TABLE */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] h-14">Engagement</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Score</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px]">Feedback Comment</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Published</TableHead>
                      <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                       <TableRow><TableCell colSpan={5} className="h-32 text-center font-bold text-muted-foreground animate-pulse">Syncing Content Registry...</TableCell></TableRow>
                    ) : reviews.length === 0 ? (
                       <TableRow><TableCell colSpan={5} className="h-32 text-center font-bold text-muted-foreground">No community feedback found.</TableCell></TableRow>
                    ) : (
                      reviews.map((r) => (
                        <TableRow key={r.id} className="border-border hover:bg-muted/30 transition-colors">
                          <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col text-left">
                                <span className="text-xs font-black text-foreground line-clamp-1">From: {r.author.fullName || r.author.email}</span>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                                  <ArrowRight className="w-2.5 h-2.5" />
                                  To: {r.target.fullName || r.target.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-primary/10 text-primary border-none font-black text-xs hover:bg-primary/10">
                              {r.rating} <Star className="w-3 h-3 ml-1 fill-primary" />
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-xs text-muted-foreground font-medium italic line-clamp-2 leading-relaxed">
                              &ldquo;{r.comment || "No text provided"}&rdquo;
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase">
                              <Calendar className="w-3 h-3" />
                              {new Date(r.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="px-8 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(r.id)}
                              className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden p-6 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-[1.5rem] border border-border p-5 bg-card space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                           <UserCheck className="w-3 h-3" /> Author
                         </p>
                         <p className="text-xs font-bold text-foreground">{r.author.fullName || r.author.email}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-none font-black text-[10px]">
                        {r.rating} ★
                      </Badge>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                       <p className="text-xs text-muted-foreground italic font-medium">&ldquo;{r.comment || "—"}&rdquo;</p>
                    </div>

                    <div className="pt-4 border-t border-muted flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(r.createdAt).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="h-7 px-2 text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </LoaderWrapper>
  );
}