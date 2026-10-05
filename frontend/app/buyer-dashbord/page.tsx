"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  unit: string;
  location?: string;
  status?: string;
};

type Order = {
  id: number;
  buyer_id?: number;
  total_amount?: number;
  status?: string;
  created_at?: string;
};

type Delivery = {
  delivery_id: number;
  order_id: number;
  driver_id: number;
  pickup_location?: string;
  delivery_location?: string;
  status: string;
  created_at?: string;
  delivered_at?: string;
};

const deliverySteps = [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
];

const statusLabels: Record<string, Record<string, string>> = {
  pending: {
    English: "Pending",
    "Afaan Oromo": "Eegamaa jira",
    Amharic: "በመጠባበቅ ላይ",
  },
  assigned: {
    English: "Assigned",
    "Afaan Oromo": "Konkolaachisaa ramadame",
    Amharic: "አሽከርካሪ ተመድቧል",
  },
  picked_up: {
    English: "Picked Up",
    "Afaan Oromo": "Fudhatameera",
    Amharic: "ተነስቷል",
  },
  in_transit: {
    English: "In Transit",
    "Afaan Oromo": "Daandii irra jira",
    Amharic: "በመጓጓዝ ላይ",
  },
  delivered: {
    English: "Delivered",
    "Afaan Oromo": "Geessifameera",
    Amharic: "ደርሷል",
  },
};

