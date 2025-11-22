import { useState } from "react";
import axios from "axios";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { data } from "../components/config";

type AuthMode = "LOGIN" | "REGISTER";

function Auth() {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLogin = mode === "LOGIN";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${data.api}/api/auth/login`, {
          email,
          password,
        }, { withCredentials: true });

        setSuccess("✔ Logged in successfully!");
        setTimeout(() => window.location.href = "/", 2000)
      } 
      else {
        const res = await axios.post(`${data.api}/api/auth/register`, {
          username: fullName,
          email,
          password,
        }, { withCredentials: true });

        if(res.status === 201) {
          setTimeout(() => window.location.href = "/", 200)
          setSuccess("✔ Account created successfully!");
        }
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 relative overflow-hidden flex items-center justify-center p-4">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

        <div className="h-2 bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500" />

        <div className="p-8 pb-6">

          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-900 ring-offset-2 ring-offset-brand-600/20">
              <ShieldCheck className="h-6 w-6 text-brand-500" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-slate-400 text-sm mt-1 text-center">
              {isLogin
                ? "Enter your credentials to sign in."
                : "Fill in your information to create an account."}
            </p>
          </div>

          {error && (
            <div className="text-red-400 text-sm mb-3 text-center">{error}</div>
          )}
          {success && (
            <div className="text-emerald-400 text-sm mb-3 text-center">{success}</div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>

            {!isLogin && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full rounded-lg bg-slate-900/50 border border-slate-700 pl-10 pr-3 py-2.5 text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg bg-slate-900/50 border border-slate-700 pl-10 pr-3 py-2.5 text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg bg-slate-900/50 border border-slate-700 pl-10 pr-10 py-2.5 text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white rounded-lg px-4 py-2.5 font-medium flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            >
              {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              {isLogin ? "Don't have an account? " : "Already registered? "}
              <button
                onClick={() => setMode(isLogin ? "REGISTER" : "LOGIN")}
                className="font-semibold text-brand-400 hover:text-brand-300 hover:underline"
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>© 2025 IPLogger.io</span>
          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Operational</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;