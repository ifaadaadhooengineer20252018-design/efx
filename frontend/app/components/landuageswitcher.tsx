"use client";

import { useEffect, useState } from "react";
import {
  setLanguage,
  getLanguage,
  Language,
} from "../lib/translation";

export default function LanguageSwitcher() {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = getLanguage();
    setLanguageState(savedLanguage);
  }, []);

  const handleChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setLanguageState(newLanguage);
    window.location.reload();
  };

  return (
    <select
      value={language}
      onChange={(e) =>
        handleChange(e.target.value as Language)
      }
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
    >
      <option value="en">English</option>
      <option value="om">Afaan Oromo</option>
      <option value="am">አማርኛ</option>
    </select>
  );
}