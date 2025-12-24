
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function ProtectedClient({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean; }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (adminOnly && user.role !== "ADMIN") router.replace("/dashboard");
    }
  }, [loading, user, router, adminOnly]);

  if (loading || !user) return <div className="p-6">Loading...</div>;
  return <>{children}</>;
}
