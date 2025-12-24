/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UserCardsProps } from "@/types";
import ActionButtons from "./ActionButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Crown, 
  Clock 
} from "lucide-react";

export default function UserCard({ user, actionLoading, onDelete, onChangeRole }: UserCardsProps) {
  
  const formatDate = (iso?: string | null) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="rounded-[2rem] border-border bg-card shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar Section */}
          <Avatar className="h-14 w-14 border-2 border-background shadow-md">
            <AvatarImage src={user.profileImage || ""} />
            <AvatarFallback className="bg-zinc-900 text-primary font-black text-lg italic">
              {user.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Top Row: Name & Role */}
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h4 className="font-black text-foreground tracking-tight line-clamp-1">
                  {user.fullName || "Unnamed Explorer"}
                </h4>
                <p className="text-[11px] font-medium text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className={`rounded-lg px-2 py-0.5 font-black text-[9px] tracking-widest border-none ${
                  user.role === "ADMIN" 
                  ? "bg-primary text-white" 
                  : "bg-muted text-muted-foreground"
                }`}
              >
                {user.role}
              </Badge>
            </div>

            {/* Middle Section: Location & Status */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase">
                <MapPin className="h-3 w-3 text-primary" />
                {user.currentLocation || "Unknown"}
              </div>
              
              {user.isPremium ? (
                <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase justify-end">
                  <Crown className="h-3 w-3" />
                  Premium
                </div>
              ) : (
                <div className="text-[9px] font-black text-muted-foreground uppercase opacity-40 text-right tracking-widest">
                  Standard
                </div>
              )}
            </div>

            {/* Bottom Section: Meta & Actions */}
            <div className="pt-3 border-t border-border flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
                  <Calendar className="h-3 w-3" />
                  Joined: {formatDate(user.createdAt)}
                </div>
                {user.isPremium && (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    Exp: {formatDate(user.premiumExpiresAt)}
                  </div>
                )}
              </div>

              <div className="bg-muted/30 p-2 rounded-xl border border-border/50">
                <ActionButtons 
                  userId={user.id} 
                  userName={user.fullName ?? user.email} 
                  role={user.role} 
                  actionLoading={actionLoading} 
                  onDelete={onDelete} 
                  onChangeRole={onChangeRole} 
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}