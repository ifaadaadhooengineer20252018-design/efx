"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<Language, Record<string, string>> = {
  English: {
    addProduct: "Add Product",
    descriptionText: "Add your farm product to EFX.",
    productName: "Product Name",
    productNamePlaceholder: "e.g. Tomato",
    description: "Description",
    descriptionPlaceholder: "Describe your product",
    price: "Price",
    pricePlaceholder: "50",
    quantity: "Quantity",
    quantityPlaceholder: "100",
    unit: "Unit",
    unitPlaceholder: "kg",
    location: "Location",
    locationPlaceholder: "e.g. Adama",
    adding: "Adding Product...",
    pleaseLogin: "Please login first.",
    failedUser: "Failed to get current user.",
    farmerIdNotFound: "Farmer ID was not found.",
    added: "Product added successfully!",
    backendError: "Cannot connect to EFX backend.",
  },

  "Afaan Oromo": {
    addProduct: "Oomisha Dabali",
    descriptionText: "Oomisha qonnaa kee gara EFXtti dabali.",
    productName: "Maqaa Oomishaa",
    productNamePlaceholder: "fkn. Timaatimii",
    description: "Ibsa",
    descriptionPlaceholder: "Oomisha kee ibsi",
    price: "Gatii",
    pricePlaceholder: "50",
    quantity: "Baay'ina",
    quantityPlaceholder: "100",
    unit: "Safartuu",
    unitPlaceholder: "kg",
    location: "Bakka",
    locationPlaceholder: "fkn. Adaamaa",
    adding: "Oomisha dabalaa jira...",
    pleaseLogin: "Mee dura seeni.",
    failedUser: "Odeeffannoo fayyadamaa argachuun hin milkoofne.",
    farmerIdNotFound: "ID qonnaan bulaa hin argamne.",
    added: "Oomishni milkaa'inaan dabalameera!",
    backendError:
      "Backend EFX waliin wal qunnamuun hin danda'amne.",
  },

  Amharic: {
    addProduct: "ምርት ጨምር",
    descriptionText: "የእርሻ ምርትዎን ወደ EFX ያክሉ።",
    productName: "የምርት ስም",
    productNamePlaceholder: "ለምሳሌ ቲማቲም",
    description: "መግለጫ",
    descriptionPlaceholder: "ምርትዎን ይግለጹ",
    price: "ዋጋ",
    pricePlaceholder: "50",
    quantity: "መጠን",
    quantityPlaceholder: "100",
    unit: "መለኪያ",
    unitPlaceholder: "ኪ.ግ",
    location: "ቦታ",
    locationPlaceholder: "ለምሳሌ አዳማ",
    adding: "ምርት በመጨመር ላይ...",
    pleaseLogin: "እባክዎ መጀመሪያ ይግቡ።",
    failedUser: "የአሁኑን ተጠቃሚ ማግኘት አልተሳካም።",
    farmerIdNotFound: "የገበሬው ID አልተገኘም።",
    added: "ምርቱ በተሳካ ሁኔታ ተጨምሯል!",
    backendError:
      "ከEFX backend ጋር መገናኘት አልተቻለም።",
  },
};

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert(t.pleaseLogin);
        return;
      }

      // Get the currently logged-in user
      const userResponse = await fetch(
        `${API_URL}/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        alert(
          typeof userData.detail === "string"
            ? userData.detail
            : t.failedUser
        );
        return;
      }

      const farmerId = userData.id;

      if (!farmerId) {
        alert(t.farmerIdNotFound);
        return;
      }

      // Create product
      const response = await fetch(
        `${API_URL}/products`,
        {
          method: "POST",
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
            farmer_id: farmerId,
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

      alert(t.added);

      router.push("/dashboard/my-products");
    } catch (error) {
      console.error(error);
      alert(t.backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-green-800">
          {t.addProduct}
        </h1>

        <p className="mb-8 text-gray-600">
          {t.descriptionText}
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
              onChange={(e) => setName(e.target.value)}
              placeholder={t.productNamePlaceholder}
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
              placeholder={t.descriptionPlaceholder}
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
              placeholder={t.pricePlaceholder}
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
              placeholder={t.quantityPlaceholder}
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
              onChange={(e) => setUnit(e.target.value)}
              placeholder={t.unitPlaceholder}
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
              placeholder={t.locationPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? t.adding : t.addProduct}
          </button>
        </form>
      </div>
    </main>
  );
}