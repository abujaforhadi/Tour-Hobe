import PaymentSuccessClient from "@/components/modules/payment/PaymentSuccessClient";
import { Suspense } from "react";


export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded shadow text-center">
          <h2 className="text-xl font-semibold">Processing Payment...</h2>
          <p className="mt-4">Please wait while we verify your payment.</p>
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
