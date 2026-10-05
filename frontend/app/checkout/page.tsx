"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
};

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<Language, Record<string, string>> = {
  English: {
    checkout: "Checkout",
    emptyCart: "Your cart is empty.",
    orderSummary: "Order Summary",
    total: "Total",
    deliveryInformation: "Delivery Information",
    phoneNumber: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    deliveryAddress: "Delivery Address",
    addressPlaceholder: "Enter your delivery address",
    placingOrder: "Placing Order...",
    placeOrder: "Place Order",
    cartEmptyMessage: "Your cart is empty.",
    enterAddress: "Please enter your delivery address.",
    enterPhone: "Please enter your phone number.",
    loginBeforeOrder: "Please login before placing an order.",
    failedOrder: "Failed to place order.",
    orderSuccess: "Order placed successfully! Order ID:",
    backendError: "Could not connect to the backend.",
  },

  "Afaan Oromo": {
    checkout: "Kaffaltii Xumuraa",
    emptyCart: "Gaariin kee duwwaa dha.",
    orderSummary: "Cuunfaa Ajajaa",
    total: "Waliigala",
    deliveryInformation: "Odeeffannoo Geejjibaa",
    phoneNumber: "Lakkoofsa Bilbilaa",
    phonePlaceholder: "Lakkoofsa bilbilaa kee galchi",
    deliveryAddress: "Teessoo Geejjibaa",
    addressPlaceholder: "Teessoo geejjibaa kee galchi",
    placingOrder: "Ajaja Ergaa Jira...",
    placeOrder: "Ajaja Galchi",
    cartEmptyMessage: "Gaariin kee duwwaa dha.",
    enterAddress: "Mee teessoo geejjibaa kee galchi.",
    enterPhone: "Mee lakkoofsa bilbilaa kee galchi.",
    loginBeforeOrder: "Mee ajaja galchuu dura seeni.",
    failedOrder: "Ajaja galchuun hin milkoofne.",
    orderSuccess: "Ajajni milkaa'inaan galmaa'eera! ID Ajajaa:",
    backendError: "Backend waliin wal qunnamuun hin danda'amne.",
  },

  Amharic: {
    checkout: "ክፍያ ማጠናቀቂያ",
    emptyCart: "የግዢ ጋሪዎ ባዶ ነው።",
    orderSummary: "የትዕዛዝ ማጠቃለያ",
    total: "ጠቅላላ",
    deliveryInformation: "የመላኪያ መረጃ",
    phoneNumber: "ስልክ ቁጥር",
    phonePlaceholder: "የስልክ ቁጥርዎን ያስገቡ",
    deliveryAddress: "የመላኪያ አድራሻ",
    addressPlaceholder: "የመላኪያ አድራሻዎን ያስገቡ",
    placingOrder: "ትዕዛዝ በመላክ ላይ...",
    placeOrder: "ትዕዛዝ ያስገቡ",
    cartEmptyMessage: "የግዢ ጋሪዎ ባዶ ነው።",
    enterAddress: "እባክዎ የመላኪያ አድራሻዎን ያስገቡ።",
    enterPhone: "እባክዎ የስልክ ቁጥርዎን ያስገቡ።",
    loginBeforeOrder: "ትዕዛዝ ከማስገባትዎ በፊት እባክዎ ይግቡ።",
    failedOrder: "ትዕዛዙን ማስገባት አልተሳካም።",
    orderSuccess: "ትዕዛዙ በተሳካ ሁኔታ ተላክ! የትዕዛዝ ID:",
    backendError: "ከBackend ጋር መገናኘት አልተቻለም።",
  },
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error reading cart:", error);
      }
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const t = translations[language];

  const handlePlaceOrder = async () => {
    setMessage("");

    if (cart.length === 0) {
      setMessage(t.cartEmptyMessage);
      return;
    }

    if (!address.trim()) {
      setMessage(t.enterAddress);
      return;
    }

    if (!phone.trim()) {
      setMessage(t.enterPhone);
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token");

    if (!token) {
      setMessage(t.loginBeforeOrder);
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        delivery_address: address,
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: String(item.quantity),
        })),
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || t.failedOrder);
        setLoading(false);
        return;
      }

      const order = {
        ...data,
        phone: phone,
        items: cart,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem("lastOrder", JSON.stringify(order));

      localStorage.removeItem("cart");

      setCart([]);
      setLoading(false);

      setMessage(`${t.orderSuccess} ${data.order_id}`);
    } catch (error) {
      console.error("Order error:", error);

      setLoading(false);
      setMessage(t.backendError);
    }
  };

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>{t.checkout}</h1>

      {cart.length === 0 ? (
        <div>
          <p>{t.emptyCart}</p>

          {message && (
            <p
              style={{
                marginTop: "15px",
                fontWeight: "bold",
              }}
            >
              {message}
            </p>
          )}
        </div>
      ) : (
        <>
          <section
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <h2>{t.orderSummary}</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <strong>
                  {(Number(item.price) * item.quantity).toFixed(2)} ETB
                </strong>
              </div>
            ))}

            <h2 style={{ marginTop: "20px" }}>
              {t.total}: {total.toFixed(2)} ETB
            </h2>
          </section>

          <section
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <h2>{t.deliveryInformation}</h2>

            <div style={{ marginTop: "15px" }}>
              <label>{t.phoneNumber}</label>

              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginTop: "15px" }}>
              <label>{t.deliveryAddress}</label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.addressPlaceholder}
                rows={4}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {message && (
              <p
                style={{
                  marginTop: "15px",
                  fontWeight: "bold",
                }}
              >
                {message}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? t.placingOrder : t.placeOrder}
            </button>
          </section>
        </>
      )}
    </main>
  );
}