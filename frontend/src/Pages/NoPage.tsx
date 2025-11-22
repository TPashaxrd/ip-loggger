import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NoPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-slate-100 p-6">
      
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center w-20 h-20 bg-red-600 rounded-full">
          <AlertCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-red-500">404</h1>
        <h2 className="text-xl font-semibold text-slate-200">Page Not Found</h2>
        <p className="text-slate-400 text-center">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-150 shadow-lg"
        >
          Go Back Home
        </Link>
      </div>

      <footer className="mt-10 text-xs text-slate-500">
        © 2025 IPLogger.io, All rights reserved.
      </footer>

    </div>
  );
};

export default NoPage;