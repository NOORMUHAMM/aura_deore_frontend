import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Package, Tags, Percent, DollarSign } from "lucide-react";
import { API_BASE, fetchJSON } from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    sales: 0,
    products: 0,
    collections: 0,
    discounts: 0,
  });

  const [salesData, setSalesData] = useState([]); // ✅ from API
  const [productData, setProductData] = useState([]); // ✅ from API
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Stats
    fetchJSON(`${API_BASE}/stats`, {
      sales: 0,
      products: 0,
      collections: 0,
      discounts: 0,
    }).then(setStats);

    // Sales data (example: /stats/salesTrend should return [{month:"Jan",sales:400},...])
    fetchJSON(`${API_BASE}/stats/salesTrend`, []).then(setSalesData);

    // Products per category (example: /stats/productsByCategory should return [{name:"Tables", value:12},...])
    fetchJSON(`${API_BASE}/stats/productsByCategory`, []).then(setProductData);

    // Dark mode watcher
    const observer = new MutationObserver(() => {
      setDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    setDarkMode(document.documentElement.classList.contains("dark"));

    return () => observer.disconnect();
  }, []);

  // Theme-aware chart styles
  const gridColor = darkMode ? "#374151" : "#e5e7eb";
  const textColor = darkMode ? "#d1d5db" : "#374151";
  const tooltipStyle = {
    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
    color: darkMode ? "#f9fafb" : "#111827",
    borderRadius: "6px",
    border: "1px solid #4b5563",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        📊 Dashboard Overview
      </h1>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="w-8 h-8 text-amber-600" />}
          label="Total Sales"
          value={`$${stats.sales.toLocaleString()}`}
        />
        <StatCard
          icon={<Package className="w-8 h-8 text-blue-600" />}
          label="Products"
          value={stats.products}
        />
        <StatCard
          icon={<Tags className="w-8 h-8 text-green-600" />}
          label="Collections"
          value={stats.collections}
        />
        <StatCard
          icon={<Percent className="w-8 h-8 text-red-600" />}
          label="Active Discounts"
          value={stats.discounts}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={darkMode ? "#22d3ee" : "#f59e0b"}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Products per Category */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Products by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="value"
                fill={darkMode ? "#38bdf8" : "#3b82f6"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center gap-4 transition"
    >
      {icon}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </h2>
      </div>
    </motion.div>
  );
}
