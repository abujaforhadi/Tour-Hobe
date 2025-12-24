/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TravelPlanProps } from "@/types/travelPlan.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  Loader2, 
  Globe, 
  Lock,
  Banknote
} from "lucide-react";

export default function PlanTable({
  plans,
  loading,
  error,
  actionLoadingId,
  onView,
  onEdit,
  onDelete,
}: TravelPlanProps) {
  
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-background p-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
            Loading Itineraries...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-12 text-center">
        <p className="font-black text-destructive tracking-tight text-lg">{error}</p>
      </div>
    );

  if (!plans.length)
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-background p-20 text-center">
        <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">
          No travel plans found in registry.
        </p>
      </div>
    );

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="px-6 font-black uppercase tracking-widest text-[10px] h-14">Journey</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Destination</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Timeline</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Budget</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Host</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Access</TableHead>
              <TableHead className="px-6 text-right font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const busy = actionLoadingId === plan.id;
              return (
                <TableRow key={plan.id} className="border-border hover:bg-muted/30 transition-colors">
                  {/* Title & ID */}
                  <TableCell className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-foreground tracking-tight leading-none mb-1">
                        {plan.title || "Untitled Trip"}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">
                        ID: {plan.id.slice(-8)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Destination */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {plan.destination}
                    </div>
                  </TableCell>

                  {/* Timeline */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground font-semibold text-[11px]">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(plan.startDate)}
                    </div>
                  </TableCell>

                  {/* Budget */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-foreground font-black text-xs">
                      <Banknote className="h-3.5 w-3.5 text-emerald-500" />
                      ৳{plan.budgetMin?.toLocaleString()}
                    </div>
                  </TableCell>

                  {/* Host */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 border border-border">
                        <AvatarFallback className="text-[10px] font-black bg-zinc-100 uppercase">
                          {plan.host?.fullName?.charAt(0) || "H"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground leading-none">
                          {plan.host?.fullName || "Verified User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {plan.host?.email?.split('@')[0]}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Visibility */}
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`rounded-lg px-2 py-0.5 font-black text-[9px] tracking-widest border-none ${
                        plan.visibility === "PUBLIC" 
                        ? "bg-primary/10 text-primary" 
                        : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {plan.visibility === "PUBLIC" ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {plan.visibility}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(plan)} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(plan)} className="h-8 w-8 rounded-lg hover:bg-zinc-100">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={busy} 
                        onClick={() => onDelete(plan)} 
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE LIST */}
      <div className="md:hidden space-y-4">
        {plans.map((plan) => {
          const busy = actionLoadingId === plan.id;
          return (
            <div key={plan.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-black text-foreground tracking-tight leading-tight">
                    {plan.title || plan.destination}
                  </h3>
                  <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                    <MapPin className="h-3 w-3 text-primary" />
                    {plan.destination}
                  </div>
                </div>
                <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest">
                  {plan.visibility}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-bold text-muted-foreground border-y border-border/50 py-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {formatDate(plan.startDate)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-emerald-500" />
                  ৳{plan.budgetMin?.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => onView(plan)} className="rounded-xl font-bold h-10">
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(plan)} className="rounded-xl font-bold h-10">
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  disabled={busy} 
                  onClick={() => onDelete(plan)} 
                  className="rounded-xl font-bold h-10"
                >
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Delete"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}