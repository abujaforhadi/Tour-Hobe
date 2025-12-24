"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-3">
  
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Travel<span className="text-primary">Planner</span>
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Find travel buddies, create smart plans, and explore the world
              together. Built for travelers who believe journeys are better
              when shared.
            </p>
          </div>

    
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/travel-plans"
                  className="hover:text-primary transition"
                >
                  Travel Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-primary transition"
                >
                  Find Travel Buddies
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-primary transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="hover:text-primary transition"
                >
                  Create an Account
                </Link>
              </li>
            </ul>
          </div>

    
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Travel Highlights
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-xs text-gray-500">Active plans</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  120+
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-xs text-gray-500">Travel buddies</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  800+
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-xs text-gray-500">Countries</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  40+
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
                <p className="text-xs text-gray-500">Trips completed</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  1.5k+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Tour Hobe. All rights reserved.</p>
          <p className="text-gray-400">
            Made for travelers who love shared journeys.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
