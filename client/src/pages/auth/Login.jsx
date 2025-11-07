import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Mail, Lock, User, Building, Phone, MapPin, Code, Shield, Trophy, } from "lucide-react";

function InputField({ icon, label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
}

function ButtonToggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${active
        ? "bg-white text-blue-700 shadow-md"
        : "bg-blue-500/20 border border-white/20 text-white hover:bg-blue-500/30"
        }
        cursor-pointer`}
    >
      {label}
    </button>
  );
}

function LoginForm({ email, setEmail, password, setPassword, handleSubmit, loading }) {
  return (
    <div className="p-8 md:p-12 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-8">
        Sign in to continue to the Inter-NIT Sports System
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField icon={<Mail />} name="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
        <InputField icon={<Lock />} name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed cursor-pointer" disabled={loading}>
          {loading ? "Logging in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function RegisterUserForm({ formData, setFormData, handleSubmit }) {
  const dummyNITs = ["NIT Delhi", "NIT Trichy", "NIT Warangal", "NIT Surathkal", "NIT Calicut",];

  return (
    <div className="p-8 md:p-12 flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p className="text-gray-500 mb-8">Join the Inter-NIT Sports Network</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField icon={<User />} name="name" label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
        <InputField icon={<Mail />} name="email" label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your.email@example.com" />
        <InputField icon={<Phone />} name="phone" label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 99999 99999" />
        <InputField icon={<Lock />} name="password" label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Create a strong password" />

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
            >
              <option value="Coach">Coach</option>
              <option value="NITAdmin">NIT Admin</option>
            </select>
          </div>
        </div>

        {/* Select NIT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select NIT</label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="nit_id"
              value={formData.nit_id}
              onChange={(e) => setFormData({ ...formData, nit_id: e.target.value })}
              required
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
            >
              <option value="">Choose your NIT</option>
              {dummyNITs.map((nit) => (
                <option key={nit} value={nit}>{nit}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

function RegisterNITForm({ nitName, setNitName, nitCode, setNitCode, nitLoc, setNitLoc, handleSubmit, loading }) {
  return (
    <div className="p-8 md:p-12 flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Register Institute</h2>
      <p className="text-gray-500 mb-8">Register your NIT with INSMS</p>

      <form onSubmit={(handleSubmit)} className="space-y-5">
        <InputField icon={<Building />} name="nitName" label="Institute Name" value={nitName} onChange={(e) => setNitName(e.target.value)} placeholder="National Institute of Technology" />
        <InputField icon={<Code />} name="nitCode" label="Institute Code" value={nitCode} onChange={(e) => setNitCode(e.target.value)} placeholder="NIT-XXX" />
        <InputField icon={<MapPin />} name="location" label="Location" value={nitLoc} onChange={(e) => setNitLoc(e.target.value)} placeholder="City, State" />
        <button
          type="submit"
          className=" cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed" disabled={loading}
        >
          {loading ? "Registering....." : "Register Institute"}
        </button>
      </form>
    </div>
  );
}

const Login = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nitName, setNitName] = useState("")
  const [nitCode, setNitCode] = useState("")
  const [nitLoc, setNitLoc] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user == 'CommonAdmin') navigate('/common-admin/dashboard')
      if (user == 'NITAdmin') navigate('/nit-admin/dashboard')
      if (user == 'Coach') navigate('/coach/dashboard')
    }
  }, []);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log(email, password);
      const res = await api.post("/users/login", { email, password });
      const { token, role, name } = res.data;

      login(token, role, name, email);
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

  const handleSubmitNIT = async (e) => {
    e.preventDefault();
    setError("");

    if (!nitName || !nitCode || !nitLoc) {
      setError("Please fill all details.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/nits/register", { nitName, nitCode, nitLoc });
      setNitCode("")
      setNitLoc("")
      setNitName("")
      alert("Succesfull!!")
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = () => { }
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "", name: "", phone: "", role: "Coach", nit_id: "", nitName: "", nitCode: "", location: "", });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-200 to-blue-100 px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200">
        {/* LEFT PANEL */}
        {mode === "login" && (
          <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleSubmit={handleSubmitLogin} loading={loading} />
        )}
        {mode === "registerUser" && (
          // <RegisterUserForm />
          <>..............in develop</>
        )}
        {mode === "registerNIT" && (
          <RegisterNITForm nitName={nitName} setNitName={setNitName} nitCode={nitCode} setNitCode={setNitCode} nitLoc={nitLoc} setNitLoc={setNitLoc} handleSubmit={handleSubmitNIT} loading={loading} />
        )}

        {/* RIGHT PANEL */}
        <div className="bg-gradient-to-b from-blue-600 to-blue-700 p-8 md:p-12 flex flex-col justify-center items-center text-white">
          <Trophy className="h-16 w-16 mb-6 text-white" />
          <h1 className="text-4xl font-bold mb-2">INSMS</h1>
          <p className="text-lg text-blue-100">Inter-NIT Sports Management System</p>
          <p className="text-sm text-blue-200 mb-8">
            Connecting athletes, coaches, and institutes
          </p>

          <div className="w-full max-w-xs space-y-3">
            <ButtonToggle label="Login" active={mode === "login"} onClick={() => setMode("login")} />
            <ButtonToggle label="Register User" active={mode === "registerUser"} onClick={() => setMode("registerUser")} />
            <ButtonToggle label="Register NIT" active={mode === "registerNIT"} onClick={() => setMode("registerNIT")} />
          </div>

          <div className="mt-12 text-center text-sm text-blue-200">
            <p>© 2024 INSMS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;