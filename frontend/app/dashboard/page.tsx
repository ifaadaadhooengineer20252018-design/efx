"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
      window.removeEventListener("languageChanged", handleLanguageChanged);
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />
          <p className="text-sm font-semibold text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  const text = {
    welcome:
      language === "English"
        ? "Everything you need to buy, sell and manage EFX in one place."
        : language === "Afaan Oromo"
        ? "Wanti ati EFX irratti bituu, gurguruu fi bulchuuf barbaaddu hundi bakka tokko keessa jira."
        : "EFX ላይ ለመግዛት፣ ለመሸጥ እና ለማስተዳደር የሚፈልጉት ሁሉ በአንድ ቦታ አለ።",

    browse:
      language === "English"
        ? "Browse Products"
        : language === "Afaan Oromo"
        ? "Oomisha Ilaali"
        : "ምርቶችን ይመልከቱ",

    quick:
      language === "English"
        ? "Quick Actions"
        : language === "Afaan Oromo"
        ? "Hojiiwwan Ariifachiisaa"
        : "ፈጣን እርምጃዎች",

    quickSub:
      language === "English"
        ? "Move quickly to the most important parts of your EFX account."
        : language === "Afaan Oromo"
        ? "Kutaa herrega EFX kee barbaachisaa ta'e saffisaan bira ga'i."
        : "በEFX መለያዎ ውስጥ ወደ አስፈላጊ ክፍሎች በፍጥነት ይሂዱ.",

    buy:
      language === "English"
        ? "Buy Products"
        : language === "Afaan Oromo"
        ? "Oomisha Biti"
        : "ምርቶችን ይግዙ",

    cart:
      language === "English"
        ? "My Cart"
        : language === "Afaan Oromo"
        ? "Gaarii Koo"
        : "የእኔ ጋሪ",

    sell:
      language === "English"
        ? "Sell on EFX"
        : language === "Afaan Oromo"
        ? "EFX Irratti Gurguri"
        : "በEFX ላይ ይሽጡ",

    products:
      language === "English"
        ? "My Products"
        : language === "Afaan Oromo"
        ? "Oomisha Koo"
        : "ምርቶቼ",

    orders:
      language === "English"
        ? "Orders"
        : language === "Afaan Oromo"
        ? "Ajajawwan"
        : "ትዕዛዞች",

    profile:
      language === "English"
        ? "My Profile"
        : language === "Afaan Oromo"
        ? "Profaayilii Koo"
        : "የእኔ መገለጫ",
  };

  const cards = [
    {
      href: "/products",
      icon: "🛒",
      title: text.buy,
      description:
        language === "English"
          ? "Discover fresh agricultural products from EFX sellers."
          : language === "Afaan Oromo"
          ? "Oomisha qonnaa haaraa gurgurtoota EFX irraa argadhu."
          : "ከEFX ሻጮች ትኩስ የግብርና ምርቶችን ያግኙ።",
      tag:
        language === "English"
          ? "SHOP"
          : language === "Afaan Oromo"
          ? "BITAA"
          : "ግዢ",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-700",
      hover: "hover:border-emerald-300",
    },
    {
      href: "/cart",
      icon: "🛍️",
      title: text.cart,
      description:
        language === "English"
          ? "Review selected products and continue to checkout."
          : language === "Afaan Oromo"
          ? "Oomisha filatte ilaaliitii gara checkout itti fufi."
          : "የመረጧቸውን ምርቶች ይገምግሙ እና ወደ መክፈያ ይቀጥሉ።",
      tag:
        language === "English"
          ? "CHECKOUT"
          : language === "Afaan Oromo"
          ? "CHECKOUT"
          : "መክፈያ",
      iconBg: "bg-orange-50",
      iconText: "text-orange-600",
      hover: "hover:border-orange-300",
    },
    {
      href: "/dashboard/add-product",
      icon: "➕",
      title: text.sell,
      description:
        language === "English"
          ? "List your agricultural products and reach more buyers."
          : language === "Afaan Oromo"
          ? "Oomisha qonnaa kee galchiitii bitattoota hedduu bira ga'i."
          : "የግብርና ምርቶችዎን ይዘርዝሩ እና ብዙ ገዢዎችን ያግኙ።",
      tag:
        language === "English"
          ? "SELL"
          : language === "Afaan Oromo"
          ? "GURGURI"
          : "ሽያጭ",
      iconBg: "bg-green-50",
      iconText: "text-green-700",
      hover: "hover:border-green-300",
    },
    {
      href: "/dashboard/my-products",
      icon: "📦",
      title: text.products,
      description:
        language === "English"
          ? "View, edit and manage everything you are selling."
          : language === "Afaan Oromo"
          ? "Waan ati gurgurtu ilaali, sirreessi fi bulchi."
          : "የሚሸጧቸውን ምርቶች ይመልከቱ፣ ያርሙ እና ያስተዳድሩ።",
      tag:
        language === "English"
          ? "MANAGE"
          : language === "Afaan Oromo"
          ? "BULCHI"
          : "አስተዳድር",
      iconBg: "bg-blue-50",
      iconText: "text-blue-700",
      hover: "hover:border-blue-300",
    },
    {
      href: "/dashboard/orders",
      icon: "📋",
      title: text.orders,
      description:
        language === "English"
          ? "Track purchases and orders connected to your products."
          : language === "Afaan Oromo"
          ? "Bittaa fi ajaja oomisha kee waliin walqabatu hordofi."
          : "ግዢዎችን እና ከምርቶችዎ ጋር የተያያዙ ትዕዛዞችን ይከታተሉ።",
      tag:
        language === "English"
          ? "TRACK"
          : language === "Afaan Oromo"
          ? "HORDOFI"
          : "ይከታተሉ",
      iconBg: "bg-purple-50",
      iconText: "text-purple-700",
      hover: "hover:border-purple-300",
    },
    {
      href: "/dashboard/profile",
      icon: "👤",
      title: text.profile,
      description:
        language === "English"
          ? "Manage your personal information and account settings."
          : language === "Afaan Oromo"
          ? "Odeeffannoo dhuunfaa fi settings herrega kee bulchi."
          : "የግል መረጃዎን እና የመለያ ቅንብሮችዎን ያስተዳድሩ።",
      tag:
        language === "English"
          ? "ACCOUNT"
          : language === "Afaan Oromo"
          ? "HERREGA"
          : "መለያ",
      iconBg: "bg-slate-100",
      iconText: "text-slate-700",
      hover: "hover:border-slate-300",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-50 backdrop-blur">
                🌾 EFX Ethiopia Farm Exchange
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                My EFX Dashboard
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-green-50/90 sm:text-lg">
                {text.welcome}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-green-900 shadow-lg transition duration-200 hover:-translate-y-1 hover:bg-green-50 hover:shadow-xl"
                >
                  🛒 {text.browse}
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/dashboard/add-product"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white/15"
                >
                  🌾{" "}
                  {language === "English"
                    ? "Sell on EFX"
                    : language === "Afaan Oromo"
                    ? "EFX Irratti Gurguri"
                    : "በEFX ላይ ይሽጡ"}
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex">
              <div className="w-72 rounded-3xl border border-white/15 bg-white/10 p-7 text-white shadow-2xl backdrop-blur">
                <div className="text-5xl">🌱</div>

                <p className="mt-5 text-sm font-semibold text-green-100">
                  {language === "English"
                    ? "One account. Multiple opportunities."
                    : language === "Afaan Oromo"
                    ? "Herrega tokko. Carraawwan hedduu."
                    : "አንድ መለያ። ብዙ እድሎች።"}
                </p>

                <div className="mt-5 h-px bg-white/15" />

                <p className="mt-5 text-xs leading-5 text-green-100/80">
                  {language === "English"
                    ? "Buy, sell, manage products and follow your orders from one EFX account."
                    : language === "Afaan Oromo"
                    ? "Herrega EFX tokko irraa biti, gurguri, oomisha bulchi fi ajaja kee hordofi."
                    : "ከአንድ EFX መለያ ይግዙ፣ ይሽጡ፣ ምርቶችን ያስተዳድሩ እና ትዕዛዞችዎን ይከታተሉ።"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
              EFX ACCOUNT
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {text.quick}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {text.quickSub}
            </p>
          </div>
        </div>

        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group relative flex min-h-[235px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${card.hover}`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm ${card.iconBg}`}
                >
                  {card.icon}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider ${card.iconBg} ${card.iconText}`}
                >
                  {card.tag}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-green-800">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {card.description}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between pt-6">
                <span className="text-xs font-bold text-slate-400">
                  EFX
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-green-700 group-hover:text-white">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BUY / SELL */}
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl bg-green-900 p-8 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 transition duration-500 group-hover:scale-125" />

            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                🛒
              </div>

              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-200">
                BUY
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {language === "English"
                  ? "Buy from EFX"
                  : language === "Afaan Oromo"
                  ? "EFX Irraa Biti"
                  : "ከEFX ይግዙ"}
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-green-50/85">
                {language === "English"
                  ? "Find products, add them to your cart, checkout, pay and track your orders."
                  : language === "Afaan Oromo"
                  ? "Oomisha barbaadi, gaarii keessa galchi, checkout godhi, kaffali fi ajaja kee hordofi."
                  : "ምርቶችን ያግኙ፣ ወደ ጋሪ ያስገቡ፣ ይክፈሉ እና ትዕዛዞችዎን ይከታተሉ።"}
              </p>

              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-green-900 transition duration-200 hover:-translate-y-0.5 hover:bg-green-50"
              >
                {language === "English"
                  ? "Start Buying"
                  : language === "Afaan Oromo"
                  ? "Bittaa Jalqabi"
                  : "መግዛት ይጀምሩ"}
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-green-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-2xl">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-50 transition duration-500 group-hover:scale-125" />

            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                🌾
              </div>

              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
                SELL
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {text.sell}
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                {language === "English"
                  ? "List farm products, manage your inventory, receive orders and reach more customers."
                  : language === "Afaan Oromo"
                  ? "Oomisha qonnaa galchi, inventory kee bulchi, ajaja fudhadhu fi maamiltoota hedduu bira ga'i."
                  : "የእርሻ ምርቶችን ያስገቡ፣ እቃዎችዎን ያስተዳድሩ፣ ትዕዛዞችን ይቀበሉ እና ብዙ ደንበኞችን ያግኙ።"}
              </p>

              <Link
                href="/dashboard/add-product"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-extrabold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg"
              >
                {language === "English"
                  ? "Add Product"
                  : language === "Afaan Oromo"
                  ? "Oomisha Dabali"
                  : "ምርት ይጨምሩ"}
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-7 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-medium text-slate-500">
            One account. Buy, sell, order and manage your EFX journey.
          </p>

          <Link
            href="/"
            className="font-bold text-green-700 transition hover:text-green-900 hover:underline"
          >
            ← Back to Marketplace
          </Link>
        </div>
      </footer>
    </main>
  );
}