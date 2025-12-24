/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { API_BASE } from '@/lib/baseApi';
import { useEffect, useState } from 'react';
import HomeMatchedTravelers from '@/components/modules/homePage/SuggestedBuddy/HomeMatchedTravelers';
import { TravelPlan } from '@/types/homePage.interface';

export default function HomePage() {
  const { user } = useAuth();
  
   const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([]);
    const [matchesByPlan, setMatchesByPlan] = useState<Record<string, TravelPlan[]>>({});
    const [loading, setLoading] = useState(true);
useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchMatches();
    
  }, [user]);

  async function fetchMatches() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dashboard/user`, {
         credentials: "include",});
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error(json.message);
      } else {
        setUpcomingPlans(json.upcomingPlans || []);
        setMatchesByPlan(json.matchesByPlan || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text + CTA */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Travel is better <span className="text-primary">together</span>
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              Find travel buddies, create plans, and explore destinations with like-minded
              travelers around the world.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/travel-plans"
                className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary transition"
              >
                Find Travel Buddies
              </Link>
              <Link
                href="/explore"
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Explore Plans
              </Link>
            </div>
          </div>

          {/* Right: Travel cards illustration (replaces empty box) */}
          <div className="hidden md:flex justify-end">
            <div className="relative w-full max-w-md">
              {/* Main card */}
              <div className="relative rounded-3xl bg-white shadow-xl border border-orange-100 p-5">
                <div className="h-40 rounded-2xl bg-linear-to-tr from-orange-400 via-orange-300 to-yellow-200 mb-4" />
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900">Bali, Indonesia</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-primary">
                    3 buddies
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Surf, sunsets and new friends on a 7-day island trip.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>June · Budget: ৳600</span>
                  <span>Solo · Looking for 2</span>
                </div>
              </div>

              {/* Small floating card top-left */}
              <div className="absolute -top-6 -left-4 w-36 rounded-2xl bg-white shadow-lg border border-gray-100 p-3">
                <p className="text-xs font-semibold text-gray-800">Paris weekend</p>
                <p className="text-[11px] text-gray-500 mt-1">2 buddies matched</p>
              </div>

              {/* Small floating card bottom-right */}
              <div className="absolute -bottom-8 -right-4 w-40 rounded-2xl bg-primary text-white shadow-xl p-3">
                <p className="text-xs font-semibold">2,300+ trips created</p>
                <p className="text-[11px] text-orange-100 mt-1">
                  Join a community of real travelers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {user && (
        
        <HomeMatchedTravelers/>
      )}

      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-3 text-gray-600">Start your journey in just 3 simple steps</p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your profile and share your travel interests.' },
              { step: '02', title: 'Create Plan', desc: 'Add destination, budget, and travel date.' },
              { step: '03', title: 'Find Buddy', desc: 'Match with travelers going the same way.' },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-primary font-extrabold text-4xl">{item.step}</div>
                <h3 className="mt-3 font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
     <section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-3xl font-bold text-gray-900">
        Popular Destinations
      </h2>
      <span className="text-sm text-gray-500">
        Loved by travelers worldwide
      </span>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { name: 'Paris', tag: 'City of Love' },
        { name: 'Thailand', tag: 'Beaches & Culture' },
        { name: 'Nepal', tag: 'Mountains & Adventure' },
        { name: 'Turkey', tag: 'History & Food' },
      ].map((place) => (
        <div
          key={place.name}
          className="group relative h-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gray-100" />

          {/* Dark overlay */}
          

          {/* Content */}
          <div className="relative z-10 h-full p-5 flex flex-col justify-end">
            <h3 className="text-primary font-extrabold text-2xl">
              {place.name}
            </h3>
            <p className="text-sm text-primary mt-1">
              {place.tag}
            </p>

            <span className="mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-800 w-fit">
              Explore Trips
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



    
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Why Choose Us</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {['Verified Travelers', 'Secure Messaging', 'Smart Matching Algorithm'].map((text) => (
              <div key={text} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg">{text}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Safe, reliable and designed for real travelers.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>

    <div className="mt-12 grid md:grid-cols-3 gap-6">
      {[
        {
          name: "Aisha",
          story:
            "“Met an amazing group of travelers , our Cox’s Bazar trip became unforgettable!”",
        },
        {
          name: "David",
          story:
            "“Planned a Europe backpacking trip with buddies I met here. Best decision ever!”",
        },
        {
          name: "Mehnaz",
          story:
            "“Found a safe and friendly travel partner for my first solo trip. Highly recommended!”",
        },
        {
          name: "Liam",
          story:
            "“Joined a group tour through this platform — made friends for life!”",
        },
        {
          name: "Sara",
          story:
            "“The matching feature helped me find someone with the same travel style. Perfect trip!”",
        },
      ].map((item) => (
        <div key={item.name} className="bg-gray-50 p-6 rounded-xl">
          <p className="text-gray-600 italic">{item.story}</p>
          <div className="mt-4 font-semibold">{item.name}</div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* ================= FINAL CTA ================= */}
      <section className="py-24 bg-primary text-white text-center">
        <h2 className="text-3xl font-extrabold">Ready to start your journey?</h2>
        <p className="mt-3 text-orange-100">
          Join thousands of travelers already exploring together.
        </p>
        <Link
          href="/register"
          className="inline-block mt-8 px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-orange-100 transition"
        >
          Get Started Now
        </Link>
      </section>
    </div>
  );
}
