"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { translations } from "../../translations/translations";

export default function DashboardPage() {
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    setLoading(false);

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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700"></div>

          <p className="text-lg font-medium text-green-800">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  const t =
    translations[language as keyof typeof translations];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero / Welcome Section */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                🌾 EFX Ethiopia Farm Exchange
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {language === "English"
                  ? "My EFX Dashboard"
                  : language === "Afaan Oromo"
                  ? "Daashboordii EFX Koo"
                  : "የእኔ EFX ዳሽቦርድ"}
              </h1>

              <p className="mt-2 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
                {language === "English"
                  ? "Buy, sell, manage your orders, and control your EFX account from one place."
                  : language === "Afaan Oromo"
                  ? "Bakka tokko irraa bituu, gurguruu, ajaja kee bulchuu fi herrega EFX kee to'achuu dandeessa."
                  : "ከአንድ ቦታ ይግዙ፣ ይሽጡ፣ ትዕዛዞችዎን ያስተዳድሩ እና የEFX መለያዎን ይቆጣጠሩ።"}
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-md"
            >
              🛒{" "}
              {language === "English"
                ? "Browse Products"
                : language === "Afaan Oromo"
                ? "Oomisha Ilaali"
                : "ምርቶችን ይመልከቱ"}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === "English"
              ? "Quick Actions"
              : language === "Afaan Oromo"
              ? "Hojiiwwan Ariifachiisaa"
              : "ፈጣን እርምጃዎች"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {language === "English"
              ? "Everything you need is organized here."
              : language === "Afaan Oromo"
              ? "Wanti si barbaachisu hundi asitti qindaa'ee jira."
              : "የሚፈልጉት ሁሉ እዚህ ተደራጅቷል።"}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* BUY */}
          <Link
            href="/products"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                🛒
              </div>

              <span className="text-sm font-semibold text-green-700 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {language === "English"
                ? "Buy Products"
                : language === "Afaan Oromo"
                ? "Oomisha Biti"
                : "ምርቶችን ይግዙ"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {language === "English"
                ? "Browse agricultural products from EFX sellers and farmers."
                : language === "Afaan Oromo"
                ? "Oomisha qonnaa gurgurtootaa fi qonnaan bultoota EFX irraa ilaali."
                : "ከEFX ሻጮች እና ገበሬዎች የግብርና ምርቶችን ይመልከቱ።"}
            </p>
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                🛍️
              </div>

              <span className="text-sm font-semibold text-orange-600 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {language === "English"
                ? "My Cart"
                : language === "Afaan Oromo"
                ? "Gaarii Koo"
                : "የእኔ ጋሪ"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {language === "English"
                ? "Review selected products before checkout and payment."
                : language === "Afaan Oromo"
                ? "Oomisha filatte kee checkout fi kaffaltii dura ilaali."
                : "ከመክፈያ እና ከክፍያ በፊት የመረጧቸውን ምርቶች ይገምግሙ።"}
            </p>
          </Link>

          {/* ADD PRODUCT */}
          <Link
            href="/dashboard/add-product"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                ➕
              </div>

              <span className="text-sm font-semibold text-green-700 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {language === "English"
                ? "Sell on EFX"
                : language === "Afaan Oromo"
                ? "EFX Irratti Gurguri"
                : "በEFX ላይ ይሽጡ"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {language === "English"
                ? "Upload your agricultural products and reach more buyers."
                : language === "Afaan Oromo"
                ? "Oomisha qonnaa kee olkaa'iitii bitattoota hedduu bira ga'i."
                : "የግብርና ምርቶችዎን ይጫኑ እና ብዙ ገዢዎችን ያግኙ።"}
            </p>
          </Link>

          {/* MY PRODUCTS */}
          <Link
            href="/dashboard/my-products"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                📦
              </div>

              <span className="text-sm font-semibold text-blue-700 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {language === "English"
                ? "My Products"
                : language === "Afaan Oromo"
                ? "Oomisha Koo"
                : "ምርቶቼ"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {language === "English"
                ? "View, edit, and manage the products you sell on EFX."
                : language === "Afaan Oromo"
                ? "Oomisha ati EFX irratti gurgurtu ilaali, sirreessi fi bulchi."
                : "በEFX ላይ የሚሸጧቸውን ምርቶች ይመልከቱ፣ ያርሙ እና ያስተዳድሩ።"}
            </p>
          </Link>

          {/* ORDERS */}
          <Link
            href="/dashboard/orders"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-3xl">
                📋
              </div>

              <span className="text-sm font-semibold text-purple-700 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {language === "English"
                ? "Orders"
                : language === "Afaan Oromo"
                ? "Ajajawwan"
                : "ትዕዛዞች"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {language === "English"
                ? "Track products you bought and orders related to products you sell."
                : language === "Afaan Oromo"
                ? "Oomisha ati bitte fi ajaja oomisha ati gurgurtu waliin walqabatu hordofi."
                : "የገዙትን ምርቶች እና ከሚሸጧቸው ምርቶች ጋር የተያያዙ ትዕዛዞችን ይከታተሉ።"}
            </p>
          </Link>

          {/* PROFILE */}
          <Link
            href="/dashboard/profile"
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                👤
              </div>

              <span className="text-sm font-semibold text-gray-700 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              {language === "English"
                ? "My Profile"
                : language === "Afaan Oromo"
                ? "Profaayilii Koo"
                : "የእኔ መገለጫ"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {language === "English"
                ? "Manage your personal information and EFX account."
                : language === "Afaan Oromo"
                ? "Odeeffannoo dhuunfaa fi herrega EFX kee bulchi."
                : "የግል መረጃዎን እና የEFX መለያዎን ያስተዳድሩ።"}
            </p>
          </Link>
        </div>
      </section>

      {/* Buy / Sell split section */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Buyer side */}
          <div className="rounded-2xl bg-green-800 p-7 text-white shadow-md">
            <div className="mb-4 text-3xl">🛒</div>

            <h2 className="text-2xl font-bold">
              {language === "English"
                ? "Buy from EFX"
                : language === "Afaan Oromo"
                ? "EFX Irraa Biti"
                : "ከEFX ይግዙ"}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-green-50">
              {language === "English"
                ? "Find agricultural products, add them to your cart, checkout, pay, and track your orders."
                : language === "Afaan Oromo"
                ? "Oomisha qonnaa barbaadi, gaarii keessa galchi, checkout godhi, kaffali fi ajaja kee hordofi."
                : "የግብርና ምርቶችን ያግኙ፣ ወደ ጋሪዎ ያስገቡ፣ ይክፈሉ እና ትዕዛዝዎን ይከታተሉ።"}
            </p>

            <Link
              href="/products"
              className="mt-5 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-50"
            >
              {language === "English"
                ? "Start Buying →"
                : language === "Afaan Oromo"
                ? "Bittaa Jalqabi →"
                : "መግዛት ይጀምሩ →"}
            </Link>
          </div>

          {/* Seller side */}
          <div className="rounded-2xl border border-green-200 bg-white p-7 shadow-md">
            <div className="mb-4 text-3xl">🌾</div>

            <h2 className="text-2xl font-bold text-gray-900">
              {language === "English"
                ? "Sell on EFX"
                : language === "Afaan Oromo"
                ? "EFX Irratti Gurguri"
                : "በEFX ላይ ይሽጡ"}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              {language === "English"
                ? "List your farm products, manage your products, receive orders, and grow your market."
                : language === "Afaan Oromo"
                ? "Oomisha qonnaa kee galchi, bulchi, ajaja fudhadhu fi gabaa kee guddifadhu."
                : "የእርሻ ምርቶችዎን ያስገቡ፣ ያስተዳድሩ፣ ትዕዛዞችን ይቀበሉ እና ገበያዎን ያሳድጉ።"}
            </p>

            <Link
              href="/dashboard/add-product"
              className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-800"
            >
              {language === "English"
                ? "Add Product →"
                : language === "Afaan Oromo"
                ? "Oomisha Dabali →"
                : "ምርት ይጨምሩ →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Account footer area */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-gray-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            {language === "English"
              ? "One account. Buy, sell, order, and manage your EFX journey."
              : language === "Afaan Oromo"
              ? "Herrega tokko. Biti, gurguri, ajaji fi imala EFX kee bulchi."
              : "አንድ መለያ። ይግዙ፣ ይሽጡ፣ ይዘዙ እና የEFX ጉዞዎን ያስተዳድሩ።"}
          </p>

          <Link
            href="/"
            className="font-semibold text-green-700 hover:text-green-800 hover:underline"
          >
            ←{" "}
            {language === "English"
              ? "Back to Marketplace"
              : language === "Afaan Oromo"
              ? "Gara Gabaa EFX Deebi'i"
              : "ወደ EFX ገበያ ተመለስ"}
          </Link>
        </div>
      </section>
    </main>
  );
}