/* eslint-disable react-hooks/exhaustive-deps */
/* app/explore/page.tsx */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { MatchPlanCommon } from "@/types/explore.interface";





export default function ExplorePage() {
  const { user } = useAuth();

  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelType, setTravelType] = useState("");

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
      if (travelType) params.set("travelType", travelType);

      const query = params.toString();
      const url = `${API_BASE}/travel-plans/match${
        query ? `?${query}` : ""
      }`;

      const res = await fetch(url, {
        credentials: "include", 
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        console.error(json.message || "Failed to fetch matches");
        setMatches([]);
      } else {
        setMatches(json.matches || []);
      }
    } catch (err) {
      console.error(err);
      setMatches([]);
    } finally {
      setLoading(false);
      setInitialLoaded(true);
    }
  }
if(loading){
  return (
    <Loader/>
  )
}
  return (
    <div className="container mx-auto py-10 px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Find Travel Buddies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Search travelers going to similar destinations and match with the
            right companions.
          </p>
        </div>

        {user && (
          <div className="text-xs text-gray-500">
            Logged in as{" "}
            <span className="font-semibold text-gray-800">
              {user.fullName || user.email}
            </span>
          </div>
        )}
      </div>

      {/* Search Form */}
      <section className="bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-6">
        <form
          onSubmit={fetchMatches}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* Destination */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Destination
            </label>
            <input
              type="text"
              placeholder="e.g. Cox's Bazar, Sylhet"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Travel Type */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">
              Travel Type
            </label>
            <select
              value={travelType}
              onChange={(e) => setTravelType(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Any</option>
              <option value="SOLO">Solo</option>
              <option value="FAMILY">Family</option>
              <option value="FRIENDS">Friends</option>
              <option value="COUPLE">Couple</option>
              <option value="GROUP">Group</option>
            </select>
          </div>

          {/* Submit button (full width on mobile) */}
          <div className="md:col-span-4 mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-5 py-2 rounded-md bg-linear-to-r from-primary to-primary text-white text-sm font-semibold shadow hover:from-primary hover:to-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      <section className="bg-white rounded-2xl shadow border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Matched Travelers
          </h2>
          <p className="text-xs text-gray-500">
            {matches.length} result{matches.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading && !initialLoaded ? (
          <div className="text-sm text-gray-500">Loading matches...</div>
        ) : matches.length === 0 ? (
          <div className="text-sm text-gray-500">
            {initialLoaded
              ? "No matching travel plans found. Try changing your filters."
              : "No plans found yet."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {matches.map((plan) => (
              <MatchCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MatchCard({ plan }: { plan: MatchPlanCommon }) {
  const start = plan.startDate
    ? new Date(plan.startDate).toLocaleDateString()
    : "—";
  const end = plan.endDate
    ? new Date(plan.endDate).toLocaleDateString()
    : "—";

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 flex flex-col justify-between hover:shadow-sm transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {plan.title || plan.destination}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Destination:{" "}
            <span className="font-medium text-gray-800">
              {plan.destination}
            </span>
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {start} &nbsp;–&nbsp; {end}
          </p>
          {plan.travelType && (
            <p className="text-[11px] text-gray-500 mt-0.5">
              Type:{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[11px] font-medium text-gray-700">
                {plan.travelType}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Host info */}
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plan.host.profileImage || "https://i.ibb.co.com/jvLMWbX0/image.png"}
              alt={plan.host.fullName || "Traveler"}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-900 flex items-center gap-1">
              {plan.host.fullName || "Traveler"}
              {plan.host.isVerifiedBadge && (
                <span className="text-[9px] px-1 py-[1px] rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  ✓ Verified
                </span>
              )}
            </div>
            {plan.host.currentLocation && (
              <div className="text-[10px] text-gray-500">
                From {plan.host.currentLocation}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Link
            href={`/travel-plans/${plan.id}`}
            className="text-[11px] px-3 py-1 rounded-md bg-primary text-white hover:bg-primary"
          >
            View Plan
          </Link>
          
        </div>
      </div>
    </div>
  );
}
