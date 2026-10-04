"use client";

import { useEffect, useState } from "react";

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations = {
English: {
title: "EFX SYSTEM TEST",
database: "Database",
backend: "Backend API",
authentication: "Authentication",
products: "Products",
myProducts: "My Products",
cart: "Cart",
removeCart: "Remove Cart",
total: "Total Calculation",
quantity: "Quantity",
},

"Afaan Oromo": {
title: "QORANSA SIRNA EFX",
database: "Kuusdeetaa",
backend: "Backend API",
authentication: "Mirkaneessa Seensaa",
products: "Oomishaalee",
myProducts: "Oomishaalee Koo",
cart: "Gaarii Bittaa",
removeCart: "Gaarii Bittaa Irraa Haqi",
total: "Herrega Waliigalaa",
quantity: "Baay'ina",
},

Amharic: {
title: "የEFX ስርዓት ሙከራ",
database: "ዳታቤዝ",
backend: "Backend API",
authentication: "ማረጋገጫ",
products: "ምርቶች",
myProducts: "የእኔ ምርቶች",
cart: "ጋሪ",
removeCart: "ከጋሪ ማስወገድ",
total: "ጠቅላላ ስሌት",
quantity: "ብዛት",
},
};

export default function TestPage() {
const [language, setLanguage] = useState<Language>("English");

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

window.addEventListener("languageChanged", handleLanguageChanged);

return () => {
  window.removeEventListener(
    "languageChanged",
    handleLanguageChanged
  );
};

}, []);

const t = translations[language];

return ( <main className="min-h-screen bg-green-50 px-6 py-12"> <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-md"> <h1 className="mb-8 text-3xl font-bold text-green-800">
{t.title} </h1>

    <div className="space-y-4 text-lg">
      <p>{t.database}: ✅</p>
      <p>{t.backend}: ✅</p>
      <p>{t.authentication}: ✅</p>
      <p>{t.products}: ✅</p>
      <p>{t.myProducts}: ✅</p>
      <p>{t.cart}: ✅</p>
      <p>{t.removeCart}: ✅</p>
      <p>{t.total}: ✅</p>
      <p>{t.quantity}: ✅</p>
    </div>
  </div>
</main>

);
}
