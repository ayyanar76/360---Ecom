import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, setLoading } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await register(form.name, form.email, form.password);
    setLoading(false);
    if (res?.success) {
      navigate("/login");
      return;
    }
    setError(res?.msg || "Unable to create account.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account 🚀</h2>
          <p className="text-gray-500 mt-2">Join 360 Brand and start shopping smarter</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

        

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="accent-orange-600" />
            <span>I agree to the Terms & Conditions</span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-orange-700 transition duration-300"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

  

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? {" "}
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
