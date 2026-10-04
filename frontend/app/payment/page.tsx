"use client";
import { useEffect, useState } from "react";

type Order = {
order_id?: number;
total_amount?: number;
total?: number;
phone?: string;
delivery_address?: string;
items?: any[];
};

type PaymentResponse = {
message?: string;
payment_id?: number;
order_id?: number;
amount?: number;
method?: string;
transaction_reference?: string;
status?: string;
detail?: string;
};

export default function PaymentPage() {
const [order, setOrder] = useState<Order | null>(null);
const [paymentMethod, setPaymentMethod] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [paymentSuccess, setPaymentSuccess] = useState(false);

useEffect(() => {
const savedOrder = localStorage.getItem("lastOrder");

if (savedOrder) {
  try {
    const parsedOrder = JSON.parse(savedOrder);
    setOrder(parsedOrder);
  } catch (error) {
    console.error("Error reading order:", error);
  }
}

}, []);

const total = Number(
order?.total_amount ?? order?.total ?? 0
);

const handlePayment = async () => {
setMessage("");
setPaymentSuccess(false);

if (!order?.order_id) {
  setMessage("Order information is missing.");
  return;
}

if (!paymentMethod) {
  setMessage("Please select a payment method.");
  return;
}

if (total <= 0) {
  setMessage("Invalid payment amount.");
  return;
}

setLoading(true);

const transactionReference = "EFX-" + Date.now();

try {
  const response = await fetch(
    "http://127.0.0.1:8000/payments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order.order_id,
        amount: total,
        method: paymentMethod,
        transaction_reference: transactionReference,
      }),
    }
  );

  const data: PaymentResponse = await response.json();

  if (!response.ok) {
    setMessage(
      data.detail || "Payment failed. Please try again."
    );
    setLoading(false);
    return;
  }

  const payment = {
    ...data,
    created_at: new Date().toISOString(),
  };

  localStorage.setItem(
    "lastPayment",
    JSON.stringify(payment)
  );

  setPaymentSuccess(true);

  setMessage(
    "Payment successful! Payment method: " +
      paymentMethod.toUpperCase()
  );

  setLoading(false);
} catch (error) {
  console.error("Payment error:", error);

  setMessage(
    "Could not connect to the payment server."
  );

  setLoading(false);
}

};

if (!order) {
return ( <main className="min-h-screen bg-green-50 px-6 py-12"> <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg"> <h1 className="text-3xl font-bold text-green-800">
Payment </h1>

      <p className="mt-4 text-gray-600">
        No recent order found.
      </p>
    </div>
  </main>
);

}

return ( <main className="min-h-screen bg-green-50 px-6 py-12"> <div className="mx-auto max-w-2xl"> <h1 className="mb-2 text-3xl font-bold text-green-800">
Payment </h1>
    <p className="mb-8 text-gray-600">
      Complete payment for your EFX order.
    </p>

    <div className="rounded-2xl bg-white p-8 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">
        Order Information
      </h2>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>
          <strong>Order ID:</strong>{" "}
          {order.order_id}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          {total.toFixed(2)} ETB
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {order.phone || "Not available"}
        </p>

        <p>
          <strong>Delivery Address:</strong>{" "}
          {order.delivery_address || "Not available"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800">
          Payment Method
        </h2>

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          disabled={paymentSuccess}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 disabled:bg-gray-100"
        >
          <option value="">
            Select payment method
          </option>

          <option value="telebirr">
            Telebirr
          </option>

          <option value="cbe">
            CBE
          </option>

          <option value="bank_transfer">
            Bank Transfer
          </option>
        </select>
      </div>

      {paymentMethod && (
        <div className="mt-6 rounded-lg bg-green-50 p-4">
          <p className="font-semibold text-green-800">
            Selected Payment Method
          </p>

          <p className="mt-1 text-gray-700">
            {paymentMethod === "telebirr" &&
              "Telebirr payment selected."}

            {paymentMethod === "cbe" &&
              "CBE payment selected."}

            {paymentMethod === "bank_transfer" &&
              "Bank Transfer selected."}
          </p>
        </div>
      )}

      {message && (
        <div
          className={`mt-6 rounded-lg p-4 ${
            paymentSuccess
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          <p
            className={`font-semibold ${
              paymentSuccess
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {message}
          </p>
        </div>
      )}

      {paymentSuccess && (
        <div className="mt-6 rounded-lg border border-green-200 bg-white p-4">
          <p className="font-semibold text-gray-800">
            Payment Details
          </p>

          <p className="mt-2 text-gray-600">
            Order ID: {order.order_id}
          </p>

          <p className="text-gray-600">
            Amount: {total.toFixed(2)} ETB
          </p>

          <p className="text-gray-600">
            Method: {paymentMethod.toUpperCase()}
          </p>

          <p className="text-green-700">
            Status: Paid
          </p>
        </div>
      )}

      {!paymentSuccess && (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Processing Payment..."
            : "Pay Now"}
        </button>
      )}
    </div>
  </div>
</main>

);
}