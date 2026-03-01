import React from "react";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, to: "/admin" },
  { label: "Products", icon: <Package size={18} />, to: "/admin/products" },
  { label: "Orders", icon: <ShoppingBag size={18} />, to: "/admin/orders" },
  { label: "Users", icon: <Users size={18} />, to: "/admin/users" },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[250px_1fr] gap-6">
        <aside className="bg-white rounded-2xl shadow-md p-4 h-fit">
          <h1 className="text-xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
