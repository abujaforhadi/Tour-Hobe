"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE } from "@/lib/baseApi";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/shared/Loader";
import { ReviewTravelPlan } from "@/types/review.interface";





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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchReviewable() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
         credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error(json.message);
        setTrips([]);
      } else {
        setTrips(json.reviewableTrips || []);
      }
    } catch (err) {
      console.error(err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }
if(loading){
    return (
      <Loader/>
    )
}
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-700 text-sm">
            Please login to see your reviewable trips.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Give Review</h1>
          <p className="text-xs text-gray-500">
            These are trips where you were accepted and the tour is completed.
          </p>
        </div>
        <Link
          href="/user/dashboard"
          className="text-xs px-3 py-1 rounded-md bg-gray-100 border border-gray-200 hover:bg-gray-200"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p>Loading...</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">
            No completed trips pending review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {p.title || p.destination}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(p.startDate).toLocaleDateString()} -{" "}
                  {new Date(p.endDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Host: {p.host?.fullName || "Host"}
                </div>
              </div>
              <Link
                href={`/travel-plans/${p.id}`}
                className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Go & Give Review
              </Link>
            </div>
          ))}
        </div>
      )}
      
    </div>
    
  );
}
