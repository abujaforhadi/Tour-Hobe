
import Image from "next/image";
import UserCard from "./UserCard";
import ActionButtons from "./ActionButtons";
import { UsersTableProps } from "@/types";

export default function UsersTable({
  users,
  loading,
  error,
  onDelete,
  onChangeRole,
  actionLoading,
}: UsersTableProps) {
  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso ?? "-";
    }
  };

 
  if (loading)
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow">
        Loading users…
      </div>
    );

  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
        {error}
      </div>
    );

  if (!users.length)
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow">
        No users found
      </div>
    );

  return (
    <>
     
      <div className="hidden md:block rounded-xl overflow-hidden border border-gray-200 bg-white shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-300 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-5 py-4 text-left">User</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Location</th>
              <th className="px-5 py-4 text-left">Role</th>
              <th className="px-5 py-4 text-left">Premium</th>
              <th className="px-5 py-4 text-left">Created</th>
              <th className="px-5 py-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr
                key={user.id}
                className="transition hover:bg-orange-50/40"
              >
                {/* User */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border bg-gray-100 shrink-0">
                      {user.profileImage ? (
                        <Image
                          src={user?.profileImage || "https://i.ibb.co.com/jvLMWbX0/image.png"}
                          alt={user.fullName ?? user.email}
                          width={44}
                          height={44}
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <svg
                            className="h-6 w-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1a4 4 0 014-4h4a4 4 0 014 4v1"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-gray-800">
                        {user.fullName ?? "No name"}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {user.bio ?? "-"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-4 text-gray-700">
                  {user.email}
                </td>

                {/* Location */}
                <td className="px-5 py-4 text-gray-600">
                  {user.currentLocation ?? "-"}
                </td>

                {/* Role */}
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-orange-100 text-primary"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Premium */}
                <td className="px-5 py-4">
                  {user.isPremium ? (
                    <div className="text-gray-700">
                      <div className="font-medium">Yes</div>
                      <div className="text-xs text-gray-500">
                        Expires: {formatDate(user.premiumExpiresAt)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>

                {/* Created */}
                <td className="px-5 py-4 text-gray-500">
                  {formatDate(user.createdAt)}
                </td>

                {/* Actions */}
                <td className=" py-4 flex gap-1  text-right">
                  <ActionButtons
                    userId={user.id}
                    userName={user.fullName ?? user.email}
                    role={user.role}
                    actionLoading={actionLoading}
                    onDelete={onDelete}
                    onChangeRole={onChangeRole}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            actionLoading={actionLoading}
            onDelete={onDelete}
            onChangeRole={onChangeRole}
          />
        ))}
      </div>
    </>
  );
}
