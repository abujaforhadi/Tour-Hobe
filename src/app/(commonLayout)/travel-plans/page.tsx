
import PlanCard from "@/components/modules/plan/PlanCard";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { ITravelPlan, PlanPageProps } from "@/types/travelPlan.interface";
import Link from "next/link";



export default async function PlansPage({ searchParams }: PlanPageProps) {

  const params = await searchParams;

  const page = Number(params.page || 1);
  const limit = 8;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(params.destination && { destination: params.destination }),
    ...(params.travelType && { travelType: params.travelType }),
  });

  const res = await fetch(
    `${API_BASE}/travel-plans?${query.toString()}`,
    { cache: "no-store" }
  );

  const json = await res.json();

  const plans: ITravelPlan[] = json.data || [];
  const meta = json.meta;

  return (
    <LoaderWrapper>
      <div className="container mx-auto min-h-screen px-4 md:px-8 py-6">

        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              All Travel Plans
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Explore your saved trips and upcoming adventures.
            </p>
          </div>

          <Link
  href="/travel-plans/add"
  className="
    inline-flex items-center justify-center gap-2
    px-4 py-2 sm:px-5 sm:py-2.5
    rounded-lg
    bg-primary text-white
    font-medium text-sm sm:text-base
    
    transition-all duration-200
    hover:bg-primary hover:shadow-lg
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
  "
>
  <span className="text-lg leading-none">＋</span>
  <span className="whitespace-nowrap">Add Plan</span>
</Link>

        </div>

  
        


        {plans.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No travel plans found.
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

     
        {meta?.totalPages > 1 && (
  <div className="flex items-center justify-center gap-4 mt-10">
    
  
    <Link
      href={`?page=${page - 1}`}
      aria-disabled={page === 1}
      className={`px-4 py-2 rounded-lg border font-medium transition
        ${
          page === 1
            ? "pointer-events-none bg-gray-100 text-gray-400 border-gray-200"
            : "bg-primary text-white border-primary hover:bg-primary"
        }
      `}
    >
      ← Previous
    </Link>

   
    <span className="text-sm font-medium text-gray-600">
      Page <span className="font-semibold">{meta.page}</span> of{" "}
      <span className="font-semibold">{meta.totalPages}</span>
    </span>

  
    <Link
      href={`?page=${page + 1}`}
      aria-disabled={page === meta.totalPages}
      className={`px-4 py-2 rounded-lg border font-medium transition
        ${
          page === meta.totalPages
            ? "pointer-events-none bg-gray-100 text-gray-400 border-gray-200"
            : "bg-primary text-white border-primary hover:bg-primary"
        }
      `}
    >
      Next →
    </Link>
  </div>
)}

      </div>
    </LoaderWrapper>
  );
}

