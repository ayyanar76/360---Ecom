import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const CART_STORAGE_KEY = "shop_cart_items";
const PENDING_CHECKOUT_KEY = "pending_checkout";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const readCartFromStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read cart from storage:", error);
    return [];
  }
};

const writeCartToStorage = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const Cart = () => {
  const api = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setCartItems(readCartFromStorage());
  }, []);

  const updateCart = (updater) => {
    setCartItems((prev) => {
      const next = updater(prev);
      writeCartToStorage(next);
      return next;
    });
  };

  const incrementQuantity = (id) => {
    updateCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    updateCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    updateCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    updateCart(() => []);
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const discount = subtotal >= 3000 ? 300 : 0;
  const total = subtotal + shipping - discount;

  const handleStripeCheckout = async () => {
    if (cartItems.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      const pendingCheckout = {
        source: "cart",
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: Number(item.quantity) || 1,
          name: item.name,
          price: Number(item.price) || 0,
          image_url: item.image,
        })),
        total,
      };
      localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pendingCheckout));

      const payload = {
        cart: cartItems.map((item) => ({
          name: item.name,
          image_url: item.image,
          price: Number(item.price) || 0,
          qty: Number(item.quantity) || 1,
        })),
      };

      const response = await axios.post(`${api}/checkout`, payload, {
        withCredentials: true,
      });

      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }
      alert("Unable to start checkout. Please try again.");
    } catch (error) {
      console.error("Cart checkout failed:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛒 Your Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">
                  Add products to your cart to continue checkout.
                </p>
                <button
                  className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition duration-300"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/120"}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {item.description || "No description available."}
                    </p>
                    <p className="text-orange-600 font-bold mt-2">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded-lg"
                      onClick={() => decrementQuantity(item.id)}
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded-lg"
                      onClick={() => incrementQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

            <div className="space-y-4 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-red-500">-{formatPrice(discount)}</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              disabled={cartItems.length === 0 || isCheckingOut}
              onClick={handleStripeCheckout}
              className="w-full mt-6 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Redirecting..." : "Proceed to Checkout"}
            </button>
            {cartItems.length > 0 && (
              <button
                className="w-full mt-3 border border-red-500 text-red-500 py-2 rounded-xl font-semibold hover:bg-red-50 transition duration-300"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
