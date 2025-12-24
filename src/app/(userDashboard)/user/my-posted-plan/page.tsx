/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Loader from "@/components/shared/Loader";
import { UserTravelPlan } from "@/types/travelPlan.interface";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Plus, 
  MapPin, 
  Calendar, 
  LayoutList,
  Compass
} from "lucide-react";
import { API_BASE } from "@/lib/baseApi";

const MyPostedPlan = () => {
  const [plans, setPlans] = useState<UserTravelPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPlans();
  }, []);

  async function fetchMyPlans() {
    try {
      const res = await fetch(`${API_BASE}/travel-plans/my`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setPlans(json.plans);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(planId: string) {
    const confirm = await Swal.fire({
      title: "Delete this adventure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      background: "#ffffff",
      customClass: {
        title: "text-xl font-bold",
        confirmButton: "rounded-lg px-4 py-2",
        cancelButton: "rounded-lg px-4 py-2"
      }
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/travel-plans/${planId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Your travel plan has been removed.",
          icon: "success",
          confirmButtonColor: "#f97316"
        });
        setPlans((prev) => prev.filter((p) => p.id !== planId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LayoutList className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-black tracking-tight text-zinc-900">Manage My Plans</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium italic">
            Edit, view, or remove your posted travel itineraries.
          </p>
        </div>
        <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20">
          <Link href="/travel-plans/add">
            <Plus className="w-4 h-4 mr-2" />
            Create New Plan
          </Link>
        </Button>
      </div>

      {plans.length === 0 ? (
        <Card className="border-dashed bg-zinc-50/50 py-20 rounded-[2rem] text-center border-2">
          <CardContent className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-sm">
              <Compass className="w-8 h-8 text-zinc-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold">No plans found</h3>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                You haven&apos;t shared any travel adventures with the community yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="hover:bg-transparent border-zinc-100">
                  <TableHead className="font-bold text-zinc-900 h-14">Destination</TableHead>
                  <TableHead className="font-bold text-zinc-900">Travel Dates</TableHead>
                  <TableHead className="font-bold text-zinc-900">Visibility</TableHead>
                  <TableHead className="font-bold text-zinc-900 text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <TableCell className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-zinc-800">{plan.title || plan.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px] tracking-widest px-3">
                        Public
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100" asChild>
                          <Link href={`/travel-plans/${plan.id}`} title="View Plan">
                            <Eye className="w-4 h-4 text-zinc-500" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-zinc-100" asChild>
                          <Link href={`/travel-plans/${plan.id}/edit`} title="Edit Plan">
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full hover:bg-red-50"
                          onClick={() => handleDelete(plan.id)}
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="grid md:hidden gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="rounded-2xl border-zinc-100 shadow-sm overflow-hidden group">
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-bold text-zinc-900 group-hover:text-primary transition-colors">
                      {plan.title || plan.destination}
                    </CardTitle>
                    <Badge className="bg-primary/5 text-primary border-none text-[10px] font-bold">ACTIVE</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 font-medium text-zinc-500 text-xs mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(plan.startDate).toLocaleDateString()} – {new Date(plan.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 rounded-xl font-bold bg-zinc-900" asChild>
                      <Link href={`/travel-plans/${plan.id}`}>View</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold border-zinc-200" asChild>
                      <Link href={`/travel-plans/${plan.id}/edit`}>Edit</Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-xl border-zinc-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(plan.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPostedPlan;