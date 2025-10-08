import React, { useEffect, useState } from "react";
import { fetchJSON, api } from "../utils/api";
import { motion } from "framer-motion";

export default function Filters({ activeCategory, onChange, layout = "sidebar" }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchJSON(api("/products/categories"), []);
        setCategories(data || []);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading)
    return <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading categories...</p>;

  if (categories.length === 0)
    return <p className="text-gray-500 dark:text-gray-400">No categories found</p>;

  // ✅ Mobile Layout (Top Horizontal Scroll)
  if (layout === "topbar") {
    return (
      <div className="flex overflow-x-auto gap-3 pb-3 no-scrollbar items-center justify-start">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange("")}
          className={`whitespace-nowrap px-4 py-2 rounded-full border font-medium text-sm transition ${
            activeCategory === ""
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All
        </motion.button>
        {categories.map((cat, i) => (
          <motion.button
            key={i}
            onClick={() => onChange(cat === activeCategory ? "" : cat)}
            whileTap={{ scale: 0.95 }}
            className={`whitespace-nowrap px-4 py-2 rounded-full border transition font-medium text-sm ${
              activeCategory === cat
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </motion.button>
        ))}
      </div>
    );
  }

  // ✅ Desktop Sidebar Layout
  return (
    <div className="space-y-3">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange("")}
        className={`w-full text-left px-4 py-2 rounded-lg border transition font-semibold ${
          activeCategory === ""
            ? "bg-amber-600 text-white border-amber-600"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        All
      </motion.button>

      {categories.map((cat, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.02 }}
          onClick={() => onChange(cat === activeCategory ? "" : cat)}
          className={`w-full text-left px-4 py-2 rounded-lg border transition ${
            activeCategory === cat
              ? "bg-amber-600 text-white border-amber-600"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </motion.button>
      ))}
    </div>
  );
}
