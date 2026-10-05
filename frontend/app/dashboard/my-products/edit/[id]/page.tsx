"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<Language, Record<string, string>> = {
  English: {
    editProduct: "Edit Product",
    updateProduct: "Update your farm product.",
    productName: "Product Name",
    description: "Description",
    price: "Price",
    quantity: "Quantity",
    unit: "Unit",
    location: "Location",
    update: "Update Product",
    saving: "Saving...",
    loading: "Loading product...",
    loginFirst: "Please login first.",
    failedLoad: "Failed to load product.",
    updated: "Product updated successfully!",
    backendError: "Cannot connect to EFX backend.",
  },

  "Afaan Oromo": {
    editProduct: "Oomisha Fooyyessi",
    updateProduct: "Oomisha qonnaa kee fooyyessi.",
    productName: "Maqaa Oomishaa",
    description: "Ibsa",
    price: "Gatii",
    quantity: "Baay'ina",
    unit: "Safartuu",
    location: "Bakka",
    update: "Oomisha Fooyyessi",
    saving: "Olkaa'aa jira...",
    loading: "Oomisha fe'aa jira...",
    loginFirst: "Mee dura seeni.",
    failedLoad: "Oomisha fe'uun hin milkoofne.",
    updated: "Oomishni milkaa'inaan fooyya'eera!",
    backendError:
      "Backend EFX waliin wal qunnamuun hin danda'amne.",
  },

  Amharic: {
    editProduct: "ምርት አርትዕ",
    updateProduct: "የእርሻ ምርትዎን ያዘምኑ።",
    productName: "የምርት ስም",
    description: "መግለጫ",
    price: "ዋጋ",
    quantity: "መጠን",
    unit: "መለኪያ",
    location: "ቦታ",
    update: "ምርት አዘምን",
    saving: "በማስቀመጥ ላይ...",
    loading: "ምርቱን በመጫን ላይ...",
    loginFirst: "እባክዎ መጀመሪያ ይግቡ።",
    failedLoad: "ምርቱን መጫን አልተሳካም።",
    updated: "ምርቱ በተሳካ ሁኔታ ተዘምኗል!",
    backendError:
      "ከEFX backend ጋር መገናኘት አልተቻለም።",
  },
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        translations[language].loginFirst
      );
      return;
    }

    fetch(`${API_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load product.");
        }

        return response.json();
      })
      .then((data) => {
        setName(data.name || "");
        setDescription(data.description || "");
        setPrice(String(data.price ?? ""));
        setQuantity(String(data.quantity ?? ""));
        setUnit(data.unit || "");
        setLocation(data.location || "");
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert(
          translations[language].failedLoad
        );
        setLoading(false);
      });
  }, [productId, language]);

  const t = translations[language];

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert(t.loginFirst);
        return;
      }

      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            price,
            quantity,
            unit,
            location,
            status: "available",
            category_id: 1,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail)
        );
        return;
      }

      alert(t.updated);
      router.push("/dashboard/my-products");
    } catch (error) {
      console.error(error);
      alert(t.backendError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-8">
        <p>{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-green-800">
          {t.editProduct}
        </h1>

        <p className="mb-8 text-gray-600">
          {t.updateProduct}
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-8 shadow-lg"
        >
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.productName}
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.description}
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.price}
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.quantity}
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.unit}
            </label>

            <input
              type="text"
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              {t.location}
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? t.saving : t.update}
          </button>
        </form>
      </div>
    </main>
  );
}