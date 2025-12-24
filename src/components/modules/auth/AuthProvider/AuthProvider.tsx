/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthAPI } from "@/lib/api";
import type { IUser } from "@/types/user.interface";

type AuthContextType = {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (payload: any) => Promise<any>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (u: IUser | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AuthAPI.me(); 
      setUser(res.data?.data || res.data?.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const res = await AuthAPI.login({ email, password });
    const loginUser = res.data?.data || res.data?.user || null;
    if (loginUser) {
      setUser(loginUser);
      setLoading(false);
    } else {
      await fetchMe();
    }
    await Swal.fire({
      title: "Login Successful!",
      text: "Welcome back!",
      icon: "success",
      confirmButtonColor: "#f97316",
    });
    return res.data;
  };

  const register = async (payload: any) => {
    const res = await AuthAPI.register(payload);
    const newUser = res.data?.data || res.data?.user || null;
    if (newUser) setUser(newUser);
    else await fetchMe();
    return res.data;
  };

  const logout = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Logout",
    });
    if (!confirm.isConfirmed) return;
    try {
      await AuthAPI.logout();
    } catch (err) {
     
    }
    setUser(null);
    await Swal.fire({
      title: "Logged Out",
      text: "You have been logged out successfully.",
      icon: "success",
      confirmButtonColor: "#f97316",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchMe,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
}
