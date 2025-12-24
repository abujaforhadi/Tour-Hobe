/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { 
  MapPin, 
  Calendar, 
  Banknote, 
  Tag, 
  Eye, 
  AlignLeft, 
  X, 
  Save, 
  Loader2,
  Compass
} from "lucide-react";

import { PlansAPI } from "@/lib/api";
import { TravelFormProps } from "@/types/travelPlan.interface";
import { UpdatePlanFormType, updatePlanSchema } from "@/zod/plan/plan.validator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PlanFormAdmin({ plan, onCancel, onSaved }: TravelFormProps) {
  
  const defaultValues: UpdatePlanFormType = {
    title: (plan.title ?? "") as UpdatePlanFormType["title"],
    destination: (plan.destination ?? "") as UpdatePlanFormType["destination"],
    startDate: plan.startDate ? plan.startDate.slice(0, 10) : "",
    endDate: plan.endDate ? plan.endDate.slice(0, 10) : "",
    budgetMin: plan.budgetMin !== null && plan.budgetMin !== undefined ? String(plan.budgetMin) : "",
    budgetMax: plan.budgetMax !== null && plan.budgetMax !== undefined ? String(plan.budgetMax) : "",
    travelType: (plan.travelType as UpdatePlanFormType["travelType"]) ?? "SOLO",
    description: (plan.description ?? "") as UpdatePlanFormType["description"],
    visibility: (plan.visibility as UpdatePlanFormType["visibility"]) ?? "PUBLIC",
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePlanFormType>({
    resolver: zodResolver(updatePlanSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<UpdatePlanFormType> = async (values) => {
    try {
      const payload: any = {
        ...values,
        budgetMin: values.budgetMin === "" ? undefined : Number(values.budgetMin),
        budgetMax: values.budgetMax === "" ? undefined : Number(values.budgetMax),
      };

      const res = await PlansAPI.update(plan.id, payload);
      const updated = res.data?.plan ?? res.data;

      await Swal.fire({
        icon: "success",
        title: "Plan Updated",
        text: "The itinerary changes have been saved.",
        confirmButtonColor: "#f97316",
        customClass: { popup: 'rounded-[2rem]' }
      });

      onSaved(updated);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.response?.data?.message || "Could not save changes.",
        confirmButtonColor: "#f97316",
      });
    }
  };

  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-background">
      <CardHeader className="bg-zinc-900 text-white p-6 md:p-8 relative">
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl font-black italic tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-primary" />
              Edit Trip Details
            </CardTitle>
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
              ID: {plan.id.slice(-12).toUpperCase()}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCancel} 
            className="rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b pb-2">Trip Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Tag className="w-3.5 h-3.5 text-primary" /> Trip Title</Label>
                <Input {...register("title")} className="rounded-xl h-11" placeholder="Summer Adventure in Sylhet" />
                {errors.title && <p className="text-destructive text-[10px] font-bold uppercase">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> Destination</Label>
                <Input {...register("destination")} className="rounded-xl h-11" placeholder="Sylhet, Bangladesh" />
                {errors.destination && <p className="text-destructive text-[10px] font-bold uppercase">{errors.destination.message}</p>}
              </div>
            </div>
          </div>

          {/* Section: Timeline & Budget */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b pb-2">Timeline & Costing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary" /> Start Date</Label>
                <Input type="date" {...register("startDate")} className="rounded-xl h-11" />
                {errors.startDate && <p className="text-destructive text-[10px] font-bold uppercase">{errors.startDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary" /> End Date</Label>
                <Input type="date" {...register("endDate")} className="rounded-xl h-11" />
                {errors.endDate && <p className="text-destructive text-[10px] font-bold uppercase">{errors.endDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Banknote className="w-3.5 h-3.5 text-emerald-500" /> Min Budget</Label>
                <Input type="number" {...register("budgetMin")} className="rounded-xl h-11" placeholder="5000" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Banknote className="w-3.5 h-3.5 text-emerald-500" /> Max Budget</Label>
                <Input type="number" {...register("budgetMax")} className="rounded-xl h-11" placeholder="15000" />
              </div>
            </div>
          </div>

          {/* Section: Classification */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b pb-2">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">Travel Type</Label>
                <select 
                  {...register("travelType")}
                  className="w-full flex h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="SOLO">Solo Exploration</option>
                  <option value="FAMILY">Family Trip</option>
                  <option value="FRIENDS">Friends Getaway</option>
                  <option value="COUPLE">Couple Journey</option>
                  <option value="GROUP">Group Adventure</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-bold flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-primary" /> Visibility</Label>
                <select 
                   {...register("visibility")}
                   className="w-full flex h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="PUBLIC">Public (Visible to All)</option>
                  <option value="PRIVATE">Private (Invite Only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Description */}
          <div className="space-y-2">
            <Label className="font-bold flex items-center gap-2"><AlignLeft className="w-3.5 h-3.5 text-primary" /> Trip Overview</Label>
            <Textarea 
              rows={5} 
              {...register("description")} 
              className="rounded-2xl resize-none p-4" 
              placeholder="Describe the activities, route, and exciting details..."
            />
            {errors.description && <p className="text-destructive text-[10px] font-bold uppercase">{errors.description.message}</p>}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-xl h-12 px-8 font-bold border-zinc-200"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-12 px-10 font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Itinerary
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}