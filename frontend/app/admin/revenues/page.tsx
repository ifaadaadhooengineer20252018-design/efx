"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Revenue = {
  id: number;
  order_id: number;
  revenue_type: string;
  amount: string;
  status: string;
  created_at: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://efx-backend.onrender.com";

export default function RevenueManagement() {
  const router = useRouter();

  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loadRevenues = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Check current user
        const meResponse = await fetch(
          `${API_URL}/me`,
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

        // Get revenue records
        const revenueResponse = await fetch(
          `${API_URL}/admin/revenues`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!revenueResponse.ok) {
          throw new Error("Failed to load revenue records.");
        }

        const revenueData = await revenueResponse.json();

        setRevenues(revenueData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Cannot connect to EFX backend.");
        setLoading(false);
      }
    };

    loadRevenues();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg">
          Loading Revenue Management...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  const totalRevenue = revenues
    .filter((revenue) => revenue.status === "earned")
    .reduce(
      (total, revenue) => total + Number(revenue.amount),
      0
    );

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Revenue Management
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage EFX revenue records.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin-panel")}
            className="rounded-lg bg-gray-800 px-5 py-2 text-white transition hover:bg-gray-700"
          >
            ← Back to Admin
          </button>
        </div>

        {/* Revenue Summary */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">

          {/* Total Revenue */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total EFX Revenue
            </p>

            <h2 className="mt-2 text-3xl font-bold text-indigo-700">
              {totalRevenue} ETB
            </h2>
          </div>

          {/* Revenue Records */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Revenue Records
            </p>

            <h2 className="mt-2 text-3xl font-bold text-blue-700">
              {revenues.length}
            </h2>
          </div>

          {/* Earned Records */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Earned Records
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-700">
              {
                revenues.filter(
                  (revenue) => revenue.status === "earned"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Revenue Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow">

          <div className="border-b px-6 py-5">
            <h2 className="text-xl font-bold text-gray-800">
              Revenue Records
            </h2>
          </div>

          {revenues.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No revenue records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Order ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Revenue Type
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Created At
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {revenues.map((revenue) => (
                    <tr
                      key={revenue.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {revenue.id}
                      </td>

                      <td className="px-6 py-4">
                        {revenue.order_id}
                      </td>

                      <td className="px-6 py-4">
                        {revenue.revenue_type ===
                        "farmer_commission"
                          ? "Farmer Commission"
                          : revenue.revenue_type ===
                            "buyer_service_fee"
                          ? "Buyer Service Fee"
                          : revenue.revenue_type}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {revenue.amount} ETB
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            revenue.status === "earned"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {revenue.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(
                          revenue.created_at
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}