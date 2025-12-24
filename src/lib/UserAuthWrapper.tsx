"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

export default function UserAuthWrapper({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        Swal.fire({
          title: "Unauthorized Access",
          text: "You need to log in to access the dashboard.",
          icon: "error", 
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#f97316", 
          background: "#F5F5F5",
          color: "#000000",
          iconColor: "#f97316",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-white/5 p-6",
            title: "font-semibold text-lg",
            confirmButton:
              "px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105",
          },
        }).then(() => router.push("/login"));
      }
       
      
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-orange-50 to-gray-100 dark:from-gray-900 dark:via-[#0b1020] dark:to-gray-900">
       
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
