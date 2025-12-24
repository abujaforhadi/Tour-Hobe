/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { PlansAPI } from "@/lib/api";
import { ITravelPlan } from "@/types/travelPlan.interface";

import PlanTable from "./PlanTable";
import PlanFormAdmin from "./PlanFormAdmin";
import Loader from "@/components/shared/Loader";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Plus,
  BarChart3,
  CalendarCheck
} from "lucide-react";

export default function PlanManagementPage() {
  const [plans, setPlans] = useState<ITravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<ITravelPlan | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [meta, setMeta] = useState<any>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await PlansAPI.list({ page, limit });
      const data = res.data?.data ?? res.data?.plans ?? [];
      const metaInfo = res.data?.meta ?? null;

      setPlans(Array.isArray(data) ? data : []);
      setMeta(metaInfo);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = useCallback(
    async (plan: ITravelPlan) => {
      const result = await Swal.fire({
        title: "Delete this plan?",
        text: `Are you sure you want to remove the journey to "${plan.title || plan.destination}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#18181b",
        customClass: { popup: 'rounded-[2rem]' }
      });

      if (!result.isConfirmed) return;

      try {
        setActionLoadingId(plan.id);
        setPlans(prev => prev.filter(p => p.id !== plan.id));
        await PlansAPI.remove(plan.id);
        Swal.fire({ title: "Removed", text: "Travel plan deleted.", icon: "success", confirmButtonColor: "#f97316" });
      } catch (err: any) {
        Swal.fire({ title: "Error", text: "Failed to delete plan.", icon: "error" });
        fetchPlans();
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchPlans]
  );

  const handleViewDetails = useCallback(async (plan: ITravelPlan) => {
    const formatDate = (iso: string) =>
      new Date(iso).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const html = `
      <div class="text-left space-y-5 p-2">
        <div class="pb-4 border-b">
          <h3 class="text-xl font-black text-zinc-900 tracking-tight">${plan.title || plan.destination}</h3>
          <p class="text-xs font-bold text-primary uppercase tracking-widest mt-1">
            ${formatDate(plan.startDate)} — ${formatDate(plan.endDate)}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Travel Type</p>
            <p class="text-sm font-bold text-zinc-900">${plan.travelType}</p>
          </div>
          <div class="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Budget Range</p>
            <p class="text-sm font-bold text-zinc-900">৳${plan.budgetMin ?? 0} - ৳${plan.budgetMax ?? 0}</p>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Host Identity</p>
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">
               ${plan.host?.fullName?.charAt(0) || "H"}
            </div>
            <div>
              <p class="text-sm font-bold text-zinc-900">${plan.host?.fullName || "Verified User"}</p>
              <p class="text-[11px] text-zinc-500 font-medium">${plan.host?.email || "-"}</p>
            </div>
          </div>
        </div>

        <div>
          <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Journey Overview</p>
          <p class="text-sm text-zinc-600 leading-relaxed italic">
            &ldquo;${plan.description || "The host hasn't provided a detailed description yet."}&rdquo;
          </p>
        </div>
      </div>
    `;

    await Swal.fire({
      title: "",
      html,
      width: 600,
      confirmButtonColor: "#f97316",
      confirmButtonText: "Close Registry",
      customClass: { popup: 'rounded-[2.5rem] p-6' }
    });
  }, []);

  const handleEditClick = useCallback((plan: ITravelPlan) => {
    setEditingPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateSaved = (updated: ITravelPlan) => {
    setPlans(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setEditingPlan(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
                Trip Logistics
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Plan <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Oversee all community itineraries and active travel groups.
            </p>
          </div>
          <Button 
            onClick={fetchPlans} 
            variant="outline" 
            className="rounded-xl font-bold bg-background shadow-sm hover:bg-muted"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <ManagementStat label="Total Plans" value={meta?.total || plans.length} icon={Compass} />
           <ManagementStat label="Upcoming Tours" value={plans.length} icon={CalendarCheck} />
           <ManagementStat label="System Health" value="Active" icon={BarChart3} />
        </div>

        {/* Edit Form Overlay */}
        {editingPlan && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <PlanFormAdmin
              plan={editingPlan}
              onCancel={() => setEditingPlan(null)}
              onSaved={handleUpdateSaved}
            />
          </div>
        )}

        {/* Table Section */}
        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-background">
          <CardHeader className="bg-zinc-900 text-white p-8">
             <CardTitle className="text-xl font-bold flex items-center gap-2">
               Global Travel Registry
             </CardTitle>
             <CardDescription className="text-zinc-400 font-medium">
               Authorized listing of all Public and Private travel plans.
             </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <PlanTable
              plans={plans}
              loading={loading}
              error={error}
              actionLoadingId={actionLoadingId}
              onView={handleViewDetails}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>

        {/* Pagination Section */}
        {meta?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              variant="outline"
              className="rounded-xl h-11 px-6 font-bold border-border shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>

            <div className="flex items-center bg-background border border-border px-6 h-11 rounded-xl font-black text-sm text-foreground shadow-sm">
              Page {meta.page} <span className="text-muted-foreground mx-2">of</span> {meta.totalPages}
            </div>

            <Button
              disabled={page >= meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              variant="outline"
              className="rounded-xl h-11 px-6 font-bold border-border shadow-sm"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ManagementStat({ label, value, icon: Icon }: any) {
  return (
    <Card className="rounded-[1.5rem] border-border bg-background shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}