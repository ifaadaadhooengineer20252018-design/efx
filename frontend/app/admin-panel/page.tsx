"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AdminStats = {
  total_users: number;
  total_farmers: number;
  total_buyers: number;
  total_admins: number;
  total_products: number;
  total_orders: number;
  total_deliveries: number;
  total_payments: number;
  total_reviews: number;
  available_drivers: number;
  total_revenue: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Check current user
        const meResponse = await fetch(
          "http://127.0.0.1:8000/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!meResponse.ok) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const me = await meResponse.json();

        if (me.role !== "admin") {
          alert("Access denied. Admin only.");
          router.push("/");
          return;
        }

        setAuthorized(true);

        // Get admin statistics
        const statsResponse = await fetch(
          "http://127.0.0.1:8000/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!statsResponse.ok) {
          throw new Error("Failed to load admin statistics.");
        }

        const statsData = await statsResponse.json();
        setStats(statsData);

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Cannot connect to EFX backend.");
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg">Loading Admin Dashboard...</p>
      </main>
    );
  }

  if (!authorized || !stats) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            EFX Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage Ethiopia Farm Exchange.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* Users */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Users
            </p>

            <h2 className="mt-2 text-3xl font-bold text-purple-700">
              {stats.total_users}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Farmers: {stats.total_farmers} | Buyers: {stats.total_buyers}
            </p>
          </div>

          {/* Products */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Products
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-700">
              {stats.total_products}
            </h2>
          </div>

          {/* Orders */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-700">
              {stats.total_orders}
            </h2>
          </div>

          {/* Payments */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Payments
            </p>

            <h2 className="mt-2 text-3xl font-bold text-emerald-700">
              {stats.total_payments}
            </h2>
          </div>

          {/* Deliveries */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Deliveries
            </p>

            <h2 className="mt-2 text-3xl font-bold text-orange-600">
              {stats.total_deliveries}
            </h2>
          </div>

          {/* Drivers */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Available Drivers
            </p>

            <h2 className="mt-2 text-3xl font-bold text-orange-700">
              {stats.available_drivers}
            </h2>
          </div>

          {/* Reviews */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Reviews
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {stats.total_reviews}
            </h2>
          </div>

          {/* Admins */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Admins
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {stats.total_admins}
            </h2>
          </div>

          {/* Revenue */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total EFX Revenue
            </p>

            <h2 className="mt-2 text-3xl font-bold text-indigo-700">
              {stats.total_revenue} ETB
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Farmer commission + Buyer service fee
            </p>
          </div>

        </div>

        {/* Management */}
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            Management
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* Users Management */}
            <button
              onClick={() => router.push("/admin/users")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Users Management
              </h3>

              <p className="mt-2 text-gray-500">
                View and manage farmers, buyers and admins.
              </p>
            </button>

            {/* Products Management */}
            <button
              onClick={() => router.push("/admin/products")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Products Management
              </h3>

              <p className="mt-2 text-gray-500">
                View and manage farm products.
              </p>
            </button>

            {/* Orders Management */}
            <button
              onClick={() => router.push("/admin/orders")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Orders Management
              </h3>

              <p className="mt-2 text-gray-500">
                View and manage customer orders.
              </p>
            </button>

            {/* Delivery Management */}
            <button
              onClick={() => router.push("/admin/deliveries")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Delivery Management
              </h3>

              <p className="mt-2 text-gray-500">
                Manage drivers and deliveries.
              </p>
            </button>

            {/* Payments Management */}
            <button
              onClick={() => router.push("/admin/payments")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Payments Management
              </h3>

              <p className="mt-2 text-gray-500">
                View payment records.
              </p>
            </button>

            {/* Reviews Management */}
            <button
              onClick={() => router.push("/admin/reviews")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Reviews Management
              </h3>

              <p className="mt-2 text-gray-500">
                View product reviews.
              </p>
            </button>

            {/* Revenue Management */}
            <button
              onClick={() => router.push("/admin/revenues")}
              className="rounded-2xl bg-white p-6 text-left shadow transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">
                Revenue Management
              </h3>

              <p className="mt-2 text-gray-500">
                View EFX revenue from farmer commissions and buyer service fees.
              </p>
            </button>

          </div>
        </div>

      </div>
    </main>
  );
}