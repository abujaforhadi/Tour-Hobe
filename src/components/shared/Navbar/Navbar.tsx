/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

type TourStep = 0 | 1 | 2;

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

 
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState<TourStep>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    
    const seen = window.localStorage.getItem("Tour Hobe_nav_tour_seen");
    if (!seen) {
      setShowTour(true);
      setTourStep(0);
    }
  }, []);

  const closeTour = () => {
    setShowTour(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("Tour Hobe_nav_tour_seen", "1");
    }
  };

  const nextStep = () => {
    setTourStep((prev) => {
      if (prev === 2) {
       
        closeTour();
        return prev;
      }
      return (prev + 1) as TourStep;
    });
  };

  const prevStep = () => {
    setTourStep((prev) => (prev === 0 ? prev : ((prev - 1) as TourStep)));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
     <Loader/>);
  }


  const highlightExplore = showTour && tourStep === 0 ? "ring-2 ring-orange-400 ring-offset-2" : "";
  const highlightPlans = showTour && tourStep === 1 ? "ring-2 ring-orange-400 ring-offset-2" : "";
  const highlightAuth = showTour && tourStep === 2 ? "ring-2 ring-orange-400 ring-offset-2" : "";

  return (
    <nav className="bg-gray-50 border-b border-gray-200 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-primary font-extrabold text-xl sm:text-2xl tracking-tight"
            >
              Tour Hobe
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${highlightExplore}`}
            >
              Home
            </Link>
           
            <Link
              href="/about"
              className={`text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${highlightExplore}`}
            >
              About
            </Link>
             <Link
              href="/faq"
              className={`text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${highlightExplore}`}
            >
              FAQ
            </Link>
            <Link
              href="/explore"
              className={`text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${highlightExplore}`}
            >
              Explore
            </Link>

            <Link
              href="/travel-plans"
              className={`text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium ${highlightPlans}`}
            >
              All Plans
            </Link>

            {user ? (
              <>
                <Link
                  href="/user"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  User Dashboard
                </Link>

                <Link
                  href={`/profile`}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 bg-primary hover:bg-primary text-white rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-1 bg-primary hover:bg-primary text-white rounded-md text-sm font-medium ${highlightAuth}`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-primary hover:text-primary ${highlightAuth}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {open ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              href="/" 
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary ${highlightExplore}`}
            >
              Home
            </Link>
            <Link
              href="/about" 
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary ${highlightExplore}`}
            >
              About
            </Link>
            <Link
              href="/faq" 
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary ${highlightExplore}`}
            >
              FAQ 
            </Link>
            <Link
              href="/explore" 
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary ${highlightExplore}`}
            >
              Explore
            </Link>

            <Link
              href="/travel-plans"
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary ${highlightPlans}`}
            >
              All Plans
            </Link>

            {user ? (
              <>
                <Link
                  href="/user"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  User Dashboard
                </Link>

                <Link
                  href={`/profile`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  Profile
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="w-full text-left px-3 py-2 bg-primary hover:bg-primary text-white rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 bg-primary hover:bg-primary text-white rounded-md text-base font-medium ${highlightAuth}`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 border border-gray-200 rounded-md text-base font-medium text-gray-700 hover:border-primary hover:text-primary ${highlightAuth}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}


    </nav>
  );
}
