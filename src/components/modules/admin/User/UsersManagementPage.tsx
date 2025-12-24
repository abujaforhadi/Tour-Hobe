/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { UserAPI } from "@/lib/api";
import { IUser } from "@/types/user.interface";
import Loader from "@/components/shared/Loader";
import UsersTable from "./UsersTable";

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  UserCog, 
  ShieldCheck 
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [meta, setMeta] = useState<any>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserAPI.listUsers({ page, limit });
      setUsers(res.data?.users ?? []);
      setMeta(res.data?.meta ?? null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = useCallback(
    async (userId: string, userName?: string) => {
      const confirmed = await Swal.fire({
        title: `Delete explorer?`,
        text: `Are you sure you want to remove ${userName || "this user"}? This action is permanent.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#18181b",
        customClass: { popup: 'rounded-[2rem]' }
      });

      if (!confirmed.isConfirmed) return;

      try {
        setActionLoading(userId);
        await UserAPI.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
        Swal.fire({ title: "Removed", text: "User has been deleted.", icon: "success", confirmButtonColor: "#f97316" });
      } catch (err: any) {
        Swal.fire({ title: "Error", text: "Could not delete user.", icon: "error" });
        fetchUsers();
      } finally {
        setActionLoading(null);
      }
    },
    [fetchUsers]
  );

  const handleChangeRole = useCallback(
    async (userId: string, currentRole: string, userName?: string) => {
      const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      const confirmed = await Swal.fire({
        title: "Change Permissions?",
        text: `Promote/Demote ${userName || "user"} to ${newRole}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Yes, set as ${newRole}`,
        confirmButtonColor: "#f97316",
        customClass: { popup: 'rounded-[2rem]' }
      });

      if (!confirmed.isConfirmed) return;

      try {
        setActionLoading(userId);
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
        await UserAPI.changeRole(userId, newRole as "USER" | "ADMIN");
        Swal.fire({ title: "Updated", text: "User role changed successfully.", icon: "success", confirmButtonColor: "#f97316" });
      } catch (err: any) {
        Swal.fire({ title: "Failed", text: "Action could not be completed.", icon: "error" });
        fetchUsers();
      } finally {
        setActionLoading(null);
      }
    },
    [fetchUsers]
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest font-bold">
                Admin Control
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              User <span className="text-primary italic underline decoration-primary/20 underline-offset-8">Management</span>
            </h1>
            <p className="text-muted-foreground font-medium">
              Monitor, verify, and manage the Tour Hobe community members.
            </p>
          </div>
          <Button 
            onClick={fetchUsers} 
            variant="outline" 
            className="rounded-xl font-bold bg-background shadow-sm border-border hover:bg-muted"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </Button>
        </div>

        {/* User Stats Summary (Optional/New) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <StatCard label="Total Users" value={meta?.total || users.length} icon={Users} />
           <StatCard label="Active Admins" value={users.filter(u => u.role === "ADMIN").length} icon={ShieldCheck} />
           <StatCard label="Current Page" value={page} icon={RefreshCw} />
        </div>

        {/* Table Section */}
        <Card className="border-none shadow-2xl shadow-zinc-200/50 rounded-[2.5rem] overflow-hidden bg-background">
          <CardHeader className="bg-zinc-900 text-white p-8">
             <CardTitle className="text-xl font-bold flex items-center gap-2">
               Explorer Registry
             </CardTitle>
             <CardDescription className="text-zinc-400 font-medium">
               Current count: {meta?.total ?? users.length} registered users
             </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <UsersTable
              users={users}
              loading={loading}
              error={error}
              onDelete={handleDelete}
              onChangeRole={handleChangeRole}
              actionLoading={actionLoading}
            />
          </CardContent>
        </Card>

        {/* Pagination Section */}
        {meta?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              variant="outline"
              className="rounded-xl h-11 px-6 font-bold border-border shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>

            <div className="flex items-center bg-background border border-border px-6 h-11 rounded-xl font-black text-sm text-foreground shadow-sm">
              Page {meta.page} <span className="text-muted-foreground mx-2">of</span> {meta.totalPages}
            </div>

            <Button
              disabled={page >= meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              variant="outline"
              className="rounded-xl h-11 px-6 font-bold border-border shadow-sm"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- Reusable Stats Component --- */

function StatCard({ label, value, icon: Icon }: { label: string, value: string | number, icon: any }) {
  return (
    <Card className="rounded-[1.5rem] border-border bg-background shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}