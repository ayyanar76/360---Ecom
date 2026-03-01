import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const statuses = ["pending", "Paid", "shipped", "delivered"];

const AdminOrders = () => {
  const api = import.meta.env.VITE_API_KEY;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/admin/orders`, { withCredentials: true });
      setOrders(res?.data?.orders || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError("");
    try {
      await axios.put(
        `${api}/admin/orders/${orderId}/status`,
        { status },
        { withCredentials: true }
      );
      await loadOrders();
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to update order status.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
      <div className="bg-white rounded-2xl shadow-md p-6">
        {error ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders available.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-xl p-4 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order?.user?.name || "User"} ({order?.user?.email || "N/A"})
                    </p>
                    <p className="text-xs text-gray-500">{order._id}</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    Total: ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="space-y-2">
                  {(order.items || []).map((item, idx) => (
                    <div key={`${order._id}-${idx}`} className="text-sm text-gray-600">
                      {item?.product?.name || "Product"} x {item.quantity}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    {statuses.map((status) => (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
