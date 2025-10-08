import React, { useEffect, useState } from "react";
import { API_BASE, authHeader } from "../../utils/api";
import DiscountForm from "./DiscountForm";

export default function DiscountList() {
  const [discounts, setDiscounts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function load() {
    const res = await fetch(`${API_BASE}/discounts`);
    const data = await res.json();
    setDiscounts(data || []);
  }

  async function del(id) {
    if (!window.confirm("Are you sure you want to delete this discount?")) return;
    await fetch(`${API_BASE}/discounts/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (editing) {
    return (
      <DiscountForm
        discount={editing !== true ? editing : null}
        onSaved={() => {
          setEditing(null);
          load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  // ✅ Apply search + filter
  const filteredDiscounts = discounts.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && d.active) ||
      (statusFilter === "inactive" && !d.active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          🎟️ Discounts
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => setEditing(true)}
        >
          + New Discount
        </button>
      </div>

      {/* 🔍 Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search discounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No discounts found.
                </td>
              </tr>
            )}
            {filteredDiscounts.map((d) => (
              <tr
                key={d._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {d.name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      d.type === "percentage"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-200"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
                    }`}
                  >
                    {d.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                  {d.type === "percentage" ? `${d.value}%` : `$${d.value}`}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      d.active
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {d.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => setEditing(d)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(d._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
