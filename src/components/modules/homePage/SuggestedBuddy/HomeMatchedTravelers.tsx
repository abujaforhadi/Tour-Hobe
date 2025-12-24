/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import { MatchedPlan, MatchesByPlan } from "@/types/matches.interface";






export default function HomeMatchedTravelers() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchedPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMatches();
  }, [user]);

  async function fetchMatches() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
        credentials: "include",
      });
      const json = await res.json();

      if (!json.success) return;

      const matchesByPlan: MatchesByPlan = json.matchesByPlan || {};

     
      const uniqueMap = new Map<string, MatchedPlan>();

      Object.values(matchesByPlan).forEach((plans) => {
        plans.forEach((plan) => {
          if (!uniqueMap.has(plan.host.id)) {
            uniqueMap.set(plan.host.id, plan);
          }
        });
      });

      setMatches(Array.from(uniqueMap.values()).slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  if (!user) return null;


  if (loading) return null;

  return (
    <section className="py-16 bg-white border-t">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Recommended Travel Buddies for You
        </h2>

      
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 border rounded-xl bg-gray-50">
            <p className="text-gray-600 text-sm mb-4">
              No travel buddies matched  yet.
            </p>

            <Link
              href="/explore"
              className="px-5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary transition"
            >
              🔍 Search Travel Buddy
            </Link>
          </div>
        ) : (
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 3).map((plan) => (
              <div
                key={plan.host.id}
                className="p-5 rounded-xl border bg-gray-50 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      plan.host.profileImage ||
                      "https://i.ibb.co.com/jvLMWbX0/image.png"
                    }
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    alt={plan.host.fullName || "Traveler"}
                  />

                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {plan.host.fullName || "Traveler"}
                      {plan.host.isVerifiedBadge && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                          Verified
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Destination: {plan.destination}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  Travel Type:{" "}
                  <span className="font-semibold">{plan.travelType}</span>
                </div>

                <Link
                  href={`/travel-plans/${plan.id}`}
                  className="inline-block mt-4 text-xs px-3 py-2 rounded-md bg-primary text-white hover:bg-primary"
                >
                  View Plan
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
