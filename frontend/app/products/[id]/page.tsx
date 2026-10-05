"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  status: string;
};

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<Language, Record<string, string>> = {
  English: {
    loading: "Loading product...",
    productNotFound: "Product not found.",
    price: "Price",
    quantity: "Quantity",
    location: "Location",
    status: "Status",
    addToCart: "Add to Cart",
    addedToCart: "Product added to cart!",
  },

  "Afaan Oromo": {
    loading: "Oomisha fe'aa jira...",
    productNotFound: "Oomishni hin argamne.",
    price: "Gatii",
    quantity: "Baay'ina",
    location: "Bakka",
    status: "Haala",
    addToCart: "Gara Gaarii Bittaatti Dabali",
    addedToCart: "Oomishni gara gaarii bittaatti dabalameera!",
  },

  Amharic: {
    loading: "ምርቱን በመጫን ላይ...",
    productNotFound: "ምርቱ አልተገኘም።",
    price: "ዋጋ",
    quantity: "መጠን",
    location: "ቦታ",
    status: "ሁኔታ",
    addToCart: "ወደ ግዢ ጋሪ ጨምር",
    addedToCart: "ምርቱ ወደ ግዢ ጋሪ ተጨምሯል!",
  },
};

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const [language, setLanguage] =
    useState<Language>("English");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (
      savedLanguage === "English" ||
      savedLanguage === "Afaan Oromo" ||
      savedLanguage === "Amharic"
    ) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChanged = () => {
      const newLanguage = localStorage.getItem("language");

      if (
        newLanguage === "English" ||
        newLanguage === "Afaan Oromo" ||
        newLanguage === "Amharic"
      ) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChanged
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChanged
      );
    };
  }, []);

  const t = translations[language];

  const addToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingItem = existingCart.find(
      (item: Product) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    setCartMessage(t.addedToCart);
  };

  useEffect(() => {
    fetch(`${API_URL}/products/${productId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Product not found.");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <p className="p-8">
        {t.loading}
      </p>
    );
  }

  if (error || !product) {
    return (
      <p className="p-8">
        {error || t.productNotFound}
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-green-800">
          {product.name}
        </h1>

        <p className="mt-4 text-gray-600">
          {product.description}
        </p>

        <div className="mt-6 space-y-3">
          <p>
            <strong>{t.price}:</strong>{" "}
            {product.price} ETB / {product.unit}
          </p>

          <p>
            <strong>{t.quantity}:</strong>{" "}
            {product.quantity} {product.unit}
          </p>

          <p>
            <strong>{t.location}:</strong>{" "}
            {product.location}
          </p>

          <p>
            <strong>{t.status}:</strong>{" "}
            {product.status}
          </p>
        </div>

        <button
          onClick={addToCart}
          className="mt-8 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
        >
          {t.addToCart}
        </button>

        {cartMessage && (
          <p className="mt-4 text-center font-semibold text-green-700">
            {cartMessage}
          </p>
        )}
      </div>
    </main>
  );
}