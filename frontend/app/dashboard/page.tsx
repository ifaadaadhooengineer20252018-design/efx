"use client";

import { useEffect, useState } from "react";
import { translations } from "../../translations/translations";

export default function DashboardPage() {
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
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-green-800">
          {language === "English"
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
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
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
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
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
          </div>
        </div>
      </div>
    </main>
  );
}