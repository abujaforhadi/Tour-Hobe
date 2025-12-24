import React from "react";
import Image from "next/image";



import ActionButtons from "./ActionButtons";
import { UserCardsProps } from "@/types";



export default function UserCard({ user, actionLoading, onDelete, onChangeRole }: UserCardsProps) {
  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso ?? "-";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {user.profileImage ? (
            <Image 
           
            src={user?.profileImage || "https://i.ibb.co.com/jvLMWbX0/image.png"} alt={user.fullName ?? user.email} width={48} height={48} className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" /></svg>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-800">{user.fullName ?? "No name"}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${user.role === "ADMIN" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-700"}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <div>{user.currentLocation ?? "-"}</div>
            <div className="text-xs text-gray-400 mt-1">Created: {formatDate(user.createdAt)}</div>
          </div>

          <div className="mt-3 flex gap-2">
            <ActionButtons userId={user.id} userName={user.fullName ?? user.email} role={user.role} actionLoading={actionLoading} onDelete={onDelete} onChangeRole={onChangeRole} />
          </div>
        </div>
      </div>
    </div>
  );
}
