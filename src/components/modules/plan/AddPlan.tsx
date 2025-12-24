/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { PlansAPI } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PlanForm from "./PlanForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapIcon, Sparkles } from "lucide-react";

export default function AddPlan() {
  const router = useRouter();

  async function onSubmit(data: any) {
    try {
      await PlansAPI.create({ 
        ...data, 
        budgetMin: Number(data.budgetMin || 0), 
        budgetMax: Number(data.budgetMax || 0) 
      });
      
      Swal.fire({
        title: "Success!",
        text: "Your adventure has been posted to the community.",
        icon: "success",
        confirmButtonColor: "#f97316", // Primary color
      });

      router.push("/travel-plans");
      router.refresh();
    } catch (err: any) {
      Swal.fire({
        title: "Submission Failed",
        text: err?.response?.data?.message || err.message,
        icon: "error",
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="flex flex-col items-center text-center space-y-3">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-4 py-1 rounded-full font-bold">
            <Sparkles className="w-3 h-3 mr-2" />
            SHARE YOUR ITINERARY
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">
            Create Your <span className="text-primary italic">Plan</span>
          </h1>
          <p className="text-muted-foreground font-medium max-w-md">
            Tell the community where you are going and what kind of travel buddies you are looking for.
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-zinc-900 text-white p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <MapIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Trip Details</CardTitle>
                <CardDescription className="text-zinc-400 font-medium">
                  Fill in the specifics of your upcoming journey
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <PlanForm onSubmit={onSubmit} />
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Tour Hobe &bull; Bangladesh Trusted Travel Network
          </p>
        </div>
      </div>
    </div>
  );
}