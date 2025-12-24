/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import { loginSchema, LoginType } from "@/zod/auth/auth.validator";
import ShareInput from "../../InputHandler/ShareInput";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginType) {
    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* header */}
        <div className="px-6 py-8 bg-linear-to-r from-orange-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-orange-400 to-primary text-white shadow-sm">
              {/* simple logo icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 10c0 5 4 9 9 9s9-4 9-9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3v7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Tour Hobe</h1>
              <p className="text-sm text-gray-500">Sign in to continue to your dashboard</p>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ShareInput
              label="Email"
              register={register("email")}
              error={errors.email?.message as any}
            />

            <ShareInput
              label="Password"
              register={register("password")}
              type="password"
              error={errors.password?.message as any}
            />

            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span>Remember me</span>
              </label>
              
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-2 flex items-center justify-center gap-3 py-2 rounded-md text-white font-medium transition
                ${isSubmitting ? "bg-orange-400 cursor-wait" : "bg-linear-to-r from-primary to-primary hover:from-primary hover:to-primary"}
              `}
              aria-busy={isSubmitting}
            >
              
              {isSubmitting && (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="3" strokeLinecap="round" className="opacity-20"></circle>
                  <path d="M22 12a10 10 0 00-10-10" strokeWidth="3" strokeLinecap="round" className="opacity-100"></path>
                </svg>
              )}
              <span>{isSubmitting ? "Signing in..." : "Login"}</span>
            </button>
          </form>

          {/* divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100"></div>
            <div className="text-xs text-gray-400">or continue with</div>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
}
