import Link from "next/link";

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        
      
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

       
        <h1 className="text-2xl font-semibold text-red-800">Payment Failed</h1>
        <p className="text-gray-500 mt-2">
          Something went wrong during the payment process. Please try again.
        </p>

      
        <Link href="/user/payment">
          <button className="mt-6 w-full bg-primary hover:bg-primary text-white py-2.5 rounded-md text-lg font-medium transition-all duration-300">
            Try Again
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
