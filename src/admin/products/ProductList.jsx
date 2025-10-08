import React, { useEffect, useState } from "react";
import { API_BASE, authHeader, imageUrl } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  async function load() {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    setProducts(data.items || []);
  }

  async function del(id) {
    if (!window.confirm("❌ Are you sure you want to delete this product?")) return;

    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      load();
    } catch {
      alert("Failed to delete product");
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (editing) {
    return (
      <ProductForm
        product={editing !== true ? editing : null}
        onSaved={() => {
          setEditing(null);
          load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📦 Products
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => setEditing(true)}
        >
          + New Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Discount</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <AnimatePresence component="tbody">
            {currentProducts.map((p) => (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3">
                  <img
                    src={imageUrl(p.images?.[0]) || "/prod-placeholder.jpg"}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded-md shadow"
                  />
                </td>
                <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">
                  {p.name}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400">
                  ${p.price}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400">
                  {p.discount ? `${p.discount}%` : "—"}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow transition"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => del(p._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow transition"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg border text-sm ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === i + 1
                  ? "bg-amber-600 text-white"
                  : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg border text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
