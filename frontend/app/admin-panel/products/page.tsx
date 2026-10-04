"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  status: string;
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
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
        "http://127.0.0.1:8000/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts(await response.json());
      }

      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) {
    return <p className="p-10">Loading products...</p>;
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
          Products Management
        </h1>

        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <h2 className="text-xl font-bold">
                {product.name}
              </h2>

              <p>Price: {product.price} / {product.unit}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Location: {product.location}</p>
              <p>Status: {product.status}</p>
              <p>Product ID: {product.id}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}