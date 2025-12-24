/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import UserCard from "./UserCard";
import ActionButtons from "./ActionButtons";
import { UsersTableProps } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  User as UserIcon, 
  Crown, 
  Clock 
} from "lucide-react";

export default function UsersTable({
  users,
  loading,
  error,
  onDelete,
  onChangeRole,
  actionLoading,
}: UsersTableProps) {
  
  const formatDate = (iso?: string | null) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-background p-20 text-center shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin border-4 border-primary border-t-transparent rounded-full" />
          <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Synchronizing Explorers...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="rounded-[2rem] border border-destructive/20 bg-destructive/5 p-12 text-center">
        <p className="font-black text-destructive tracking-tight text-lg">{error}</p>
      </div>
    );

  if (!users.length)
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-background p-20 text-center">
        <UserIcon className="mx-auto h-12 w-12 text-muted/20 mb-4" />
        <p className="font-bold text-muted-foreground">No explorers found in the registry.</p>
      </div>
    );

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="px-6 font-black uppercase tracking-widest text-[10px] h-14">Explorer</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Location</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Role</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Joined</TableHead>
              <TableHead className="px-6 text-right font-black uppercase tracking-widest text-[10px]">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-border hover:bg-muted/30 transition-colors">
                {/* User Info */}
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                      <AvatarImage src={user.profileImage || ""} />
                      <AvatarFallback className="bg-zinc-900 text-primary font-black text-xs">
                        {user.fullName?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-black text-foreground tracking-tight">{user.fullName || "Anonymous"}</span>
                      <span className="text-xs font-medium text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Location */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-xs">
                    <MapPin className="h-3 w-3 text-primary" />
                    {user.currentLocation || "Unknown"}
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`rounded-lg px-2 py-0.5 font-black text-[10px] tracking-widest border-none ${
                      user.role === "ADMIN" 
                      ? "bg-primary text-white" 
                      : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>

                {/* Premium Status */}
                <TableCell>
                  {user.isPremium ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-emerald-600 font-black text-[10px] uppercase">
                        <Crown className="h-3 w-3" /> Premium
                      </div>
                      <div className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDate(user.premiumExpiresAt)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Free</span>
                  )}
                </TableCell>

                {/* Created Date */}
                <TableCell className="text-muted-foreground font-bold text-xs">
                  {formatDate(user.createdAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="px-6 text-right">
                  <div className="flex justify-end">
                    <ActionButtons
                      userId={user.id}
                      userName={user.fullName ?? user.email}
                      role={user.role}
                      actionLoading={actionLoading}
                      onDelete={onDelete}
                      onChangeRole={onChangeRole}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            actionLoading={actionLoading}
            onDelete={onDelete}
            onChangeRole={onChangeRole}
          />
        ))}
      </div>
    </>
  );
}