"use client";

import { useEffect, useState } from "react";

type Order = {
  id: number;
  total_amount?: number;
  status?: string;
  created_at?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getTitle = () => {
    if (language === "Afaan Oromo") return "Ajajawwan Koo";
    if (language === "Amharic") return "ትዕዛዞቼ";
    return "My Orders";
  };

  const getBackText = () => {
    if (language === "Afaan Oromo") return "Gara Dashboard";
    if (language === "Amharic") return "ወደ Dashboard ተመለስ";
    return "Back to Dashboard";
  };

  const getEmptyText = () => {
    if (language === "Afaan Oromo") return "Ajajawwan ammaaf hin jiran.";
    if (language === "Amharic") return "እስካሁን ትዕዛዝ የለም።";
    return "You have no orders yet.";
  };

  const getStatusText = (status?: string) => {
    if (!status) return "Unknown";

    if (language === "Afaan Oromo") {
      if (status === "pending") return "Eeggachaa jira";
      if (status === "confirmed") return "Mirkanaa'e";
      if (status === "completed") return "Xumurame";
      if (status === "cancelled") return "Haqame";
    }

    if (language === "Amharic") {
      if (status === "pending") return "በመጠባበቅ ላይ";
      if (status === "confirmed") return "ተረጋግጧል";
      if (status === "completed") return "ተጠናቋል";
      if (status === "cancelled") return "ተሰርዟል";
    }

    return status;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            {getTitle()}
          </h1>

          <a
            href="/dashboard"
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            {getBackText()}
          </a>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">{getEmptyText()}</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white p-6 shadow-md"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-gray-600">
                      Total: {order.total_amount ?? 0} ETB
                    </p>

                    {order.created_at && (
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}