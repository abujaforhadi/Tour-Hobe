/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import { registerSchema, RegType } from "@/zod/auth/auth.validator";
import ShareInput from "../../InputHandler/ShareInput";

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegType>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegType) {
    try {
      await registerUser(data);
      
      Swal.fire({
            title: "Successful Registration!",
            text: "Welcome to Tour Hobe!",
            icon: "success",
            confirmButtonColor: "#f97316",
          });
      router.push("/");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-linear-to-r from-orange-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-orange-400 to-primary flex items-center justify-center text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 10c0 5 4 9 9 9s9-4 9-9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 3v7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-800">Create your account</h1>
              <p className="text-sm text-gray-500">Join Tour Hobe — manage trips, plans and more.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ShareInput
              label="Full name"
              register={register("fullName")}
              error={errors.fullName?.message as any}
            />

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
                <span>Accept terms & conditions</span>
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
              <span>{isSubmitting ? "Creating..." : "Register"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100"></div>
            <div className="text-xs text-gray-400">or sign up with</div>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>



          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
