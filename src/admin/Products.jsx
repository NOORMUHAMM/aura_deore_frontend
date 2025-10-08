import React, { useEffect, useState } from "react";
import { API_BASE, authHeader } from "../../utils/api";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    setProducts(data.items || []);
  }

  async function del(id) {
    await fetch(`${API_BASE}/products/${id}`, {
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
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          🛍️ Products
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
        <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-700 dark:text-gray-300">
                Price
              </th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-left text-gray-700 dark:text-gray-300">
                Discount
              </th>
              <th className="border border-gray-200 dark:border-gray-700 p-3 text-center text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200">
                    {p.name}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200">
                    ${p.price}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 text-gray-800 dark:text-gray-200">
                    {p.discount}%
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 p-3 text-center space-x-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => del(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
