/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/shared/Loader";
import { API_BASE } from "@/lib/baseApi";
import { Payment } from "@/types/payment.interface";





export default function UserPaymentsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPayments();
  }, [user]);

  async function fetchPayments() {
  try {
    const res = await fetch(`${API_BASE}/payments/my-transactions`, {
      credentials: "include",
    });

    const json = await res.json();

    if (json.ok) {
      setData(json.data);
    } else {
      console.error("Failed to load payments:", json.message);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return (
      <Loader/>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500">
        Please login to view your payment history.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        My Payment History
      </h1>

      {/* Table Wrapper */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-300 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Transaction ID</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Plan</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                data.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 font-mono text-xs text-gray-700">
                      {p.transactionId}
                    </td>

                    <td className="px-6 py-3 font-semibold">
                      ৳ {p.amount}{" "}
                      <span className="text-xs text-gray-500">
                        {p.currency.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          p.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-700">
                      {p.description || "—"}
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
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
            <p className="text-center py-4 text-gray-500">No payments found.</p>
          ) : (
            data.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border border-gray-200 p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <p className="font-mono text-xs text-gray-700">
                    {p.transactionId}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      p.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <p className="text-lg font-bold text-gray-900">
                  ৳ {p.amount}{" "}
                  <span className="text-xs text-gray-600">
                    {p.currency.toUpperCase()}
                  </span>
                </p>

                <p className="text-xs text-gray-600 mt-1">
                  Plan: {p.description || "—"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
