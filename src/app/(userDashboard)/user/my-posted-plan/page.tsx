"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { UserTravelPlan } from "@/types/travelPlan.interface";





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
      title: "Delete plan?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/travel-plans/${planId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        await Swal.fire("Deleted!", "Your plan has been deleted.", "success");
        setPlans((prev) => prev.filter((p) => p.id !== planId));
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="container mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">My Posted Plans</h1>

      {plans.length === 0 ? (
        <p className="text-sm text-gray-500">
          You haven&apos;t posted any travel plan yet.
         
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm"
            >
              <h3 className="text-sm font-semibold text-gray-900">
                {plan.title || plan.destination}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(plan.startDate).toLocaleDateString()} –{" "}
                {new Date(plan.endDate).toLocaleDateString()}
              </p>

              <div className="flex gap-2 mt-3">
                {/* View */}
                <Link
                  href={`/travel-plans/${plan.id}`}
                  className="text-xs px-3 py-1 rounded bg-primary text-white hover:bg-primary"
                >
                  View
                </Link>

                {/* Edit */}
                <Link
                  href={`/travel-plans/${plan.id}/edit`}
                  className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
                >
                  Edit
                </Link>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="text-xs px-3 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostedPlan;
