import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const statusStyleMap = {
  Paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  snipped: "bg-blue-100 text-blue-700",
  delivered: "bg-purple-100 text-purple-700",
};

const Order = () => {
  const api = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${api}/myorders`, { withCredentials: true });
        setOrders(res?.data?.orders || []);
      } catch (requestError) {
        const errorMessage =
          requestError?.response?.data?.msg || "Failed to load your orders.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [api]);

  const orderCount = useMemo(() => orders.length, [orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
          <div className="bg-white rounded-2xl shadow-md p-8 text-gray-500">
            Loading your orders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <p className="text-red-500">{error}</p>
            <div className="mt-6 flex gap-3">
              <button
                className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="border border-orange-600 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-50 transition"
                onClick={() => navigate("/")}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <span className="text-sm text-gray-500">
            {orderCount} {orderCount === 1 ? "order" : "orders"}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">No orders yet</h2>
            <p className="text-gray-500 mt-2">Place your first order to see it here.</p>
            <button
              className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-800 break-all">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Placed On</p>
                    <p className="font-medium text-gray-700">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN")
                        : "N/A"}
                    </p>
                  </div>
                  <span
                    className={`w-fit px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyleMap[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status || "pending"}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${item?.product?._id || "item"}-${index}`}
                      className="flex items-center justify-between gap-4 border rounded-xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item?.product?.image_url || "https://via.placeholder.com/80"}
                          alt={item?.product?.name || "Product"}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {item?.product?.name || "Product removed"}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item?.quantity || 1}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        {formatPrice((item?.product?.price || 0) * (item?.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm text-gray-500">
                    Stripe Payment ID: {order.stripePaymentId || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    Total: {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
