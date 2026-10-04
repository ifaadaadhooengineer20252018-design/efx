"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminReviewsPage() {
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
        "http://127.0.0.1:8000/me",
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
          Reviews Management
        </h1>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <p className="text-gray-600">
            Review management API will be connected next.
          </p>
        </div>

      </div>
    </main>
  );
}