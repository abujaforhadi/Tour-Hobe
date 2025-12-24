/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserAPI } from "@/lib/api";
import { IUser } from "@/types/user.interface";
import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

import UsersTable from "./UsersTable";
import Loader from "@/components/shared/Loader";


const MySwal = (Swal);

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
    console.error("fetchUsers:", err);
    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch users"
    );
  } finally {
    setLoading(false);
  }
}, [page, limit]);


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = useCallback(
    async (userId: string, userName?: string) => {
      const confirmed = await MySwal.fire({
        title: `Delete user?`,
        text: `Delete ${userName ?? "this user"} — this cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#fb923c",
      });

      if (!confirmed.isConfirmed) return;

      try {
        setActionLoading(userId);
        
        const prev = users;
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));

        const res = await UserAPI.deleteUser(userId);
        await MySwal.fire({ title: "Deleted", text: res.data?.message ?? "User deleted", icon: "success", confirmButtonColor: "#fb923c" });
      } catch (err: any) {
        console.error("delete error", err);
        await MySwal.fire({ title: "Failed", text: err?.response?.data?.message || err?.message || "Delete failed", icon: "error", confirmButtonColor: "#fb923c" });
        fetchUsers(); 
      } finally {
        setActionLoading(null);
      }
    },
    [users, fetchUsers]
  );

  const handleChangeRole = useCallback(
    async (userId: string, currentRole: string, userName?: string) => {
      const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      const confirmed = await MySwal.fire({
        title: "Change role?",
        text: `Change ${userName ?? "this user"} role from ${currentRole} to ${newRole}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Yes, set ${newRole}`,
        cancelButtonText: "Cancel",
        confirmButtonColor: "#fb923c",
      });
      if (!confirmed.isConfirmed) return;

      try {
        setActionLoading(userId);
        
        setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
        const res = await UserAPI.changeRole(userId, newRole as "USER" | "ADMIN");
        await MySwal.fire({ title: "Updated", text: res.data?.message ?? "Role updated", icon: "success", confirmButtonColor: "#fb923c" });
      } catch (err: any) {
        console.error("changeRole", err);
        await MySwal.fire({ title: "Failed", text: err?.response?.data?.message || err?.message || "Change role failed", icon: "error", confirmButtonColor: "#fb923c" });
        fetchUsers();
      } finally {
        setActionLoading(null);
      }
    },
    [fetchUsers]
  );
  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-500">View users, change roles, or delete accounts.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchUsers} className="bg-orange-400 hover:bg-primary text-white px-3 py-2 rounded-md text-sm shadow">Refresh</button>
          </div>
        </header>

        <UsersTable
          users={users}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onChangeRole={handleChangeRole}
          actionLoading={actionLoading}
        />
       {meta?.totalPages > 1 && (
  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
    
    {/* Previous */}
    <button
      disabled={page <= 1}
      onClick={() => setPage(p => p - 1)}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border text-sm font-medium
        transition-all duration-200
        ${
          page <= 1
            ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
            : "bg-primary text-white border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:text-primary"
        }
      `}
    >
      ← Previous
    </button>

    {/* Page Info */}
    <span className="text-sm font-medium text-gray-600">
      Page <span className="font-semibold">{meta.page}</span> of{" "}
      <span className="font-semibold">{meta.totalPages}</span>
    </span>

    {/* Next */}
    <button
      disabled={page >= meta.totalPages}
      onClick={() => setPage(p => p + 1)}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border text-sm font-medium
        transition-all duration-200
        ${
          page >= meta.totalPages
            ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200"
            : "bg-primary text-white border-gray-300 hover:bg-orange-50 hover:border-orange-300 hover:text-primary"
        }
      `}
    >
      Next →
    </button>

  </div>
)}


      </div>
    </div>
  );
}
