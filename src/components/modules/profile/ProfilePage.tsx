/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { AuthAPI } from "@/lib/api";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardFooter 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MapPin, 
  CalendarDays, 
  ShieldCheck, 
  Globe, 
  Heart, 
  Settings, 
  Lock,
  UserCircle,Compass
} from "lucide-react";

import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import Loader from "@/components/shared/Loader";

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  if (loading) return <Loader />;

  const u = user;

  async function handleProfileUpdated(updated: any) {
    if (!updated) return;
    try {
      const res = await AuthAPI.me();
      const fresh = res.data?.data || res.data?.user || res.data || null;
      if (fresh) setUser(fresh as any);
    } catch (err) {
      console.error("Refresh failed, merging locally:", err);
      setUser({ ...u, ...updated });
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Main Profile Card */}
        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-background">
          {/* Header/Cover Section */}
          <div className="h-32 bg-foreground relative">
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-3xl" />
          </div>

          <CardContent className="px-6 md:px-10 pb-10">
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
              <Avatar className="h-32 w-32 border-[6px] border-background shadow-xl">
                <AvatarImage src={u?.profileImage || ""} />
                <AvatarFallback className="bg-zinc-900 text-primary text-3xl font-black">
                  {u?.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left space-y-1 pb-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h1 className="text-3xl font-black tracking-tight text-foreground">
                    {u?.fullName || "Unnamed Traveler"}
                  </h1>
                  {u?.isPremium && (
                    <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />
                  )}
                </div>
                <p className="text-muted-foreground font-medium">{u?.email}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pb-2">
                <Button 
                  onClick={() => setEditOpen(true)}
                  className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setPwdOpen(true)}
                  className="rounded-xl font-bold border-border"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Security
                </Button>
              </div>
            </div>

            <Separator className="mb-8 opacity-50" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Side: Basic Info */}
              <div className="lg:col-span-4 space-y-8">
                <section className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <UserCircle className="w-4 h-4" /> Logistics
                  </h3>
                  <div className="space-y-4">
                    <InfoItem icon={MapPin} label="Current Location" value={u?.currentLocation} />
                    <InfoItem icon={CalendarDays} label="Member Since" value={u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : null} />
                    <InfoItem icon={Globe} label="Account Type" value={u?.isPremium ? "Premium Explorer" : "Standard User"} isBadge />
                  </div>
                </section>
              </div>

              {/* Right Side: Bio & Tags */}
              <div className="lg:col-span-8 space-y-8">
                <section className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Heart className="w-4 h-4" /> My Story
                  </h3>
                  <p className="text-foreground/80 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-4 py-1">
                    {u?.bio || "This traveler hasn't shared their story yet. Connect with them to learn more about their adventures!"}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <TagSection icon={Compass} title="Travel Interests" items={u?.travelInterests} />
                  <TagSection icon={Globe} title="Visited Countries" items={u?.visitedCountries} />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 px-10 py-4 flex justify-between items-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Tour Hobe! &bull; Unified Travel Identity
            </p>
            <p className="text-[10px] font-bold text-muted-foreground">
              Last Synced: {u?.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : "Just now"}
            </p>
          </CardFooter>
        </Card>

        {/* Edit Profile Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-zinc-900 text-white p-8">
              <DialogTitle className="text-2xl font-black italic tracking-tight">Edit Your Profile</DialogTitle>
            </DialogHeader>
            <div className="p-8">
              <ProfileForm
                defaultValues={u}
                onSuccess={(updated) => {
                  handleProfileUpdated(updated);
                  setEditOpen(false);
                  Swal.fire({ title: "Updated!", text: "Profile details saved.", icon: "success", confirmButtonColor: "#f97316" });
                }}
                onCancel={() => setEditOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Password Dialog */}
        <Dialog open={pwdOpen} onOpenChange={setPwdOpen}>
          <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-zinc-900 text-white p-8">
              <DialogTitle className="text-2xl font-black italic tracking-tight">Security Settings</DialogTitle>
            </DialogHeader>
            <div className="p-8">
              <ChangePasswordForm
                userId={u?.id}
                onSuccess={() => {
                  Swal.fire({ title: "Secured!", text: "Password changed successfully.", icon: "success", confirmButtonColor: "#f97316" });
                  setPwdOpen(false);
                }}
                onCancel={() => setPwdOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

/* --- REUSABLE MINI COMPONENTS --- */

function InfoItem({ icon: Icon, label, value, isBadge }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-muted rounded-xl">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        {isBadge ? (
          <Badge variant="outline" className="mt-1 border-primary/20 text-primary font-bold">
            {value}
          </Badge>
        ) : (
          <p className="text-sm font-bold text-foreground">{value || "Not Set"}</p>
        )}
      </div>
    </div>
  );
}

function TagSection({ icon: Icon, title, items }: any) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(items) && items.length > 0 ? (
          items.map((item: string, i: number) => (
            <Badge key={i} variant="secondary" className="rounded-lg bg-zinc-100 text-zinc-800 font-bold border-none px-3 py-1">
              {item}
            </Badge>
          ))
        ) : (
          <p className="text-xs text-muted-foreground font-medium italic">No tags added yet.</p>
        )}
      </div>
    </section>
  );
}