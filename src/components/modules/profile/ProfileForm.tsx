/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { UserAPI } from "@/lib/api";
import { PhotoUpload } from "@/components/shared/PhotoUpload/PhotoUpload";
import { updateUserSchema, UpdateUserType } from "@/zod/profile/profile.validator";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  User, 
  MapPin, 
  Camera, 
  Globe, 
  Map, 
  FileText, 
  Loader2, 
  X,
  Sparkles
} from "lucide-react";

type Props = {
  defaultValues?: any;
  onSuccess: (updated: any) => void;
  onCancel?: () => void;
};

export default function ProfileForm({ defaultValues, onSuccess, onCancel }: Props) {
  const form = useForm<any>({
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      bio: defaultValues?.bio ?? "",
      profileImageFile: undefined,
      profileImage: defaultValues?.profileImage ?? "",
      travelInterests:
        Array.isArray(defaultValues?.travelInterests)
          ? defaultValues.travelInterests.join(", ")
          : defaultValues?.travelInterests ?? "",
      visitedCountries:
        Array.isArray(defaultValues?.visitedCountries)
          ? defaultValues.visitedCountries.join(", ")
          : defaultValues?.visitedCountries ?? "",
      currentLocation: defaultValues?.currentLocation ?? "",
    },
  });

  const { isSubmitting } = form.formState;

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
      Swal.fire("Error", "Image upload failed", "error");
      return;
    }

    data.profileImage = profileImageUrl;
    delete data.profileImageFile;

    // Transform comma strings to arrays
    if (typeof data.travelInterests === "string") {
      data.travelInterests = data.travelInterests.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    if (typeof data.visitedCountries === "string") {
      data.visitedCountries = data.visitedCountries.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const parsed = updateUserSchema.safeParse(data);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = (issue.path && issue.path.length > 0 ? String(issue.path[0]) : "root") as any;
        form.setError(field, { type: "manual", message: issue.message });
      });
      return;
    }

    try {
      const res = await UserAPI.updateProfile(defaultValues.id, parsed.data as UpdateUserType);
      const updated = res.data?.data || res.data?.user || res.data || (parsed.data as any);
      onSuccess(updated);
    } catch (err: any) {
      Swal.fire("Error", "Failed to update profile", "error");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Update Profile
          </h3>
          <p className="text-sm text-muted-foreground font-medium italic">
            Refine your travel identity on Tour Hobe.
          </p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Md. Abu Jafor" className="h-12 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Location */}
            <FormField
              control={form.control}
              name="currentLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Dhaka, Bangladesh" className="h-12 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Profile Image */}
          <FormField
            control={form.control}
            name="profileImageFile"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="font-bold flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" /> Profile Photo
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className="h-12 rounded-xl pt-2.5 cursor-pointer file:mr-4 file:bg-primary/10 file:text-primary file:border-0 file:rounded-lg file:font-bold file:px-3"
                    onChange={(event) => onChange(event.target.files)}
                    {...fieldProps}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Bio
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell the community about your travel vibe..." 
                    className="rounded-2xl min-h-[100px] resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Travel Interests */}
            <FormField
              control={form.control}
              name="travelInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" /> Interests
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="hiking, camping, food" className="h-12 rounded-xl" {...field} />
                  </FormControl>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Comma separated</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visited Countries */}
            <FormField
              control={form.control}
              name="visitedCountries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Visited
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Bangladesh, India, Nepal" className="h-12 rounded-xl" {...field} />
                  </FormControl>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Comma separated</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="rounded-xl h-11 px-6 font-bold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="rounded-xl h-11 px-8 font-black shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}