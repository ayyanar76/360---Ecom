import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const role = user?.getMe?.role?.toLowerCase?.() || "";

  if (!user?.getMe) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500 mt-2">
            You need admin privileges to access this section.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
