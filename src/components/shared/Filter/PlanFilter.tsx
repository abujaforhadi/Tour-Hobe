/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function PlanFilter({ onApply }: { onApply: (q: any) => void }) {
  const [destination, setDestination] = useState("");
  const [travelType, setTravelType] = useState("");

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        placeholder="Destination"
        className="border px-3 py-2 rounded"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <select
        className="border px-3 py-2 rounded"
        value={travelType}
        onChange={(e) => setTravelType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="SOLO">Solo</option>
        <option value="FAMILY">Family</option>
        <option value="FRIENDS">Friends</option>
        <option value="COUPLE">Couple</option>
      </select>

      <button
        onClick={() => onApply({ destination, travelType })}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
}
