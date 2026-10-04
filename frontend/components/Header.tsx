"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<
  Language,
  Record<string, string>
> = {
  English: {
    home: "Home",
    products: "Products",
    login: "Login",
  },

  "Afaan Oromo": {
    home: "Mana",
    products: "Oomishaalee",
    login: "Seeni",
  },

  Amharic: {
    home: "መነሻ",
    products: "ምርቶች",
    login: "ግባ",
  },
};

export default function Header() {
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

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold text-green-800"
        >
          EFX Ethiopia Farm Exchange
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-medium text-gray-700 hover:text-green-700"
          >
            {t.home}
          </Link>

          <Link
            href="/products"
            className="font-medium text-gray-700 hover:text-green-700"
          >
            {t.products}
          </Link>

          <Link
            href="/login"
            className="font-medium text-gray-700 hover:text-green-700"
          >
            {t.login}
          </Link>

          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}