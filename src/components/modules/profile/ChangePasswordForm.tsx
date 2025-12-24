/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { z } from "zod";

import Swal from "sweetalert2";
import { changePasswordSchema } from "@/zod/profile/profile.validator";
import { axiosClient } from "@/lib/baseApi";

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm({
  userId,
  onSuccess,
  onCancel,
}: {
  userId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordType) {
    if (!userId) {
      Swal.fire("Error", "No user id available", "error");
      return;
    }

    try {
      const res = await axiosClient.post(`/user/${userId}/change-password`, data);
      Swal.fire({
        title: "Success",
        text: res.data?.message || "Password updated",
        icon: "success",
        confirmButtonColor: "#f97316",
      });
      onSuccess?.();
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message || "Failed to change password", "error");
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Change password</h3>
          <p className="text-sm text-gray-500 mt-1">Provide old and new password to update.</p>
        </div>
        <button className="text-gray-500" onClick={() => onCancel?.()}>✕</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Old password</label>
          <input {...register("oldPassword")} type="password" className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300" />
          {errors.oldPassword && <p className="text-xs text-red-500 mt-1">{String(errors.oldPassword.message)}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">New password</label>
          <input {...register("newPassword")} type="password" className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300" />
          {errors.newPassword && <p className="text-xs text-red-500 mt-1">{String(errors.newPassword.message)}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button type="button" onClick={() => onCancel?.()} className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-linear-to-r from-primary to-primary text-white text-sm font-medium hover:from-primary hover:to-primary transition">
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
