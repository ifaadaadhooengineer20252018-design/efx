"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Driver = {
  driver_id: number;
  user_id: number;
  license_number: string;
  is_available: boolean;
};

export default function AdminDeliveriesPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const meResponse = await fetch(
        "http://127.0.0.1:8000/me",
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
        "http://127.0.0.1:8000/drivers/available",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setDrivers(await response.json());
      }

      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) {
    return <p className="p-10">Loading deliveries...</p>;
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
          Delivery Management
        </h1>

        <h2 className="mb-4 text-xl font-bold">
          Available Drivers
        </h2>

        <div className="space-y-4">
          {drivers.map((driver) => (
            <div
              key={driver.driver_id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <p>
                Driver ID: {driver.driver_id}
              </p>

              <p>
                User ID: {driver.user_id}
              </p>

              <p>
                License: {driver.license_number}
              </p>

              <p>
                Available: {driver.is_available ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}