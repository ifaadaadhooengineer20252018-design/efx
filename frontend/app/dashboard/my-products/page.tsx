"use client";

import { useEffect, useState } from "react";

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
    myProducts: "My Products",
    addProduct: "Add Product",
    noProducts: "You have no products yet.",
    loading: "Loading my products...",
    notLoggedIn: "You are not logged in.",
    failedLoad: "Failed to load products.",
    price: "Price",
    quantity: "Quantity",
    location: "Location",
    status: "Status",
    edit: "Edit",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete this product?",
    loginFirst: "Please login first.",
    deleted: "Product deleted successfully!",
    backendError: "Cannot connect to EFX backend.",
  },

  "Afaan Oromo": {
    myProducts: "Oomishaalee Koo",
    addProduct: "Oomisha Dabali",
    noProducts: "Ammaaf oomisha hin qabdu.",
    loading: "Oomishaalee koo fe'aa jira...",
    notLoggedIn: "Ati hin seenne.",
    failedLoad: "Oomishaalee fe'uun hin milkoofne.",
    price: "Gatii",
    quantity: "Baay'ina",
    location: "Bakka",
    status: "Haala",
    edit: "Fooyyessi",
    delete: "Haqi",
    confirmDelete:
      "Oomisha kana haquu akka barbaaddu mirkaneeffattaa?",
    loginFirst: "Mee dura seeni.",
    deleted: "Oomishni milkaa'inaan haqameera!",
    backendError:
      "Backend EFX waliin wal qunnamuun hin danda'amne.",
  },

  Amharic: {
    myProducts: "የእኔ ምርቶች",
    addProduct: "ምርት ጨምር",
    noProducts: "እስካሁን ምንም ምርት የለዎትም።",
    loading: "የእኔን ምርቶች በመጫን ላይ...",
    notLoggedIn: "አልገቡም።",
    failedLoad: "ምርቶችን መጫን አልተሳካም።",
    price: "ዋጋ",
    quantity: "መጠን",
    location: "ቦታ",
    status: "ሁኔታ",
    edit: "አርትዕ",
    delete: "ሰርዝ",
    confirmDelete:
      "ይህን ምርት ማጥፋት እንደሚፈልጉ እርግጠኛ ነዎት?",
    loginFirst: "እባክዎ መጀመሪያ ይግቡ።",
    deleted: "ምርቱ በተሳካ ሁኔታ ተሰርዟል!",
    backendError:
      "ከEFX backend ጋር መገናኘት አልተቻለም።",
  },
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>("English");

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/my-products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const t = translations[language];

  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm(t.confirmDelete);

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert(t.loginFirst);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        alert(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
        );

        return;
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );

      alert(t.deleted);
    } catch (error) {
      console.error(error);
      alert(t.backendError);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <p>{t.loading}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8">
        {error === "You are not logged in." ? (
          <p>{t.notLoggedIn}</p>
        ) : error === "Failed to load products." ? (
          <p>{t.failedLoad}</p>
        ) : (
          <p>{error}</p>
        )}
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-3xl font-bold">
        {t.myProducts}
      </h1>

      <a
        href="/dashboard/add-product"
        className="mb-6 inline-block rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
      >
        + {t.addProduct}
      </a>

      {products.length === 0 ? (
        <p>{t.noProducts}</p>
      ) : (
        <div className="space-y-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <h2 className="mb-2 text-2xl font-semibold">
                {product.name}
              </h2>

              <p className="mb-3 text-gray-700">
                {product.description}
              </p>

              <p>
                <strong>{t.price}:</strong>{" "}
                {product.price} / {product.unit}
              </p>

              <p>
                <strong>{t.quantity}:</strong>{" "}
                {product.quantity}
              </p>

              <p>
                <strong>{t.location}:</strong>{" "}
                {product.location}
              </p>

              <p className="mb-4">
                <strong>{t.status}:</strong>{" "}
                {product.status}
              </p>

              <a
                href={`/dashboard/my-products/edit/${product.id}`}
                className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                {t.edit}
              </a>

              <button
                onClick={() => handleDelete(product.id)}
                className="ml-2 inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                {t.delete}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
