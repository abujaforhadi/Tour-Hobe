"use client";
import FormError from "@/components/error/FormError";
import { UseFormRegisterReturn } from "react-hook-form";


export default function ShareInput({
  label,
  register,
  error,
  type = "text",
  placeholder
}: {
  label: string;
  register: UseFormRegisterReturn;
  error?: string | null;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...register} type={type} placeholder={placeholder} className="w-full border p-2 rounded" />
      <FormError message={error} />
    </div>
  );
}
