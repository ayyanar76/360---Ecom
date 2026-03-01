import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, setLoading } = useContext(AuthContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    setError("")
    setLoading(true)
    const res = await login(email,password)
    if(res?.success){
      navigate('/')
    } else {
      setError(res?.msg || "Invalid login credentials.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h2>
          <p className="text-gray-500 mt-2">Login to continue shopping with 360 Brand</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          {/* Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-orange-500" />
              Remember me
            </label>
            <a href="#" className="text-orange-600 hover:underline">Forgot Password?</a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-orange-700 transition duration-300 "
          >
           {loading ? "Logging in..." : "Login"}
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
          Don’t have an account? {" "}
          <Link to="/signup" className="text-orange-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
