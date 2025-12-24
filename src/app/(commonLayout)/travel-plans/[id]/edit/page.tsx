/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updatePlanSchema,
  UpdatePlanFormType,
} from "@/zod/plan/plan.validator";
import { API_BASE } from "@/lib/baseApi";
import UserAuthWrapper from "@/lib/UserAuthWrapper";
import LoaderWrapper from "@/lib/LoaderWrapper";



export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePlanFormType>({
    resolver: zodResolver(updatePlanSchema),
    defaultValues: {
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      description: "",
      budgetMin: "",
      budgetMax: "",
      travelType: "SOLO",
      visibility: "PUBLIC",
    },
  });


  useEffect(() => {
    if (!planId) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/travel-plans/${planId}`, {
          credentials: "include",
        });
        const json = await res.json();

        if (!json.success) {
          Swal.fire("Error", json.message, "error");
          return;
        }

        const p = json.plan;

        setValue("title", p.title || "");
        setValue("destination", p.destination);
        setValue("startDate", p.startDate.split("T")[0]);
        setValue("endDate", p.endDate.split("T")[0]);
        setValue("description", p.description || "");
        setValue("budgetMin", p.budgetMin?.toString() || "");
        setValue("budgetMax", p.budgetMax?.toString() || "");
        setValue("travelType", p.travelType);
        setValue("visibility", p.visibility);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [planId, setValue]);


  const onSubmit = async (data: UpdatePlanFormType) => {
    try {
      const payload = {
        ...data,
        budgetMin: data.budgetMin ? Number(data.budgetMin) : null,
        budgetMax: data.budgetMax ? Number(data.budgetMax) : null,
      };

      const res = await fetch(
        `${API_BASE}/travel-plans/user/update/${planId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!json.success) {
        Swal.fire("Update Failed", json.message, "error");
        return;
      }

      await Swal.fire("Success", "Travel plan updated", "success");
      router.refresh();
      router.push(`/user/my-posted-plan`);
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserAuthWrapper>
      <LoaderWrapper>
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-4">Edit Travel Plan</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <Input label="Title" {...register("title")} error={errors.title?.message} />

        {/* Destination */}
        <Input
          label="Destination"
          {...register("destination")}
          error={errors.destination?.message}
        />

        {/* Dates */}
        <div className="flex gap-3">
          <Input
            label="Start Date"
            type="date"
            {...register("startDate")}
            error={errors.startDate?.message}
          />
          <Input
            label="End Date"
            type="date"
            {...register("endDate")}
            error={errors.endDate?.message}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full border rounded px-2 py-2"
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Budget */}
        <div className="flex gap-3">
          <Input
            label="Min Budget"
            type="number"
            {...register("budgetMin")}
            error={errors.budgetMin?.message}
          />
          <Input
            label="Max Budget"
            type="number"
            {...register("budgetMax")}
            error={errors.budgetMax?.message}
          />
        </div>

        {/* Selects */}
        <Select
          label="Travel Type"
          {...register("travelType")}
          options={["SOLO", "FAMILY", "FRIENDS", "COUPLE", "GROUP"]}
        />

        <Select
          label="Visibility"
          {...register("visibility")}
          options={["PUBLIC", "PRIVATE"]}
        />

        <button
          disabled={isSubmitting}
          className="w-full py-2 rounded bg-primary text-white hover:bg-primary"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
    </LoaderWrapper>
    </UserAuthWrapper>
  );
}



function Input({ label, error, ...props }: any) {
  return (
    <div className="flex-1">
      <label className="text-sm">{label}</label>
      <input {...props} className="w-full px-2 py-2 border rounded" />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select {...props} className="w-full px-2 py-2 border rounded">
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
