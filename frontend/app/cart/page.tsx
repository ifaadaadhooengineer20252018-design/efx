"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  image?: string;
};

type Language = "English" | "Afaan Oromo" | "Amharic";

const translations: Record<Language, Record<string, string>> = {
  English: {
    shoppingCart: "Shopping Cart",
    emptyCart: "Your cart is empty.",
    price: "Price",
    subtotal: "Subtotal",
    remove: "Remove",
    total: "Total",
  },

  "Afaan Oromo": {
    shoppingCart: "Gaarii Bittaa",
    emptyCart: "Gaariin kee duwwaa dha.",
    price: "Gatii",
    subtotal: "Waliigala Xiqqaa",
    remove: "Haqi",
    total: "Waliigala",
  },

  Amharic: {
    shoppingCart: "የግዢ ጋሪ",
    emptyCart: "የግዢ ጋሪዎ ባዶ ነው።",
    price: "ዋጋ",
    subtotal: "ንዑስ ድምር",
    remove: "አስወግድ",
    total: "ጠቅላላ",
  },
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
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

        const updatedCart = parsedCart.map((item: any) => ({
          ...item,
          quantity:
            item.quantity && item.quantity > 0 ? item.quantity : 1,
        }));

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error reading cart:", error);
      }
    }
  }, []);

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;

          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const t = translations[language];

  return (
    <main
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>{t.shoppingCart}</h1>

      {cart.length === 0 ? (
        <p>{t.emptyCart}</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "10px",
              }}
            >
              <h2>{item.name}</h2>

              <p>
                {t.price}: {Number(item.price).toFixed(2)} ETB
                {item.unit ? ` / ${item.unit}` : ""}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  style={{
                    padding: "8px 14px",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  −
                </button>

                <span
                  style={{
                    minWidth: "30px",
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  style={{
                    padding: "8px 14px",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <p style={{ marginTop: "15px" }}>
                {t.subtotal}:{" "}
                <strong>
                  {(Number(item.price) * item.quantity).toFixed(2)} ETB
                </strong>
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  padding: "8px 14px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                {t.remove}
              </button>
            </div>
          ))}

          <div
            style={{
              borderTop: "2px solid #333",
              marginTop: "25px",
              paddingTop: "20px",
            }}
          >
            <h2>
              {t.total}: {total.toFixed(2)} ETB
            </h2>
          </div>
        </>
      )}
    </main>
  );
}
