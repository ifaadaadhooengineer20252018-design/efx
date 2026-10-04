"use client";

import { useEffect, useState } from "react";
import { translations } from "../translations/translations";

export default function Home() {
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

  const t =
    translations[language as keyof typeof translations];

  return (
    <main className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-green-800">
            EFX
          </h1>

          <div className="flex gap-6 font-medium text-gray-700">
            <a
              href="/"
              className="hover:text-green-700"
            >
              {t.home}
            </a>

            <a
              href="/products"
              className="hover:text-green-700"
            >
              {t.products}
            </a>

            <a
              href="/login"
              className="hover:text-green-700"
            >
              {t.login}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl font-bold text-green-800">
          {t.title}
        </h2>

        <p className="mt-4 max-w-2xl text-lg text-gray-700">
          {t.slogan}
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/products"
            className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            {t.browseProducts}
          </a>

          <a
            href="/login"
            className="rounded-lg border border-green-700 px-6 py-3 font-semibold text-green-700 hover:bg-green-100"
          >
            {t.loginButton}
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-center text-3xl font-bold text-green-800">
          {t.featuredProducts}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Tomato */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-green-100 text-5xl">
              🍅
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              {t.freshTomato}
            </h3>

            <p className="mt-2 text-gray-600">
              {t.tomatoDescription}
            </p>

            <p className="mt-4 font-bold text-green-700">
              50 ETB / kg
            </p>

            <a
              href="/products"
              className="mt-4 block w-full rounded-lg bg-green-700 px-4 py-2 text-center font-semibold text-white hover:bg-green-800"
            >
              {t.viewProduct}
            </a>
          </div>

          {/* Wheat */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-yellow-100 text-5xl">
              🌾
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              {t.wheat}
            </h3>

            <p className="mt-2 text-gray-600">
              {t.wheatDescription}
            </p>

            <p className="mt-4 font-bold text-green-700">
              80 ETB / kg
            </p>

            <a
              href="/products"
              className="mt-4 block w-full rounded-lg bg-green-700 px-4 py-2 text-center font-semibold text-white hover:bg-green-800"
            >
              {t.viewProduct}
            </a>
          </div>

          {/* Maize */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-orange-100 text-5xl">
              🌽
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              {t.maize}
            </h3>

            <p className="mt-2 text-gray-600">
              {t.maizeDescription}
            </p>

            <p className="mt-4 font-bold text-green-700">
              60 ETB / kg
            </p>

            <a
              href="/products"
              className="mt-4 block w-full rounded-lg bg-green-700 px-4 py-2 text-center font-semibold text-white hover:bg-green-800"
            >
              {t.viewProduct}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
