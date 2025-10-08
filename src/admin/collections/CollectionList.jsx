import React, { useEffect, useState } from "react";
import { API_BASE, authHeader } from "../../utils/api";
import CollectionForm from "./CollectionForm";

export default function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5; // number of items per page

  async function load(p = page) {
    const res = await fetch(`${API_BASE}/collections?page=${p}&limit=${limit}`);
    const data = await res.json();

    // backend should return { items: [], total: X }
    if (Array.isArray(data)) {
      setCollections(data);
      setTotal(data.length);
    } else {
      setCollections(data.items || []);
      setTotal(data.total || 0);
    }
  }

  async function del(id) {
    await fetch(`${API_BASE}/collections/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    load();
  }

  useEffect(() => {
    load();
  }, [page]);

  if (editing) {
    return (
      <CollectionForm
        collection={editing !== true ? editing : null}
        onSaved={() => {
          setEditing(null);
          load();
        }}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📂 Collections
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => setEditing(true)}
        >
          + New Collection
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Slug</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr
                key={c._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {/* Image Preview */}
                <td className="px-4 py-2 border">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>

                {/* Slug */}
                <td className="px-4 py-2 border text-gray-700 dark:text-gray-300">
                  {c.slug}
                </td>

                {/* Title */}
                <td className="px-4 py-2 border font-medium text-gray-900 dark:text-gray-100">
                  {c.title}
                </td>

                {/* Actions */}
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => setEditing(c)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(c._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {collections.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 dark:text-gray-400 py-6"
                >
                  No collections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span className="text-gray-600 dark:text-gray-300">
          Page {page}
        </span>
        <button
          disabled={collections.length < limit}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
