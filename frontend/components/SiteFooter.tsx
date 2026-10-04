"use client";

import { useEffect, useState } from "react";

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<Language, string> = {
  English:
    "© 2026 EFX Ethiopia Farm Exchange. All rights reserved.",

  "Afaan Oromo":
    "© 2026 EFX Ethiopia Farm Exchange. Mirgi hundi eegama.",

  Amharic:
    "© 2026 EFX Ethiopia Farm Exchange. መብቱ በሕግ የተጠበቀ ነው።",
};

export default function SiteFooter() {
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

  return (
    <footer className="border-t bg-white py-6 text-center text-sm text-gray-600">
      <p>{translations[language]}</p>
    </footer>
  );
}
