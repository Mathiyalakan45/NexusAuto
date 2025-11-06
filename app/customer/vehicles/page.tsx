"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function CustomerVehiclesPage() {
  return (
    <ProtectedRoute requiredRole={["ROLE_CUSTOMER"]}>
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <p className="mt-2 text-gray-600">Manage your vehicles</p>
          
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Vehicles management feature coming soon...</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}