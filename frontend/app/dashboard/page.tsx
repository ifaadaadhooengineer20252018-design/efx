"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { translations } from "../../translations/translations";

export default function DashboardPage() {
  const [language, setLanguage] = useState("English");
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role || "");
      } catch {
        setRole("");
      }
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

  const isBuyer = role === "buyer";

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-green-800">
          {isBuyer
            ? language === "English"
              ? "Buyer Dashboard"
              : language === "Afaan Oromo"
              ? "Daashboordii Bittaa"
              : "የገዢ ዳሽቦርድ"
            : language === "English"
            ? "Farmer Dashboard"
            : language === "Afaan Oromo"
            ? "Daashboordii Qonnaan Bulaa"
            : "የገበሬ ዳሽቦርድ"}
        </h1>

        <p className="mt-3 text-gray-600">
          {language === "English"
            ? "Welcome to EFX Ethiopia Farm Exchange."
            : language === "Afaan Oromo"
            ? "Baga gara EFX Ethiopia Farm Exchange dhuftan."
            : "ወደ EFX Ethiopia Farm Exchange እንኳን በደህና መጡ።"}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {isBuyer ? (
            <>
              {/* Browse Products */}
              <Link
                href="/products"
                className="block cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "Browse Products"
                    : language === "Afaan Oromo"
                    ? "Oomishaalee Barbaadi"
                    : "ምርቶችን ይመልከቱ"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "Find agricultural products from farmers."
                    : language === "Afaan Oromo"
                    ? "Oomishaalee qonnaan bultoota irraa barbaadi."
                    : "ከገበሬዎች የግብርና ምርቶችን ያግኙ።"}
                </p>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="block cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "Cart"
                    : language === "Afaan Oromo"
                    ? "Gaarii Bittaa"
                    : "ጋሪ"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "View products you want to buy."
                    : language === "Afaan Oromo"
                    ? "Oomishaalee bituu barbaaddu ilaali."
                    : "ለመግዛት የሚፈልጉትን ምርቶች ይመልከቱ።"}
                </p>
              </Link>

              {/* Orders */}
              <Link
                href="/dashboard/orders"
                className="block cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "My Orders"
                    : language === "Afaan Oromo"
                    ? "Ajajawwan Koo"
                    : "ትዕዛዞቼ"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "View your orders here."
                    : language === "Afaan Oromo"
                    ? "Ajajawwan kee asitti ilaali."
                    : "ትዕዛዞችዎን እዚህ ይመልከቱ።"}
                </p>
              </Link>

              {/* Profile */}
              <Link
                href="/dashboard/profile"
                className="block cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "Profile"
                    : language === "Afaan Oromo"
                    ? "Profaayilii"
                    : "መገለጫ"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "Manage your profile information."
                    : language === "Afaan Oromo"
                    ? "Odeeffannoo profaayilii kee bulchi."
                    : "የመገለጫ መረጃዎን ያስተዳድሩ።"}
                </p>
              </Link>
            </>
          ) : (
            <>
              {/* My Products */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "My Products"
                    : language === "Afaan Oromo"
                    ? "Oomishaalee Koo"
                    : "የእኔ ምርቶች"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "Manage your farm products here."
                    : language === "Afaan Oromo"
                    ? "Oomishaalee qonnaa kee asitti bulchi."
                    : "የእርሻ ምርቶችዎን እዚህ ያስተዳድሩ።"}
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    href="/dashboard/add-product"
                    className="rounded-lg bg-green-700 px-4 py-3 text-center font-semibold text-white hover:bg-green-800"
                  >
                    {language === "English"
                      ? "+ Add Product"
                      : language === "Afaan Oromo"
                      ? "+ Oomisha Dabali"
                      : "+ ምርት ጨምር"}
                  </Link>

                  <Link
                    href="/dashboard/my-products"
                    className="rounded-lg border border-green-700 px-4 py-3 text-center font-semibold text-green-700 hover:bg-green-50"
                  >
                    {language === "English"
                      ? "View My Products"
                      : language === "Afaan Oromo"
                      ? "Oomishaalee Koo Ilaali"
                      : "ምርቶቼን ይመልከቱ"}
                  </Link>
                </div>
              </div>

              {/* Orders */}
              <Link
                href="/dashboard/orders"
                className="block cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "Orders"
                    : language === "Afaan Oromo"
                    ? "Ajajawwan"
                    : "ትዕዛዞች"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "View your orders here."
                    : language === "Afaan Oromo"
                    ? "Ajajawwan kee asitti ilaali."
                    : "ትዕዛዞችዎን እዚህ ይመልከቱ።"}
                </p>
              </Link>

              {/* Profile */}
              <Link
                href="/dashboard/profile"
                className="block cursor-pointer rounded-xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {language === "English"
                    ? "Profile"
                    : language === "Afaan Oromo"
                    ? "Profaayilii"
                    : "መገለጫ"}
                </h2>

                <p className="mt-2 text-gray-600">
                  {language === "English"
                    ? "Manage your profile information."
                    : language === "Afaan Oromo"
                    ? "Odeeffannoo profaayilii kee bulchi."
                    : "የመገለጫ መረጃዎን ያስተዳድሩ።"}
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}