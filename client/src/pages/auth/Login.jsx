import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Mail, Lock } from "lucide-react";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

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

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "CommonAdmin") navigate("/common-admin/dashboard");
      else if (role === "NITAdmin") navigate("/nit-admin/dashboard");
      else if (role === "Coach") navigate("/coach/dashboard");
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
    <div className="bg-[#445cd5ff] min-h-screen flex flex-col items-center justify-center">
      <div className="min-w-sm lg:min-w-md">
        <div className="rounded-2xl border border-white/30 bg-white shadow-lg backdrop-blur-lg p-2">
          <div className="flex flex-col items-center justify-center gap-2 m-10 text-black-200">
            <Trophy className="font-bold" size={48} />
            <p className="font-bold text-3xl">INSMS</p>
            <p>Inter-NIT Sports Management System</p>
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg mx-4">
              {error}
            </div>
          )}

          <form className="p-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email_id" className="text-sm font-medium">
                {" "}
                Email Address{" "}
              </label>
              <div className="flex gap-4 rounded-lg border border-blue-200 bg-white/30 p-2 mt-2 mb-4 focus-within:ring-3 focus-within:ring-blue-500">
                <Mail />
                <input
                  type="email"
                  id="email_id"
                  placeholder="Enter your email"
                  className="w-full focus-visible:outline-none file:bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="pswd" className="text-sm font-medium">
                {" "}
                Password{" "}
              </label>
              <div className="flex gap-4 rounded-lg border border-blue-200 bg-white/30 p-2 mt-2 focus-within:ring-3 focus-within:ring-blue-500">
                <Lock />
                <input
                  id="pswd"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full focus-visible:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="text-white cursor-pointer w-full bg-[#3a90ffff] mt-8 p-2 border-[#70aafbff] rounded-lg hover:bg-[#0157c8ff] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}