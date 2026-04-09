import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import BASE_URL from "../services/api";
import { ShieldCheck, RefreshCw, CheckCircle2, Circle } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [strength, setStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") checkStrength(value);
  };

  const checkStrength = (pass) => {
    if (!pass) return setStrength("");
    const requirements = {
      length: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasLower: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    const passedCount = Object.values(requirements).filter(Boolean).length;
    if (passedCount <= 2) setStrength("Weak");
    else if (passedCount <= 4) setStrength("Medium");
    else setStrength("Strong");
  };

  const generatePassword = () => {
    const sets = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()"
    };
    let password = "";
    password += sets.upper[Math.floor(Math.random() * sets.upper.length)];
    password += sets.lower[Math.floor(Math.random() * sets.lower.length)];
    password += sets.numbers[Math.floor(Math.random() * sets.numbers.length)];
    password += sets.symbols[Math.floor(Math.random() * sets.symbols.length)];
    const allChars = Object.values(sets).join("");
    for (let i = 0; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    const shuffled = password.split('').sort(() => 0.5 - Math.random()).join('');
    setFormData({ ...formData, password: shuffled });
    setStrength("Strong");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength !== "Strong") {
      alert("Password must include: uppercase, lowercase, numbers, and symbols.");
      return;
    }
    
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();

    if (res.ok) {
      alert("Signup successful");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("mongoId", data._id);
      navigate(`/profile/${data.userId}`);
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-900 px-4 min-h-screen text-white">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-blue-600 p-2 rounded-xl">
          <ShieldCheck size={24} className="text-white" />
        </div>
        <h1 className="font-black text-4xl uppercase tracking-tighter">
          Dev<span className="text-blue-500">Collab</span>
        </h1>
      </div>

      <div className="bg-slate-800 shadow-2xl p-8 border border-white/5 rounded-2xl w-full max-w-md">
        <h2 className="mb-6 font-bold text-gray-400 text-sm text-center uppercase tracking-widest">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block ml-1 font-bold text-gray-400 text-xs text-left uppercase">Full Name</label>
            <input name="name" placeholder="John Doe" onChange={handleChange} className="bg-slate-700 p-3 border border-slate-600 focus:border-blue-500 rounded-lg outline-none w-full text-white transition" required />
          </div>

          <div className="space-y-1">
            <label className="block ml-1 font-bold text-gray-400 text-xs text-left uppercase">Email Address</label>
            <input name="email" type="email" placeholder="name@company.com" onChange={handleChange} className="bg-slate-700 p-3 border border-slate-600 focus:border-blue-500 rounded-lg outline-none w-full text-white transition" required />
          </div>

          <div className="relative space-y-1">
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="font-bold text-gray-400 text-xs uppercase">Password</label>
              {strength && (
                <span className={`text-[10px] font-bold ${strength === "Strong" ? "text-green-400" : strength === "Medium" ? "text-yellow-400" : "text-red-400"}`}>
                  {strength} SECURITY
                </span>
              )}
            </div>

            <div className="relative">
              <input
                name="password"
                type="text"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-slate-700 p-3 pr-12 border border-slate-600 focus:border-blue-500 rounded-lg outline-none w-full font-mono text-white transition"
                required
              />
              <button type="button" onClick={generatePassword} className="top-1/2 right-2 absolute hover:bg-slate-600 p-2 rounded-md text-blue-400 transition -translate-y-1/2">
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="bg-slate-700 mt-2 rounded-full w-full h-1.5 overflow-hidden">
              <div className={`h-full transition-all duration-500 ${strength === "Strong" ? "w-full bg-green-500" : strength === "Medium" ? "w-1/2 bg-yellow-500" : strength === "Weak" ? "w-1/4 bg-red-500" : "w-0"}`} />
            </div>

            <div className="gap-x-2 grid grid-cols-2 mt-3">
              <Requirement met={/[A-Z]/.test(formData.password)} text="Uppercase" />
              <Requirement met={/[a-z]/.test(formData.password)} text="Lowercase" />
              <Requirement met={/[0-9]/.test(formData.password)} text="Number" />
              <Requirement met={/[!@#$%^&*]/.test(formData.password)} text="Symbol" />
            </div>
          </div>

          <button className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 shadow-blue-900/20 shadow-lg mt-6 p-3 rounded-lg w-full font-bold transition">
            <ShieldCheck size={18} /> Complete Signup
          </button>
        </form>

        {/* NAVIGATION TO LOGIN */}
        <p className="mt-6 text-gray-400 text-sm text-center">
          Already have an account?
          <Link to="/login" className="ml-2 font-bold text-blue-400 hover:text-blue-300 transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const Requirement = ({ met, text }) => (
  <div className={`flex items-center gap-1.5 text-[10px] ${met ? "text-green-400" : "text-gray-500"}`}>
    {met ? <CheckCircle2 size={12} /> : <Circle size={12} />}
    {text}
  </div>
);

export default Signup;