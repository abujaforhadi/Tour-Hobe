/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import LoaderWrapper from "@/lib/LoaderWrapper";
import Loader from "@/components/shared/Loader";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
       credentials: "include",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error(json.message);
        setData(null);
      } else {
        setData(json);
      }
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-700 text-sm">
            Please login to see your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-red-600 text-sm">
            Failed to load dashboard data.
          </p>
        </div>
      </div>
    );
  }

  const hostedPlans: TravelPlan[] = data.hostedPlans || [];
  const joinedPlans: TravelPlan[] = data.joinedPlans || [];
  const reviewableTrips: TravelPlan[] = data.reviewableTrips || [];

  return (
   
    <div className="container mx-auto py-10 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {user.fullName || user.email}
          </h1>
          <p className="text-sm text-gray-500">
            Manage your travel plans, matches and reviews from here.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex gap-2">
          <Link
            href="/user/dashboard/give-review"
            className="px-3 py-2 text-xs sm:text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Give Review
          </Link>
          <Link
            href="/user/dashboard/matches"
            className="px-3 py-2 text-xs sm:text-sm rounded-md bg-primary text-white hover:bg-primary"
          >
            Matched Travelers
          </Link>
        </div>
      </div>

      {/* My Travel Plans */}
      <section className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            My Travel Plans
          </h2>
          <Link
            href="/travel-plans"
            className="text-xs text-primary hover:underline"
          >
            Explore all plans
          </Link>
        </div>

        <div className="space-y-4">
          {/* Hosted */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Plans I&apos;m Hosting
            </h3>
            {hostedPlans.length === 0 ? (
              <p className="text-xs text-gray-500">
                You are not hosting any travel plans yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {hostedPlans.map((p) => (
                  <PlanItem key={p.id} plan={p} label="Host" />
                ))}
              </div>
            )}
          </div>

          {/* Joined */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Plans I&apos;ve Joined (Accepted)
            </h3>
            {joinedPlans.length === 0 ? (
              <p className="text-xs text-gray-500">
                You have no accepted join requests yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {joinedPlans.map((p) => (
                  <PlanItem key={p.id} plan={p} label="Joined" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick preview: Reviewable trips */}
      <section className="bg-white rounded-xl shadow border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Trips You Can Review
          </h2>
          <Link
            href="/user/dashboard/give-review"
            className="text-xs text-primary hover:underline"
          >
            Go to &quot;Give Review&quot;
          </Link>
        </div>

        {reviewableTrips.length === 0 ? (
          <p className="text-xs text-gray-500">
            No completed trips pending review.
          </p>
        ) : (
          <div className="space-y-2">
            {reviewableTrips.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2"
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {p.title || p.destination}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(p.startDate).toLocaleDateString()} -{" "}
                    {new Date(p.endDate).toLocaleDateString()}
                  </div>
                </div>
                <Link
                  href={`/travel-plans/${p.id}`}
                  className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Give Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
    
  );
}

function PlanItem({ plan, label }: { plan: TravelPlan; label: string }) {
  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {plan.title || plan.destination}
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-white">
            {label}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {plan.destination} •{" "}
          {new Date(plan.startDate).toLocaleDateString()} -{" "}
          {new Date(plan.endDate).toLocaleDateString()}
        </p>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <Link
          href={`/travel-plans/${plan.id}`}
          className="text-xs px-3 py-1 rounded-md bg-primary text-white hover:bg-primary"
        >
          View Plan
        </Link>
      </div>
    </div>
  );
}
