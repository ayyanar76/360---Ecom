import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const THEME_STORAGE_KEY = "profile_dark_mode";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, fetchUser, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(THEME_STORAGE_KEY) === "true";
  });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, String(isDarkMode));
  }, [isDarkMode]);

  const profile = user?.getMe;
  const orderCount = useMemo(() => user?.product?.length || 0, [user]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Profile not available</h1>
          <p className="text-gray-500 mt-2">Please login to view your profile.</p>
          <button
            className="mt-5 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const pageClass = isDarkMode
    ? "min-h-screen bg-gray-950 text-gray-100 py-10 px-4"
    : "min-h-screen bg-gray-50 text-gray-900 py-10 px-4";

  const cardClass = isDarkMode
    ? "bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8"
    : "bg-white border border-gray-100 rounded-2xl shadow-md p-8";

  const mutedTextClass = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={pageClass}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex items-center gap-3">
            <span className={mutedTextClass}>Dark Mode</span>
            <button
              className={`w-14 h-8 rounded-full transition relative ${
                isDarkMode ? "bg-orange-500" : "bg-gray-300"
              }`}
              onClick={() => setIsDarkMode((prev) => !prev)}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                  isDarkMode ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-gray-200/20">
            <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">
              {profile?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className={mutedTextClass}>{profile.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div className={`rounded-xl p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={mutedTextClass}>Orders</p>
              <p className="text-2xl font-bold mt-1">{orderCount}</p>
            </div>
            <div className={`rounded-xl p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={mutedTextClass}>Role</p>
              <p className="text-2xl font-bold mt-1 capitalize">{profile.role || "user"}</p>
            </div>
            <div className={`rounded-xl p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
              <p className={mutedTextClass}>Status</p>
              <p className="text-2xl font-bold mt-1 text-green-500">Active</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              onClick={() => navigate("/orders")}
            >
              View Orders
            </button>
            <button
              className={`px-6 py-2 rounded-lg transition ${
                isDarkMode
                  ? "border border-red-500 text-red-400 hover:bg-red-500/10"
                  : "border border-red-500 text-red-500 hover:bg-red-50"
              }`}
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
