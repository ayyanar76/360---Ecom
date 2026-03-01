import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PENDING_CHECKOUT_KEY = "pending_checkout";
const PROCESSED_SESSIONS_KEY = "processed_stripe_sessions";
const CART_STORAGE_KEY = "shop_cart_items";
const isMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const PaymentSuccess = () => {
  const api = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderSaved, setOrderSaved] = useState(false);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);

  const amountPaid = useMemo(() => checkoutData?.total || 0, [checkoutData]);

  useEffect(() => {
    const completeSuccessFlow = async () => {
      if (!sessionId) {
        setError("Missing Stripe session id.");
        setLoading(false);
        return;
      }

      let pendingCheckout = null;
      try {
        pendingCheckout = JSON.parse(localStorage.getItem(PENDING_CHECKOUT_KEY) || "null");
      } catch (parseError) {
        console.error("Invalid pending checkout data:", parseError);
      }
      setCheckoutData(pendingCheckout);

      let processedSessions = [];
      try {
        processedSessions = JSON.parse(localStorage.getItem(PROCESSED_SESSIONS_KEY) || "[]");
      } catch {
        processedSessions = [];
      }

      if (processedSessions.includes(sessionId)) {
        setOrderSaved(true);
        setLoading(false);
        return;
      }

      if (!pendingCheckout?.items?.length) {
        setError("Payment was successful, but no checkout context was found.");
        setLoading(false);
        return;
      }

      try {
        await axios.post(
          `${api}/order`,
          {
            items: pendingCheckout.items.map((item) => ({
              ...(isMongoId(item.product) ? { product: item.product } : {}),
              quantity: item.quantity,
            })),
            total: pendingCheckout.total,
            stripePaymentId: sessionId,
          },
          { withCredentials: true }
        );

        const nextProcessed = [...processedSessions, sessionId];
        localStorage.setItem(PROCESSED_SESSIONS_KEY, JSON.stringify(nextProcessed));
        localStorage.removeItem(PENDING_CHECKOUT_KEY);
        if (pendingCheckout.source === "cart") {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
        setOrderSaved(true);
      } catch (requestError) {
        console.error("Failed to save order:", requestError);
        setError("Payment successful, but order save failed. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    completeSuccessFlow();
  }, [api, sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 text-center">
        {loading ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900">Processing payment...</h1>
            <p className="text-gray-500 mt-3">
              We are confirming your payment and creating your order.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-600">Payment Successful</h1>
            <p className="text-gray-600 mt-3">
              {orderSaved
                ? "Your order has been placed successfully."
                : "Your payment is completed."}
            </p>

            <div className="mt-8 border rounded-xl p-5 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Stripe Session</span>
                <span className="font-medium text-gray-800">{sessionId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-semibold text-gray-900">{formatPrice(amountPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order Status</span>
                <span
                  className={`font-medium ${
                    orderSaved ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {orderSaved ? "Confirmed" : "Pending confirmation"}
                </span>
              </div>
            </div>

            {error ? <p className="text-red-500 text-sm mt-4">{error}</p> : null}

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate("/")}
                className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
