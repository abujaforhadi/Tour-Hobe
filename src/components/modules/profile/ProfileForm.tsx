/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { UserAPI } from "@/lib/api";
import { PhotoUpload } from "@/components/shared/PhotoUpload/PhotoUpload";
import { updateUserSchema, UpdateUserType } from "@/zod/profile/profile.validator";


type Props = {
  defaultValues?: any;
  onSuccess: (updated: any) => void;
  onCancel?: () => void;
};

export default function ProfileForm({ defaultValues, onSuccess, onCancel }: Props) {
  

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      bio: defaultValues?.bio ?? "",
      
      profileImageFile: undefined,
      profileImage: defaultValues?.profileImage ?? "",
      
      travelInterests:
        Array.isArray(defaultValues?.travelInterests) && defaultValues.travelInterests.length > 0
          ? defaultValues.travelInterests.join(", ")
          : defaultValues?.travelInterests ?? "",
      visitedCountries:
        Array.isArray(defaultValues?.visitedCountries) && defaultValues.visitedCountries.length > 0
          ? defaultValues.visitedCountries.join(", ")
          : defaultValues?.visitedCountries ?? "",
      currentLocation: defaultValues?.currentLocation ?? "",
    },
  });

  async function onSubmit(raw: any) {
    if (!defaultValues?.id) {
      Swal.fire("Error", "No user id available", "error");
      return;
    }

    const data: any = { ...raw };
    let profileImageUrl = defaultValues?.profileImage ?? "";

   
    try {
      if (raw.profileImageFile && raw.profileImageFile.length > 0) {
        const file = raw.profileImageFile[0] as File;
        const resp = await PhotoUpload(file);
        profileImageUrl = resp?.data?.display_url || resp?.data?.url || resp?.display_url || resp?.url || profileImageUrl;
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      Swal.fire("Error", err?.message || "Image upload failed", "error");
      return;
    }

    
    data.profileImage = profileImageUrl;
    delete data.profileImageFile;

    
    if (typeof data.travelInterests === "string") {
      data.travelInterests = data.travelInterests
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    if (typeof data.visitedCountries === "string") {
      data.visitedCountries = data.visitedCountries
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }

    
    const parsed = updateUserSchema.safeParse(data);

    if (!parsed.success) {
     
      const zodError = parsed.error;
     
      zodError.issues.forEach((issue) => {
        
        const field = (issue.path && issue.path.length > 0 ? String(issue.path[0]) : "_error") as string;
        
        setError(field, { type: "manual", message: issue.message });
      });

      
      Swal.fire("Validation error", "Please correct the highlighted fields.", "error");
      return;
    }

    const payload: UpdateUserType = parsed.data as UpdateUserType;

   
    try {
      const res = await UserAPI.updateProfile(defaultValues.id, payload);
      const updated = res.data?.data || res.data?.user || res.data || payload;

      Swal.fire({
        title: "Saved",
        text: "Profile updated successfully.",
        icon: "success",
        confirmButtonColor: "#f97316",
      });

      onSuccess(updated);
    } catch (err: any) {
      console.error("Update failed:", err);
      Swal.fire("Error", err?.response?.data?.message || err?.message || "Failed to update profile", "error");
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit profile</h3>
          <p className="text-sm text-gray-500 mt-1">Update your name, bio and other public info.</p>
        </div>
        <button className="text-gray-500" onClick={() => onCancel?.()}>
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Full name</label>
          <input
            {...register("fullName")}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{String(errors.fullName.message)}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Upload Profile image</label>
         
          <input
            type="file"
            accept="image/*"
            {...register("profileImageFile" as const)}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          {/* show schema-level error for profileImage (string url) */}
          {errors.profileImage && <p className="text-xs text-red-500 mt-1">{String(errors.profileImage.message)}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Current location</label>
          <input
            {...register("currentLocation")}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          {errors.currentLocation && (
            <p className="text-xs text-red-500 mt-1">{String(errors.currentLocation.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          {errors.bio && <p className="text-xs text-red-500 mt-1">{String(errors.bio.message)}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Travel interests (comma separated)</label>
          <input
            defaultValue={
              Array.isArray(defaultValues?.travelInterests)
                ? defaultValues.travelInterests.join(", ")
                : defaultValues?.travelInterests ?? ""
            }
            {...register("travelInterests" as any)}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="hiking, photography"
          />
          {errors.travelInterests && (
            <p className="text-xs text-red-500 mt-1">{String(errors.travelInterests.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Visited countries (comma separated)</label>
          <input
            defaultValue={
              Array.isArray(defaultValues?.visitedCountries)
                ? defaultValues.visitedCountries.join(", ")
                : defaultValues?.visitedCountries ?? ""
            }
            {...register("visitedCountries" as any)}
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="Bangladesh, India"
          />
          {errors.visitedCountries && (
            <p className="text-xs text-red-500 mt-1">{String(errors.visitedCountries.message)}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-linear-to-r from-primary to-primary text-white text-sm font-medium hover:from-primary hover:to-primary transition"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
