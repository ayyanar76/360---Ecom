import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const AdminDashboard = () => {
  const api = import.meta.env.VITE_API_KEY;
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadDashboard = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${api}/allproducts`, { withCredentials: true }),
          axios.get(`${api}/admin/orders`, { withCredentials: true }),
        ]);
        if (!mounted) return;
        setProducts(productsRes?.data?.msg || []);
        setOrders(ordersRes?.data?.orders || []);
      } catch (requestError) {
        if (!mounted) return;
        setError(requestError?.response?.data?.msg || "Failed to load admin dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadDashboard();
    return () => {
      mounted = false;
    };
  }, [api]);

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const lowStock = products.filter((product) => Number(product.stock || 0) <= 5).length;
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      lowStock,
    };
  }, [orders, products]);

  if (loading) {
    return <div className="bg-white rounded-2xl shadow-md p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="bg-white rounded-2xl shadow-md p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-3xl font-bold mt-2">{metrics.totalProducts}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-3xl font-bold mt-2">{metrics.totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold mt-2">₹{metrics.totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-3xl font-bold mt-2">{metrics.pendingOrders}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-5">
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="text-3xl font-bold mt-2">{metrics.lowStock}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders available.</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-medium text-gray-900">{order?.user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{order._id}</p>
                </div>
                <div className="text-sm text-gray-600">₹{Number(order.total || 0).toLocaleString("en-IN")}</div>
                <span className="text-xs bg-gray-100 rounded-full px-3 py-1 w-fit">{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
