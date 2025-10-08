import React from "react";

export default function AdminPlaceholder() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 text-center animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          🚧 Admin Panel (Placeholder)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The Admin Panel is under development.  
          This placeholder is a temporary screen while we build a complete, professional admin interface.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
            Back to Home
          </button>
          <button className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
