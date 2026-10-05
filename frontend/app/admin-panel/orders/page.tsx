"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  status?: string;
  total_amount?: number;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://efx-backend.onrender.com";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const meResponse = await fetch(
        `${API_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!meResponse.ok) {
        router.push("/login");
        return;
      }

      const me = await meResponse.json();

      if (me.role !== "admin") {
        alert("Access denied. Admin only.");
        router.push("/");
        return;
      }

      const response = await fetch(
        `${API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setOrders(await response.json());
      }

      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) {
    return <p className="p-10">Loading orders...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => router.push("/admin")}
          className="mb-6 rounded-lg bg-gray-800 px-4 py-2 text-white"
        >
          ← Admin Dashboard
        </button>

        <h1 className="mb-6 text-3xl font-bold">
          Orders Management
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <h2 className="text-xl font-bold">
                Order #{order.id}
              </h2>

              <p className="mt-2">
                Status: {order.status ?? "pending"}
              </p>

              {order.total_amount !== undefined && (
                <p>
                  Total: {order.total_amount} ETB
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}