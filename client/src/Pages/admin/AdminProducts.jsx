import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image_url: "",
};

const AdminProducts = () => {
  const api = import.meta.env.VITE_API_KEY;
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/allproducts`, { withCredentials: true });
      setProducts(res?.data?.msg || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "",
      stock: String(product.stock ?? ""),
      image_url: product.image_url || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError("Name and price are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock || 0),
      };

      if (editingId) {
        await axios.put(`${api}/admin/product/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post(`${api}/addproduct`, payload, { withCredentials: true });
      }

      resetForm();
      await loadProducts();
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/admin/product/${id}`, { withCredentials: true });
      await loadProducts();
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Product name"
          />
          <input
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Category"
          />
          <input
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Price"
            type="number"
            min="0"
          />
          <input
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Stock"
            type="number"
            min="0"
          />
          <input
            value={form.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            className="border rounded-lg px-3 py-2 sm:col-span-2"
            placeholder="Image URL"
          />
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="border rounded-lg px-3 py-2 sm:col-span-2"
            rows={3}
            placeholder="Description"
          />
          {error ? <p className="text-sm text-red-500 sm:col-span-2">{error}</p> : null}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="border px-4 py-2 rounded-lg text-gray-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">All Products</h3>
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image_url || "https://via.placeholder.com/80"}
                    alt={product.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.category} | ₹{Number(product.price || 0).toLocaleString("en-IN")} | Stock:{" "}
                      {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border rounded-lg text-sm"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 border border-red-500 text-red-500 rounded-lg text-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