export default function BuyerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveries, setDeliveries] = useState<
    Record<number, Delivery | null>
  >({});

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);

  const [orderError, setOrderError] = useState("");
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

  useEffect(() => {
    // =========================
    // LOAD PRODUCTS
    // =========================
    fetch(`${API_URL}/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        setLoadingProducts(false);
      });

    // =========================
    // GET LOGIN TOKEN
    // =========================
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setOrderError(
        language === "English"
          ? "Please login to view your orders."
          : language === "Afaan Oromo"
          ? "Ajajawwan kee ilaaluuf maaloo seeni."
          : "ትዕዛዞችዎን ለማየት እባክዎ ይግቡ።"
      );

      setLoadingOrders(false);
      return;
    }

    // =========================
    // LOAD ORDERS
    // =========================
    fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        return response.json();
      })
      .then(async (data) => {
        const orderList: Order[] = Array.isArray(data) ? data : [];

        setOrders(orderList);
        setLoadingOrders(false);

        // =========================
        // LOAD DELIVERY FOR ORDERS
        // =========================
        setLoadingDeliveries(true);

        const deliveryResults = await Promise.all(
          orderList.map(async (order) => {
            try {
              const response = await fetch(
                `${API_URL}/deliveries/order/${order.id}`
              );

              if (response.status === 404) {
                return [order.id, null] as const;
              }

              if (!response.ok) {
                throw new Error(
                  `Delivery request failed for order ${order.id}`
                );
              }

              const delivery: Delivery = await response.json();

              return [order.id, delivery] as const;
            } catch (error) {
              console.error(
                `Error loading delivery for order ${order.id}:`,
                error
              );

              return [order.id, null] as const;
            }
          })
        );

        setDeliveries(Object.fromEntries(deliveryResults));
        setLoadingDeliveries(false);
      })
      .catch((error) => {
        console.error("Error loading orders:", error);

        setOrderError(
          language === "English"
            ? "Unable to load orders."
            : language === "Afaan Oromo"
            ? "Ajajawwan fe'uu hin dandeenye."
            : "ትዕዛዞችን መጫን አልተቻለም።"
        );

        setLoadingOrders(false);
        setLoadingDeliveries(false);
      });
  }, []);

  const getStatusLabel = (status: string) => {
    return (
      statusLabels[status]?.[language] ||
      statusLabels[status]?.English ||
      status
    );
  };

  return (
    <main className="min-h-screen bg-green-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            {language === "English"
              ? "Buyer Dashboard"
              : language === "Afaan Oromo"
              ? "Daashboordii Bitataa"
              : "የገዢ ዳሽቦርድ"}
          </h1>

          <p className="mt-2 text-gray-600">
            {language === "English"
              ? "Welcome to EFX Ethiopia Farm Exchange."
              : language === "Afaan Oromo"
              ? "Baga gara EFX Ethiopia Farm Exchange dhuftan."
              : "ወደ EFX Ethiopia Farm Exchange እንኳን በደህና መጡ።"}
          </p>
        </div>

        {/* =========================
            DASHBOARD CARDS
        ========================= */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">

          <Link
            href="/products"
            className="rounded-2xl bg-white p-6 shadow-lg transition hover:bg-green-50"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {language === "English"
                ? "Browse Products"
                : language === "Afaan Oromo"
                ? "Oomishaalee Ilaali"
                : "ምርቶችን ይመልከቱ"}
            </h2>

            <p className="text-gray-600">
              {language === "English"
                ? "Find fresh farm products from farmers."
                : language === "Afaan Oromo"
                ? "Oomishaalee qonnaa haaraa qonnaan bultoota irraa argadhu."
                : "ትኩስ የእርሻ ምርቶችን ከገበሬዎች ያግኙ።"}
            </p>

            <p className="mt-4 font-semibold text-green-700">
              {language === "English"
                ? "Browse Products →"
                : language === "Afaan Oromo"
                ? "Oomishaalee Ilaali →"
                : "ምርቶችን ይመልከቱ →"}
            </p>
          </Link>

          <Link
            href="/cart"
            className="rounded-2xl bg-white p-6 shadow-lg transition hover:bg-green-50"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {language === "English"
                ? "My Cart"
                : language === "Afaan Oromo"
                ? "Gaarii Koo"
                : "የእኔ ጋሪ"}
            </h2>

            <p className="text-gray-600">
              {language === "English"
                ? "View products you added to your cart."
                : language === "Afaan Oromo"
                ? "Oomishaalee gaarii keetti dabalte ilaali."
                : "ወደ ጋሪዎ ያከሏቸውን ምርቶች ይመልከቱ።"}
            </p>

            <p className="mt-4 font-semibold text-green-700">
              {language === "English"
                ? "Open Cart →"
                : language === "Afaan Oromo"
                ? "Gaarii Bani →"
                : "ጋሪን ክፈት →"}
            </p>
          </Link>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {language === "English"
                ? "My Orders"
                : language === "Afaan Oromo"
                ? "Ajajawwan Koo"
                : "የእኔ ትዕዛዞች"}
            </h2>

            <p className="text-gray-600">
              {language === "English"
                ? "View and manage your orders."
                : language === "Afaan Oromo"
                ? "Ajajawwan kee ilaalii fi bulchi."
                : "ትዕዛዞችዎን ይመልከቱ እና ያስተዳድሩ።"}
            </p>

            <p className="mt-4 text-2xl font-bold text-green-700">
              {loadingOrders ? "..." : orders.length}
            </p>

            <p className="text-sm text-gray-500">
              {language === "English"
                ? "Total Orders"
                : language === "Afaan Oromo"
                ? "Waliigala Ajajawwan"
                : "ጠቅላላ ትዕዛዞች"}
            </p>
          </div>
        </div>

        {/* =========================
            MY ORDERS
        ========================= */}
        <div className="mb-10">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-green-800">
              {language === "English"
                ? "My Orders"
                : language === "Afaan Oromo"
                ? "Ajajawwan Koo"
                : "የእኔ ትዕዛዞች"}
            </h2>
          </div>

          {loadingOrders && (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-600">
                {language === "English"
                  ? "Loading orders..."
                  : language === "Afaan Oromo"
                  ? "Ajajawwan fe'aa jira..."
                  : "ትዕዛዞችን በመጫን ላይ..."}
              </p>
            </div>
          )}

          {!loadingOrders && orderError && (
            <div className="rounded-xl bg-white p-6 shadow">
              <p className="text-gray-600">
                {orderError}
              </p>

              <Link
                href="/login"
                className="mt-4 inline-block rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
              >
                {language === "English"
                  ? "Login"
                  : language === "Afaan Oromo"
                  ? "Seeni"
                  : "ግባ"}
              </Link>
            </div>
          )}

          {!loadingOrders &&
            !orderError &&
            orders.length === 0 && (
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-gray-600">
                  {language === "English"
                    ? "You have no orders yet."
                    : language === "Afaan Oromo"
                    ? "Ammaaf ajaja hin qabdu."
                    : "እስካሁን ምንም ትዕዛዝ የለዎትም።"}
                </p>

                <Link
                  href="/products"
                  className="mt-4 inline-block rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
                >
                  {language === "English"
                    ? "Browse Products"
                    : language === "Afaan Oromo"
                    ? "Oomishaalee Ilaali"
                    : "ምርቶችን ይመልከቱ"}
                </Link>
              </div>
            )}

          {!loadingOrders &&
            !orderError &&
            orders.length > 0 && (
              <div className="space-y-6">

                {orders.map((order) => {
                  const delivery = deliveries[order.id];

                  const currentIndex = delivery
                    ? deliverySteps.indexOf(delivery.status)
                    : -1;

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-white p-6 shadow-lg"
                    >

                      {/* ORDER INFORMATION */}
                      <div className="flex flex-col justify-between gap-4 md:flex-row">

                        <div>
                          <h3 className="text-lg font-bold text-green-800">
                            {language === "English"
                              ? `Order #${order.id}`
                              : language === "Afaan Oromo"
                              ? `Ajaja #${order.id}`
                              : `ትዕዛዝ #${order.id}`}
                          </h3>

                          <p className="mt-1 text-gray-600">
                            {language === "English"
                              ? "Status:"
                              : language === "Afaan Oromo"
                              ? "Haala:"
                              : "ሁኔታ:"}{" "}
                            <span className="font-semibold text-green-700">
                              {order.status
                                ? getStatusLabel(order.status)
                                : getStatusLabel("pending")}
                            </span>
                          </p>

                          {order.created_at && (
                            <p className="text-sm text-gray-500">
                              {language === "English"
                                ? "Date:"
                                : language === "Afaan Oromo"
                                ? "Guyyaa:"
                                : "ቀን:"}{" "}
                              {new Date(
                                order.created_at
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>

                        {order.total_amount !== undefined && (
                          <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500">
                              {language === "English"
                                ? "Total"
                                : language === "Afaan Oromo"
                                ? "Waliigala"
                                : "ጠቅላላ"}
                            </p>

                            <p className="text-xl font-bold text-green-700">
                              {order.total_amount} ETB
                            </p>
                          </div>
                        )}
                      </div>

                      {/* =========================
                          DELIVERY TRACKING
                      ========================= */}
                      <div className="mt-6 border-t pt-6">

                        <h4 className="mb-4 text-lg font-bold text-green-800">
                          🚚{" "}
                          {language === "English"
                            ? "Delivery Tracking"
                            : language === "Afaan Oromo"
                            ? "Hordoffii Geejjibaa"
                            : "የመላኪያ ክትትል"}
                        </h4>

                        {loadingDeliveries && (
                          <p className="text-gray-500">
                            {language === "English"
                              ? "Loading delivery information..."
                              : language === "Afaan Oromo"
                              ? "Odeeffannoo geejjibaa fe'aa jira..."
                              : "የመላኪያ መረጃን በመጫን ላይ..."}
                          </p>
                        )}

                        {!loadingDeliveries && delivery === null && (
                          <div className="rounded-lg bg-gray-50 p-4">
                            <p className="font-semibold text-gray-700">
                              {language === "English"
                                ? "No delivery assigned yet."
                                : language === "Afaan Oromo"
                                ? "Ammaaf geejjibni hin ramadamne."
                                : "እስካሁን ምንም መላኪያ አልተመደበም።"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {language === "English"
                                ? "Delivery information will appear here when a driver is assigned."
                                : language === "Afaan Oromo"
                                ? "Yeroo konkolaachisaan ramadamutti odeeffannoon geejjibaa asitti mul'ata."
                                : "አሽከርካሪ ሲመደብ የመላኪያ መረጃ እዚህ ይታያል።"}
                            </p>
                          </div>
                        )}

                        {!loadingDeliveries && delivery && (
                          <div>

                            {/* DELIVERY STATUS */}
                            <div className="mb-5 rounded-lg bg-green-50 p-4">
                              <p className="text-sm text-gray-500">
                                {language === "English"
                                  ? "Current Delivery Status"
                                  : language === "Afaan Oromo"
                                  ? "Haala Geejjibaa Ammaa"
                                  : "የአሁኑ የመላኪያ ሁኔታ"}
                              </p>

                              <p className="mt-1 text-xl font-bold text-green-700">
                                {getStatusLabel(delivery.status)}
                              </p>
                            </div>

                            {/* DELIVERY DETAILS */}
                            <div className="grid gap-4 md:grid-cols-3">

                              <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                  {language === "English"
                                    ? "Driver"
                                    : language === "Afaan Oromo"
                                    ? "Konkolaachisaa"
                                    : "አሽከርካሪ"}
                                </p>

                                <p className="font-bold text-gray-800">
                                  {language === "English"
                                    ? `Driver #${delivery.driver_id}`
                                    : language === "Afaan Oromo"
                                    ? `Konkolaachisaa #${delivery.driver_id}`
                                    : `አሽከርካሪ #${delivery.driver_id}`}
                                </p>
                              </div>

                              <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                  {language === "English"
                                    ? "Pickup"
                                    : language === "Afaan Oromo"
                                    ? "Iddoo Fudhannaa"
                                    : "መነሻ ቦታ"}
                                </p>

                                <p className="font-bold text-gray-800">
                                  {delivery.pickup_location ||
                                    (language === "English"
                                      ? "Not specified"
                                      : language === "Afaan Oromo"
                                      ? "Hin ibsamne"
                                      : "አልተገለጸም")}
                                </p>
                              </div>

                              <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                  {language === "English"
                                    ? "Destination"
                                    : language === "Afaan Oromo"
                                    ? "Bakka Geessisaa"
                                    : "መድረሻ"}
                                </p>

                                <p className="font-bold text-gray-800">
                                  {delivery.delivery_location ||
                                    (language === "English"
                                      ? "Not specified"
                                      : language === "Afaan Oromo"
                                      ? "Hin ibsamne"
                                      : "አልተገለጸም")}
                                </p>
                              </div>

                            </div>

                            {/* DELIVERY PROGRESS */}
                            <div className="mt-6">

                              <p className="mb-3 text-sm font-semibold text-gray-700">
                                {language === "English"
                                  ? "Delivery Progress"
                                  : language === "Afaan Oromo"
                                  ? "Adeemsa Geejjibaa"
                                  : "የመላኪያ ሂደት"}
                              </p>

                              <div className="flex items-center justify-between">

                                {deliverySteps.map(
                                  (step, index) => {
                                    const completed =
                                      index <= currentIndex;

                                    return (
                                      <div
                                        key={step}
                                        className="flex flex-1 items-center"
                                      >

                                        <div className="flex flex-col items-center">

                                          <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                              completed
                                                ? "bg-green-700 text-white"
                                                : "bg-gray-200 text-gray-500"
                                            }`}
                                          >
                                            {index + 1}
                                          </div>

                                          <span className="mt-2 text-center text-xs text-gray-600">
                                            {getStatusLabel(step)}
                                          </span>

                                        </div>

                                        {index <
                                          deliverySteps.length -
                                            1 && (
                                          <div
                                            className={`mx-2 h-1 flex-1 ${
                                              index < currentIndex
                                                ? "bg-green-700"
                                                : "bg-gray-200"
                                            }`}
                                          />
                                        )}

                                      </div>
                                    );
                                  }
                                )}

                              </div>
                            </div>

                            {/* DELIVERED TIME */}
                            {delivery.delivered_at && (
                              <p className="mt-5 text-sm text-gray-500">
                                {language === "English"
                                  ? "Delivered:"
                                  : language === "Afaan Oromo"
                                  ? "Geessifame:"
                                  : "የደረሰበት ጊዜ:"}{" "}
                                {new Date(
                                  delivery.delivered_at
                                ).toLocaleString()}
                              </p>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}

              </div>
            )}
        </div>

        {/* =========================
            AVAILABLE PRODUCTS
        ========================= */}
        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-green-800">
            {language === "English"
              ? "Available Products"
              : language === "Afaan Oromo"
              ? "Oomishaalee Jiran"
              : "የሚገኙ ምርቶች"}
          </h2>

          <Link
            href="/products"
            className="font-semibold text-green-700 hover:underline"
          >
            {language === "English"
              ? "View All →"
              : language === "Afaan Oromo"
              ? "Hunda Ilaali →"
              : "ሁሉንም ይመልከቱ →"}
          </Link>

        </div>

        {loadingProducts && (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-600">
              {language === "English"
                ? "Loading products..."
                : language === "Afaan Oromo"
                ? "Oomishaalee fe'aa jira..."
                : "ምርቶችን በመጫን ላይ..."}
            </p>
          </div>
        )}

        {!loadingProducts && products.length === 0 && (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-600">
              {language === "English"
                ? "No products available."
                : language === "Afaan Oromo"
                ? "Oomishni hin jiru."
                : "ምንም ምርት የለም።"}
            </p>
          </div>
        )}

        {!loadingProducts && products.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-6 shadow-lg"
              >

                <h3 className="text-xl font-bold text-green-800">
                  {product.name}
                </h3>

                <p className="mt-2 text-gray-600">
                  {product.description ||
                    (language === "English"
                      ? "Fresh farm product"
                      : language === "Afaan Oromo"
                      ? "Oomisha qonnaa haaraa"
                      : "ትኩስ የእርሻ ምርት")}
                </p>

                <p className="mt-4 text-lg font-bold text-green-700">
                  {product.price} ETB / {product.unit}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {language === "English"
                    ? "Available:"
                    : language === "Afaan Oromo"
                    ? "Jira:"
                    : "የሚገኝ:"}{" "}
                  {product.quantity} {product.unit}
                </p>

                <p className="text-sm text-gray-500">
                  {language === "English"
                    ? "Location:"
                    : language === "Afaan Oromo"
                    ? "Bakka:"
                    : "ቦታ:"}{" "}
                  {product.location ||
                    (language === "English"
                      ? "Ethiopia"
                      : language === "Afaan Oromo"
                      ? "Itoophiyaa"
                      : "ኢትዮጵያ")}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {language === "English"
                    ? "Status:"
                    : language === "Afaan Oromo"
                    ? "Haala:"
                    : "ሁኔታ:"}{" "}
                  {product.status ||
                    (language === "English"
                      ? "available"
                      : language === "Afaan Oromo"
                      ? "jira"
                      : "ይገኛል")}
                </p>

                <Link
                  href={`/products/${product.id}`}
                  className="mt-4 block rounded-lg bg-green-700 px-4 py-2 text-center font-semibold text-white hover:bg-green-800"
                >
                  {language === "English"
                    ? "View Product"
                    : language === "Afaan Oromo"
                    ? "Oomisha Ilaali"
                    : "ምርቱን ይመልከቱ"}
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}