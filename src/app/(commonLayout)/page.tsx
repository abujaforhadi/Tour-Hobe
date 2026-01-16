"use client";

import { FAQ } from "@/components/modules/homePage/FAQ";
import { Features } from "@/components/modules/homePage/Features";
import { FinalCTA } from "@/components/modules/homePage/FinalCTA";
import { Hero } from "@/components/modules/homePage/Hero";
import { HowItWorks } from "@/components/modules/homePage/HowItWorks";
import { Safety } from "@/components/modules/homePage/Safety";
import { Stats } from "@/components/modules/homePage/Stats";
import HomeMatchedTravelers from "@/components/modules/homePage/SuggestedBuddy/HomeMatchedTravelers";
import { Testimonials } from "@/components/modules/homePage/Testimonials";
import useAuth from "@/hooks/useAuth";
import FAQPage from "./faq/page";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      <Hero />
      <Stats />
      
      {user && (
        <section className="bg-zinc-50 py-20">
          <div className="container mx-auto px-6">
            <HomeMatchedTravelers />
          </div>
        </section>
      )}
      <Features />
      <HowItWorks />
      <Safety />
      <Testimonials />
      <FAQPage />

      <FinalCTA />
    </div>
  );
}