"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://efx-backend.onrender.com";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const user = await response.json();

      if (user.role !== "admin") {
        alert("Access denied. Admin only.");
        router.push("/");
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return <p className="p-10">Checking admin access...</p>;
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

        <h1 className="text-3xl font-bold">
          Payments Management
        </h1>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <p className="text-gray-600">
            Payment management API will be connected next.
          </p>
        </div>

      </div>
    </main>
  );
}