"use client";

import { useEffect, useState } from "react";
import { translations } from "../../translations/translations";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const messages = data.detail
            .map(
              (item: { msg?: string }) =>
                item.msg || "Validation error"
            )
            .join(", ");

          alert(messages);
        } else {
          alert(data.detail || "Login failed");
        }

        return;
      }

      localStorage.setItem("token", data.access_token);

      alert(
        language === "English"
          ? "Login successful!"
          : language === "Afaan Oromo"
          ? "Seenuun milkaa'e!"
          : "መግባት ተሳክቷል!"
      );

      console.log("Access token:", data.access_token);
    } catch (error) {
      console.error("Login error:", error);

      alert(
        language === "English"
          ? "Cannot connect to EFX backend"
          : language === "Afaan Oromo"
          ? "EFX backend waliin wal qunnamuun hin danda'amne."
          : "ከ EFX backend ጋር መገናኘት አልተቻለም።"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-800">
            EFX
          </h1>

          <p className="mt-2 text-gray-600">
            Ethiopia Farm Exchange
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800">
            {t.login}
          </h2>

          <p className="mt-2 text-gray-600">
            {language === "English"
              ? "Login to your EFX account."
              : language === "Afaan Oromo"
              ? "Herrega EFX kee keessa seeni."
              : "ወደ EFX መለያዎ ይግቡ።"}
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  language === "English"
                    ? "Enter your email"
                    : language === "Afaan Oromo"
                    ? "Email kee galchi"
                    : "ኢሜይልዎን ያስገቡ"
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-green-700"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  language === "English"
                    ? "Enter your password"
                    : language === "Afaan Oromo"
                    ? "Password kee galchi"
                    : "የይለፍ ቃልዎን ያስገቡ"
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-green-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? language === "English"
                  ? "Logging in..."
                  : language === "Afaan Oromo"
                  ? "Seenaa jira..."
                  : "በመግባት ላይ..."
                : t.login}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {language === "English"
              ? "Don't have an account?"
              : language === "Afaan Oromo"
              ? "Herrega hin qabduu?"
              : "መለያ የለዎትም?"}{" "}
            <a
              href="#"
              className="font-semibold text-green-700 hover:underline"
            >
              {language === "English"
                ? "Register"
                : language === "Afaan Oromo"
                ? "Galmaa'i"
                : "ይመዝገቡ"}
            </a>
          </p>

          <a
            href="/"
            className="mt-4 block text-center text-green-700 hover:underline"
          >
            ←{" "}
            {language === "English"
              ? "Back to Home"
              : language === "Afaan Oromo"
              ? "Gara Manaatti Deebi'i"
              : "ወደ መነሻ ተመለስ"}
          </a>
        </div>
      </div>
    </main>
  );
}