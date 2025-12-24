import { Props } from "@/types";



export default function ActionButtons({ userId, userName, role, actionLoading, onDelete, onChangeRole }: Props) {
  const busy = actionLoading === userId;

  return (
    <>
      <button
        onClick={() => onChangeRole(userId, role , userName)}
        disabled={busy}
        className="px-3 py-1 rounded-md text-sm border border-gray-200 hover:bg-gray-50"
        title="Change Role"
      >
        {busy ? "..." : role === "ADMIN" ? "Demote" : "Promote"}
      </button>

      <button
        onClick={() => onDelete(userId, userName)}
        disabled={busy}
        className="px-3 py-1 rounded-md text-sm bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
        title="Delete user"
      >
        {busy ? "..." : "Delete"}
      </button>
    </>
  );
}
