import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
// import Button from "../../components/Button";

export default function Login() {
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/users/login", { email, password });
      const { token, role } = res.data;
    
      console.log("login successful!");
      
      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "CommonAdmin") navigate("/dashboard/common");
      else if (role === "NITAdmin") navigate("/dashboard/nit");
      else if (role === "Coach") navigate("/dashboard/coach");
      else navigate("/");

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          Inter-NIT Sports Login
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Inter-NIT Sports Management System
        </p>
      </div>
    </div>
  );
}
