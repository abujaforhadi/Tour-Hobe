/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { PlansAPI } from "@/lib/api";
import { ITravelPlan } from "@/types/travelPlan.interface";
import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

import PlanTable from "./PlanTable";
import PlanFormAdmin from "./PlanFormAdmin";
import Loader from "@/components/shared/Loader";

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
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load plans"
      );
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
        title: "Delete plan?",
        text: `Are you sure you want to delete "${plan.title || plan.destination}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#fb923c",
      });

      if (!result.isConfirmed) return;

      try {
        setActionLoadingId(plan.id);

        setPlans(prev => prev.filter(p => p.id !== plan.id));
        const res = await PlansAPI.remove(plan.id);

        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: res.data?.message || "Plan deleted successfully",
          confirmButtonColor: "#fb923c",
        });
      } catch (err: any) {
        console.error(err);
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to delete plan",
          confirmButtonColor: "#fb923c",
        });
        fetchPlans();
      } finally {
        setActionLoadingId(null);
      }
    },
    [fetchPlans]
  );

  const handleViewDetails = useCallback(async (plan: ITravelPlan) => {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const html = `
    <div class="text-left text-sm text-gray-700 space-y-4">

      <!-- Header -->
      <div class="pb-3 border-b">
        <h3 class="text-lg font-semibold text-gray-800">
          ${plan.title || plan.destination}
        </h3>
        <p class="text-xs text-gray-500">
          ${formatDate(plan.startDate)} → ${formatDate(plan.endDate)}
        </p>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-xs text-gray-500">Destination</p>
          <p class="font-medium">${plan.destination}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Travel Type</p>
          <p class="font-medium">${plan.travelType}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Visibility</p>
          <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${
            plan.visibility === "PUBLIC"
              ? "bg-orange-100 text-primary"
              : "bg-gray-100 text-gray-700"
          }">
            ${plan.visibility}
          </span>
        </div>

        <div>
          <p class="text-xs text-gray-500">Budget</p>
          <p class="font-medium">
            ${plan.budgetMin ?? "-"} – ${plan.budgetMax ?? "-"}
          </p>
        </div>
      </div>

      <!-- Host -->
      <div class="pt-3 border-t">
        <p class="text-xs text-gray-500">Host</p>
        <p class="font-medium">
          ${plan.host?.fullName || "-"}
        </p>
        <p class="text-xs text-gray-500">
          ${plan.host?.email || "-"}
        </p>
      </div>

      <!-- Description -->
      <div class="pt-3 border-t">
        <p class="text-xs text-gray-500 mb-1">Description</p>
        <p class="leading-relaxed">
          ${plan.description || "-"}
        </p>
      </div>

    </div>
  `;

  await Swal.fire({
    title: "Plan Details",
    html,
    width: 640,
    confirmButtonColor: "#fb923c",
    confirmButtonText: "Close",
  });
}, []);


  const handleEditClick = useCallback((plan: ITravelPlan) => {
    setEditingPlan(plan);
  }, []);

  const handleUpdateSaved = (updated: ITravelPlan) => {
    setPlans(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setEditingPlan(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-8">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Plan Management
            </h1>
            <p className="text-sm text-gray-500">
              Manage all travel plans — view details, edit, or delete.
            </p>
          </div>
          <button
            onClick={fetchPlans}
            className="bg-orange-400 hover:bg-primary text-white px-3 py-2 rounded-md text-sm shadow"
          >
            Refresh
          </button>
        </header>

        {editingPlan && (
          <div className="mb-6">
            <PlanFormAdmin
              plan={editingPlan}
              onCancel={() => setEditingPlan(null)}
              onSaved={handleUpdateSaved}
            />
          </div>
        )}

        <PlanTable
          plans={plans}
          loading={loading}
          error={error}
          actionLoadingId={actionLoadingId}
          onView={handleViewDetails}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />

        {/* ✅ PAGINATION UI */}
        {meta?.totalPages > 1 && (
  <div className="flex flex-wrap items-center justify-center gap-4 mt-8">

    {/* Previous */}
    <button
      disabled={page <= 1}
      onClick={() => setPage(p => p - 1)}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border font-medium text-sm
        transition-all duration-200
        ${
          page <= 1
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-primary text-white border-primary hover:bg-primary active:scale-95"
        }
      `}
    >
      ← Previous
    </button>

    {/* Page Info */}
    <span className="text-sm font-medium text-gray-600">
      Page <span className="font-semibold">{meta.page}</span> of{" "}
      <span className="font-semibold">{meta.totalPages}</span>
    </span>

    {/* Next */}
    <button
      disabled={page >= meta.totalPages}
      onClick={() => setPage(p => p + 1)}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border font-medium text-sm
        transition-all duration-200
        ${
          page >= meta.totalPages
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-primary text-white border-primary hover:bg-primary active:scale-95"
        }
      `}
    >
      Next →
    </button>

  </div>
)}

      </div>
    </div>
  );
}

