import { useState, useEffect } from "react";
import axios from "axios";
import { Link2, PlusCircle, ShieldCheck, Loader2 } from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        window.location.href = "/auth";
      });
  }, []);

  const createLogger = async () => {
    setLoading(true);
    setResponseData(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/logger/create",
        { redirectUrl },
        { withCredentials: true }
      );

      setResponseData(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }

    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_0.5px,transparent_1px),linear-gradient(to_bottom,#1e293b_0.5px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="h-2 bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500" />
        
        <div className="p-8">

          <div className="flex items-center justify-center flex-col mb-8">
            <div className="h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-900">
              <ShieldCheck className="h-6 w-6 text-brand-500" />
            </div>

            <h2 className="text-2xl font-bold">Welcome, {user.username}</h2>
            <p className="text-slate-400 text-sm mt-1">Create your tracking link.</p>
          </div>

          <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Redirect URL
          </label>

          <div className="relative mt-2 mb-4">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />

            <input
              type="text"
              placeholder="https://example.com"
              className="w-full rounded-lg bg-slate-900/50 border border-slate-700 pl-10 pr-3 py-2.5 text-slate-100 placeholder-slate-600 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
            />
          </div>

          <button
            onClick={createLogger}
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white rounded-lg px-4 py-2.5 font-medium flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="h-5 w-5" />
                Create Logger
              </>
            )}
          </button>

          {responseData && (
            <div className="mt-6 bg-slate-800/60 border border-slate-700 p-4 rounded-xl text-sm">
              <p className="text-emerald-400 font-medium">Created successfully!</p>
              <p className="mt-2">Logger ID: <span className="text-slate-300">{responseData.loggerId}</span></p>
              <p>Tracking URL:  
                <span className="text-brand-400 block mt-1 font-mono">
                  http://localhost:5000{responseData.trackingUrl}
                </span>
              </p>
            </div>
          )}

        </div>

        <div className="px-8 py-4 bg-slate-950/50 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>© 2024 IPLogger.io</span>
          <span className="text-emerald-400 font-semibold">Dashboard Active</span>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;