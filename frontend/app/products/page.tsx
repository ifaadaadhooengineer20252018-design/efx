"use client";

import { useEffect, useState } from "react";
import { translations } from "../../translations/translations";

export default function ProductsPage() {
  // Products are loaded from the EFX backend
  const [products, setProducts] = useState<any[]>([]);
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChanged = () => {
      const newLanguage = localStorage.getItem("language");

      if (newLanguage) {
        setLanguage(newLanguage);
      }
    };

    window.addEventListener("languageChanged", handleLanguageChanged);

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChanged
      );
    };
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
      });
  }, []);

  const t =
    translations[language as keyof typeof translations];

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-4xl font-bold text-green-800">
          {language === "English"
            ? "EFX Products"
            : language === "Afaan Oromo"
            ? "Oomishaalee EFX"
            : "የEFX ምርቶች"}
        </h1>

        <p className="mt-3 text-center text-gray-600">
          {language === "English"
            ? "Browse agricultural products from Ethiopian farmers."
            : language === "Afaan Oromo"
            ? "Oomishaalee qonnaa qonnaan bultoota Itoophiyaa irraa dhufan ilaali."
            : "ከኢትዮጵያ ገበሬዎች የሚመጡ የግብርና ምርቶችን ይመልከቱ።"}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-green-100 text-6xl">
                {product.icon}
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                {product.name}
              </h2>

              <p className="mt-2 text-gray-600">
                {product.description}
              </p>

              <p className="mt-4 font-bold text-green-700">
                {product.price}
              </p>

              <a
                href={`/products/${product.id}`}
                className="mt-4 block w-full rounded-lg bg-green-700 px-4 py-2 text-center font-semibold text-white hover:bg-green-800"
              >
                {t.viewProduct}
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
