"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
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

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-block mb-6 text-green-700 font-semibold hover:underline"
        >
          {language === "English"
            ? "← Back to Dashboard"
            : language === "Afaan Oromo"
            ? "← Gara Daashboordii Deebi'i"
            : "← ወደ ዳሽቦርድ ተመለስ"}
        </Link>

        <div className="rounded-xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-green-800">
            {language === "English"
              ? "My Profile"
              : language === "Afaan Oromo"
              ? "Profaayilii Koo"
              : "የእኔ መገለጫ"}
          </h1>

          <p className="mt-3 text-gray-600">
            {language === "English"
              ? "Manage your profile information here."
              : language === "Afaan Oromo"
              ? "Odeeffannoo profaayilii kee asitti bulchi."
              : "የመገለጫ መረጃዎን እዚህ ያስተዳድሩ።"}
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="block font-semibold text-gray-700">
                {language === "English"
                  ? "Full Name"
                  : language === "Afaan Oromo"
                  ? "Maqaa Guutuu"
                  : "ሙሉ ስም"}
              </label>

              <input
                type="text"
                placeholder={
                  language === "English"
                    ? "Enter your full name"
                    : language === "Afaan Oromo"
                    ? "Maqaa kee guutuu galchi"
                    : "ሙሉ ስምዎን ያስገቡ"
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                {language === "English"
                  ? "Phone"
                  : language === "Afaan Oromo"
                  ? "Bilbila"
                  : "ስልክ"}
              </label>

              <input
                type="text"
                placeholder={
                  language === "English"
                    ? "Enter your phone number"
                    : language === "Afaan Oromo"
                    ? "Lakkoofsa bilbilaa galchi"
                    : "የስልክ ቁጥርዎን ያስገቡ"
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
            >
              {language === "English"
                ? "Save Profile"
                : language === "Afaan Oromo"
                ? "Profaayilii Olkaa'i"
                : "መገለጫ አስቀምጥ"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}