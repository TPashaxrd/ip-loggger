import { useState } from "react";
import { Copy, Code, Zap } from "lucide-react";
import { data }from "../components/config" 

interface EmbedSectionProps {
  loggerId: string;
  apiUrl?: string;
}

export const EmbedSection = ({ loggerId, apiUrl = `${data.api}` }: EmbedSectionProps) => {
  const [htmlCopied, setHtmlCopied] = useState(false);
  const [tsxCopied, setTsxCopied] = useState(false);

  const htmlCode = `<script>
(async function(){
  try {
    // The API call is made to register the visitor's details on the server.
    await fetch('${apiUrl}/log/${loggerId}', {
      method: 'POST',
      credentials: 'include'
    });
  } catch(e){ console.error("Logger failed", e); }
})();
</script>`;

  const tsxCode = `import { useEffect } from "react";

export const LoggerTracker = () => {
  const loggerId = "${loggerId}";
  const apiUrl = "${apiUrl}";
  
  useEffect(() => {
    const sendLog = async () => {
      try {
        await fetch(\`\${apiUrl}/log/\${loggerId}\`, {
          method: 'POST',
          credentials: 'include'
        });
      } catch (e) {
        console.error("Log failed to send", e);
      }
    };
    sendLog();
  }, [apiUrl, loggerId]);

  return null; // The component doesn't render anything visible
};`;

  return (
    <div className="w-full max-w-6xl space-y-8">
      <h2 className="text-3xl font-extrabold text-white flex items-center gap-3 border-b border-indigo-500/30 pb-3">
        <Zap className="h-6 w-6 text-indigo-400" />
        Logger Embed Codes
      </h2>
      <p className="text-gray-400">
        To start visitor logging, add one of the codes below right before the **`body (html)`** tag of your website.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-900/70 border border-gray-700/50 rounded-xl shadow-2xl p-6 flex flex-col gap-4 transition duration-300 hover:border-indigo-500/80">
          <span className="text-lg font-bold text-indigo-300 flex items-center gap-2">
            <Code className="h-5 w-5" /> HTML / Vanilla JS
          </span>
          <p className="text-gray-400 text-sm mb-2">
            Use this simple script to log visitors.
          </p>
          <textarea
            readOnly
            title="HTML Embed"
            value={htmlCode}
            className="bg-gray-800/80 text-gray-50 text-sm px-4 py-3 rounded-xl w-full h-40 font-mono resize-none border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(htmlCode);
              setHtmlCopied(true);
              setTimeout(() => setHtmlCopied(false), 1500);
            }}
            className={`px-5 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition duration-300 transform active:scale-95 ${
              htmlCopied
                ? "bg-green-600 shadow-md shadow-green-500/50"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/50"
            }`}
          >
            <Copy className="h-5 w-5" /> {htmlCopied ? "Copied!" : "Copy HTML Code"}
          </button>
        </div>

        <div className="flex-1 bg-gray-900/70 border border-gray-700/50 rounded-xl shadow-2xl p-6 flex flex-col gap-4 transition duration-300 hover:border-emerald-500/80">
          <span className="text-lg font-bold text-emerald-300 flex items-center gap-2">
            <Zap className="h-5 w-5" /> React / TSX Component
          </span>
          <p className="text-gray-400 text-sm mb-2">
            A non-rendering component for logging in your React project.
          </p>
          <textarea
            readOnly
            title="TSX Embed"
            value={tsxCode}
            className="bg-gray-800/80 text-gray-50 text-sm px-4 py-3 rounded-xl w-full h-40 font-mono resize-none border border-gray-700 focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(tsxCode);
              setTsxCopied(true);
              setTimeout(() => setTsxCopied(false), 1500);
            }}
            className={`px-5 py-2 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition duration-300 transform active:scale-95 ${
              tsxCopied
                ? "bg-green-600 shadow-md shadow-green-500/50"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/50"
            }`}
          >
            <Copy className="h-5 w-5" /> {tsxCopied ? "Copied!" : "Copy TSX Code"}
          </button>
        </div>
      </div>
    </div>
  );
};