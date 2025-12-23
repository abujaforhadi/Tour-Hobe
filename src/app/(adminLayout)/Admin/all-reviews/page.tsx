/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { ReviewPage } from "@/types/review.interface";



export default function AdminReviewPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchReviews();
  }, [user]);

  async function fetchReviews() {
    try {
      const res = await fetch(`${API_BASE}/reviews/admin/all`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) setReviews(json.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirm = await Swal.fire({
      title: "Delete review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#d1d5db",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/reviews/admin/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        Swal.fire("Deleted", "Review removed successfully", "success");
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Admin access only. Please login with an admin account.
        </div>
      </div>
    );
  }

  return (
    <LoaderWrapper>
    <div className="container mx-auto px-4 py-10">
      
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Review Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user reviews and remove inappropriate content.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-300 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Author</th>
                <th className="px-6 py-3 text-left">Target</th>
                <th className="px-6 py-3 text-left">Rating</th>
                <th className="px-6 py-3 text-left">Comment</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-xs text-gray-800">
                      {r.author.fullName || r.author.email}
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-800">
                      {r.target.fullName || r.target.email}
                    </td>

                    <td className="px-6 py-3 font-semibold text-primary">
                      {r.rating} ★
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-700 max-w-xs truncate">
                      {r.comment || "—"}
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

       
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              No reviews found.
            </p>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {r.author.fullName || r.author.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      → {r.target.fullName || r.target.email}
                    </p>
                  </div>
                  <span className="font-semibold text-primary">
                    {r.rating} ★
                  </span>
                </div>

                <p className="text-xs text-gray-700 mb-2">
                  {r.comment || "No comment"}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </LoaderWrapper>
  );
}
