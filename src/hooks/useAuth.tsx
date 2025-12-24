
"use client";

import { useAuthContext } from "@/components/modules/auth/AuthProvider/AuthProvider";


export default function useAuth() {
  return useAuthContext();
}

