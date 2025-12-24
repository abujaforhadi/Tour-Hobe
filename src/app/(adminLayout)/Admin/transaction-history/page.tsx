/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { API_BASE } from "@/lib/baseApi";
import LoaderWrapper from "@/lib/LoaderWrapper";
import { Meta } from "@/types/pagination.interface";



export default function AdminTransactionsPage() {
  const { user } = useAuth();

  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 13;

  useEffect(() => {
    if (user?.role === "ADMIN") fetchTransactions();
  }, [user,page]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/payments/admin/transactions?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      const json = await res.json();

      if (json.ok) {
        setData(json.data);
        setMeta(json.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Admin access only. Please login with an admin account.
        </div>
      </div>
    );
  }
const totalPages = meta?.totalPages ?? 0;
const currentPage = meta?.page ?? page;

  return (
    <LoaderWrapper>
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          All Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and monitor all payment activity across the platform.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-300 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Transaction</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Plan</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                data.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-mono text-xs text-gray-700">
                      {tx.transactionId}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-800">
                      {tx.user?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-3 font-semibold">
                      ৳ {tx.amount}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          tx.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-700">
                      {tx.description || "—"}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden p-4 space-y-4">
          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : data.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              No transactions found.
            </p>
          ) : (
            data.map((tx) => (
              <div
                key={tx.id}
                className="rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono text-xs text-gray-700">
                      {tx.transactionId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {tx.user?.email || "Unknown user"}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      tx.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>

                <p className="text-lg font-bold text-gray-900">
                  ৳ {tx.amount}
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Plan: {tx.description || "—"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
        {/* ✅ PAGINATION UI */}
{/* ✅ PAGINATION UI */}



      </div>
      {totalPages > 1 && (
  <div className="flex flex-wrap items-center justify-center gap-4 mt-8">

    {/* Previous */}
    <button
      disabled={page <= 1}
      onClick={() => setPage(p => p - 1)}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border font-medium text-sm
        transition-all duration-200
        ${
          page <= 1
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-primary text-white border-primary hover:bg-primary active:scale-95"
        }
      `}
    >
      ← Previous
    </button>

    {/* Page Info */}
    <span className="text-sm font-medium text-gray-600">
      Page <span className="font-semibold">{currentPage}</span> of{" "}
      <span className="font-semibold">{totalPages}</span>
    </span>

    {/* Next */}
    <button
      disabled={page >= totalPages}
      onClick={() => setPage(p => p + 1)}
      className={`
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border font-medium text-sm
        transition-all duration-200
        ${
          page >= totalPages
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-primary text-white border-primary hover:bg-primary active:scale-95"
        }
      `}
    >
      Next →
    </button>

  </div>
)}
    </div>
    </LoaderWrapper>
  );
}
