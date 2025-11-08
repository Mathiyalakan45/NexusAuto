"use client";

import { useAuth } from "@/lib/store/authStore";
import Link from "next/link";

/**
 * Home page component
 *
 * Features:
 * - Hero section with call-to-action
 * - Different content for authenticated vs non-authenticated users
 * - Service overview
 * - Responsive design
 */
export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Welcome to <span className="text-blue-200">NexusAuto</span>
            </h1>
            <p className="mb-8 text-xl text-blue-100 md:text-2xl">
              Your comprehensive vehicle management and service platform
            </p>

            {isAuthenticated && user ? (
              <div className="space-y-4">
                <p className="text-lg">
                  Welcome back,{" "}
                  <span className="font-semibold">{user.lastName}</span>!
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href="/profile"
                    className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    View Profile
                  </Link>
                  {user.role === "ROLE_ADMIN" && (
                    <Link
                      href="/admin"
                      className="rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-400"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === "ROLE_EMPLOYEE" && (
                    <Link
                      href="/employee"
                      className="rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-400"
                    >
                      Employee Dashboard
                    </Link>
                  )}
                  {user.role === "ROLE_CUSTOMER" && (
                    <Link
                      href="/customer"
                      className="rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-400"
                    >
                      Customer Dashboard
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-400"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional vehicle management and maintenance solutions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM21 17a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10l-2-18h3.5a.5.5 0 01.5.5V3H5v-.5a.5.5 0 01.5-.5H9l-2 18z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Vehicle Management
              </h3>
              <p className="text-gray-600">
                Comprehensive tracking and management of your vehicle fleet with
                detailed service histories.
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4m-8 0h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Service Scheduling
              </h3>
              <p className="text-gray-600">
                Easy online appointment booking and service scheduling with
                automated reminders.
              </p>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Expert Team
              </h3>
              <p className="text-gray-600">
                Professional mechanics and service advisors dedicated to keeping
                your vehicles running smoothly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gray-900 py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
            <p className="mb-8 text-xl text-gray-300">
              Join thousands of satisfied customers who trust NexusAuto with
              their vehicles.
            </p>
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
