import { TravelPlanProps } from "@/types/travelPlan.interface";

export default function PlanTable({
  plans,
  loading,
  error,
  actionLoadingId,
  onView,
  onEdit,
  onDelete,
}: TravelPlanProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading)
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Loading plans...
      </div>
    );
  if (error)
    return (
      <div className="rounded-lg border border-red-200 p-6 text-center text-red-600">
        {error}
      </div>
    );
  if (!plans.length)
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        No plans found
      </div>
    );

  return (
    <>
      
      <div className="hidden md:block rounded-xl overflow-hidden border border-gray-200 bg-white shadow">
  <table className="min-w-full text-sm">
    <thead className="bg-orange-300 text-gray-700 uppercase text-xs tracking-wide">
      <tr>
        <th className="px-5 py-4 text-left">Plan</th>
        <th className="px-5 py-4 text-left">Destination</th>
        <th className="px-5 py-4 text-left">Dates</th>
        <th className="px-5 py-4 text-left">Budget</th>
        <th className="px-5 py-4 text-left">Host</th>
        <th className="px-5 py-4 text-left">Status</th>
        <th className="px-5 py-4 text-right">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {plans.map(plan => {
        const busy = actionLoadingId === plan.id;
        return (
          <tr
            key={plan.id}
            className="hover:bg-orange-50/40 transition"
          >
            {/* Title */}
            <td className="px-5 py-4">
              <div className="font-semibold text-gray-800">
                {plan.title || "-"}
              </div>
              <div className="text-xs text-gray-500">
                ID: {plan.id.slice(0, 8)}...
              </div>
            </td>

            {/* Destination */}
            <td className="px-5 py-4 text-gray-700">
              {plan.destination}
            </td>

            {/* Dates */}
            <td className="px-5 py-4 text-gray-600">
              {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
            </td>

            {/* Budget */}
            <td className="px-5 py-4 text-gray-600">
              {plan.budgetMin ?? "-"} – {plan.budgetMax ?? "-"}
            </td>

            {/* Host */}
            <td className="px-5 py-4">
              <div className="text-gray-800">
                {plan.host?.fullName || "-"}
              </div>
              <div className="text-xs text-gray-500">
                {plan.host?.email || ""}
              </div>
            </td>

            {/* Visibility */}
            <td className="px-5 py-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.visibility === "PUBLIC"
                    ? "bg-orange-100 text-primary"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {plan.visibility}
              </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4 text-right">
              <div className="inline-flex gap-2">
                <button
                  onClick={() => onView(plan)}
                  className="px-3 py-1.5 text-xs rounded-md border hover:bg-gray-100"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(plan)}
                  className="px-3 py-1.5 text-xs rounded-md bg-primary text-white hover:bg-primary"
                >
                  Edit
                </button>
                <button
                  disabled={busy}
                  onClick={() => onDelete(plan)}
                  className="px-3 py-1.5 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {busy ? "..." : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>


      {/* Mobile list */}
      <div className="md:hidden space-y-4">
  {plans.map(plan => {
    const busy = actionLoadingId === plan.id;
    return (
      <div
        key={plan.id}
        className="rounded-xl border border-gray-200 bg-white p-4 shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">
              {plan.title || "-"}
            </h3>
            <p className="text-xs text-gray-500">
              {plan.destination}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
            </p>
          </div>

          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              plan.visibility === "PUBLIC"
                ? "bg-orange-100 text-primary"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {plan.visibility}
          </span>
        </div>

        <div className="mt-3 text-xs text-gray-600">
          Host: {plan.host?.fullName || "-"}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => onView(plan)}
            className="py-2 text-xs rounded-md border hover:bg-gray-100"
          >
            View
          </button>
          <button
            onClick={() => onEdit(plan)}
            className="py-2 text-xs rounded-md bg-primary text-white hover:bg-primary"
          >
            Edit
          </button>
          <button
            disabled={busy}
            onClick={() => onDelete(plan)}
            className="py-2 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {busy ? "..." : "Del"}
          </button>
        </div>
      </div>
    );
  })}
</div>

    </>
  );
}
