import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const roles = ["User", "admin"];

const AdminUsers = () => {
  const api = import.meta.env.VITE_API_KEY;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/admin/users`, { withCredentials: true });
      setUsers(res?.data?.users || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateRole = async (userId, role) => {
    setUpdatingId(userId);
    setError("");
    try {
      await axios.put(
        `${api}/admin/users/${userId}/role`,
        { role },
        { withCredentials: true }
      );
      await loadUsers();
    } catch (requestError) {
      setError(requestError?.response?.data?.msg || "Failed to update role.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      <div className="bg-white rounded-2xl shadow-md p-6">
        {error ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <select
                  value={user.role}
                  disabled={updatingId === user._id}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  {roles.map((role) => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
