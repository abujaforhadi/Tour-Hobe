

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100 px-4">
      <div className="max-w-lg text-center">
        {/* Error Code */}
        <h1 className="text-8xl font-extrabold text-primary tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
          Page not found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          Oops! The page you’re looking for doesn’t exist or has been moved.
          Let’s get you back on track.
        </p>

        {/* Divider */}
        <div className="mt-6 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-primary"></div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary transition"
          >
            Go to Home
          </Link>

          <Link
            href="/travel-plans"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition"
          >
            Explore Plans
          </Link>
        </div>

        {/* Decorative Element */}
        <div className="mt-12 text-xs text-gray-400">
          Lost somewhere? Even the best travelers take a wrong turn sometimes ✈️
        </div>
      </div>
    </div>
  );
}
