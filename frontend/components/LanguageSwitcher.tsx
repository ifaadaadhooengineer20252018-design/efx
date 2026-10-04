"use client";

import { useState } from "react";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState("English");

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);

    localStorage.setItem("language", newLanguage);

    window.dispatchEvent(new Event("languageChanged"));
  };

  return (
    <select
      value={language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
    >
      <option value="English">English</option>
      <option value="Afaan Oromo">Afaan Oromo</option>
      <option value="Amharic">Amharic</option>
    </select>
  );
}