import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BASE_URL from "../services/api";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("mongoId", data._id);
      navigate(`/profile/${data.userId}`);
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-900 px-4 min-h-screen text-white">
      
      {/* BRANDING: DEVCOLLAB */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-blue-600 p-2 rounded-xl">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <h1 className="font-black text-4xl uppercase tracking-tighter">
          Dev<span className="text-blue-500">Collab</span>
        </h1>
      </div>

      <div className="bg-slate-800 shadow-2xl p-8 border border-white/5 rounded-2xl w-full max-w-md">
        <h2 className="mb-6 font-bold text-gray-400 text-sm text-center uppercase tracking-widest">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="ml-1 font-bold text-gray-400 text-xs uppercase">Email Address</label>
            <input
              type="email"
              className="bg-slate-700 p-3 border border-slate-600 focus:border-blue-500 rounded-lg outline-none w-full text-white transition"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="space-y-1">
            <label className="ml-1 font-bold text-gray-400 text-xs uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle type between text and password
                className="bg-slate-700 p-3 pr-12 border border-slate-600 focus:border-blue-500 rounded-lg outline-none w-full text-white transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="top-1/2 right-3 absolute text-gray-400 hover:text-blue-400 transition -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg mt-6 p-3 rounded-lg w-full font-bold transition"
          >
            <Lock size={18} /> Login
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-sm text-center">
          Don't have an account?
          <Link to="/signup" className="ml-2 font-bold text-blue-400 hover:text-blue-300 transition">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;