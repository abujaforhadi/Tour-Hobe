/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PlansAPI } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PlanForm from "./PlanForm";

export default function AddPlan() {
  const router = useRouter();

  async function onSubmit(data: any) {
    try {
      await PlansAPI.create({ ...data, budgetMin: Number(data.budgetMin || 0), budgetMax: Number(data.budgetMax || 0) });
      Swal.fire("Saved", "Plan created", "success");
       router.push("/travel-plans");
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || err.message, "error");
    }
  }

  return (
    
      <div className="max-w-2xl mt-10 mx-5 md:mx-auto lg:mx-auto ">
       <h2 className="mx-2 md:mx-0 lg:mx-0 text-2xl md:text-3xl lg:text-3xl font-bold text-gray-800 mb-4 relative inline-block">
  Create Travel Plan
  <span className="absolute left-0 -bottom-1 w-12 h-1 bg-primary rounded-full"></span>
</h2>


        <PlanForm onSubmit={onSubmit} />
      </div>
  );
}
