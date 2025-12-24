/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE } from "@/lib/baseApi";



export default function PaymentSuccessClient() {
  const search = useSearchParams();
  const transactionId = search.get("transactionId") || "";
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;

    async function fetchStatus() {
      try {
        const res = await axios.get(
          `${API_BASE}/payments/status/${transactionId}`,
          { withCredentials: true }
        );

        const pay = res.data.data?.payment;

        if (pay?.status) {
          setStatus(pay.status);

          if (pay.status === "PAID") {
            Swal.fire(
              "Payment successful",
              "Your subscription is active.",
              "success"
            );
            clearInterval(interval);

            setTimeout(() => {
              router.push("/user/dashboard");
            }, 2000);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (transactionId) {
      fetchStatus();
      interval = setInterval(fetchStatus, 2500);
    } else {
      Swal.fire("Missing transaction", "No transaction id provided", "error");
    }

    return () => {
      clearInterval(interval);
    };
  }, [transactionId, router]);

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded shadow text-center">
      <h2 className="text-xl font-semibold text-green-600">
        {status ? "Payment Successful!" : "Processing Payment..."}
      </h2>
      <p className="mt-4">
        Transaction: <span className="font-mono">{transactionId}</span>
      </p>
      <p className="mt-4">
        Status: <strong>{status ?? "Checking..."}</strong>
      </p>
    </div>
  );
}
