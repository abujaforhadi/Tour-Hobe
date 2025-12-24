import { ITravelPlan } from "@/types/travelPlan.interface";
import Link from "next/link";

export default function PlanCard({ plan }: { plan: ITravelPlan }) {
  return (
    <div className="
      h-full flex flex-col
      bg-white rounded-2xl
      border border-gray-200
      shadow-sm hover:shadow-lg
      transition-all duration-300
      overflow-hidden
    ">
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {plan.title || 'Title Unavailable'}
        </h3>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {plan.description || "No description provided for this travel plan."}
        </p>

        {/* Dates */}
        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
          <span className="px-2 py-1 rounded-full bg-orange-50 text-primary border border-orange-200">
            {new Date(plan.startDate).toLocaleDateString()}
          </span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 rounded-full bg-orange-50 text-primary border border-orange-200">
            {new Date(plan.endDate).toLocaleDateString()}
          </span>
        </div>

        {/* Push button to bottom */}
        <div className="mt-auto pt-5">
          <Link
            href={`/travel-plans/${plan.id}`}
            className="
              block w-full text-center
              py-2.5 rounded-lg
              bg-gradient-to-r from-primary to-primary
              text-white text-sm font-medium
              hover:from-primary hover:to-primary
              transition-all duration-200
            "
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
