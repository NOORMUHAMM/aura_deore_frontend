import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Package, Tags, Layers, Percent, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Sync dark mode with html class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setDarkMode(saved === "dark");
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col transition-colors"
      >
        <div className="p-6 flex items-center justify-between border-b dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ⚙️ Admin
          </span>

          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded transition ${
                isActive
                  ? "bg-amber-100 dark:bg-amber-700 text-amber-700 dark:text-amber-100 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <Layers className="w-4 h-4 mr-2" /> Dashboard
          </NavLink>

          <NavLink
            to="products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded transition ${
                isActive
                  ? "bg-amber-100 dark:bg-amber-700 text-amber-700 dark:text-amber-100 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <Package className="w-4 h-4 mr-2" /> Products
          </NavLink>

          <NavLink
            to="collections"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded transition ${
                isActive
                  ? "bg-amber-100 dark:bg-amber-700 text-amber-700 dark:text-amber-100 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <Tags className="w-4 h-4 mr-2" /> Collections
          </NavLink>

          <NavLink
            to="discounts"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded transition ${
                isActive
                  ? "bg-amber-100 dark:bg-amber-700 text-amber-700 dark:text-amber-100 font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`
            }
          >
            <Percent className="w-4 h-4 mr-2" /> Discounts
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </motion.aside>

      {/* Main content */}
      <motion.main
        className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
