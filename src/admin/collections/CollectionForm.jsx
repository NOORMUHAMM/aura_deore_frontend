import React, { useState, useEffect } from "react";
import { API_BASE, authHeader } from "../../utils/api";

export default function CollectionForm({ collection, onSaved, onCancel }) {
  const [form, setForm] = useState(
    collection || { slug: "", title: "", description: "", image: "" }
  );

  useEffect(() => {
    if (collection) setForm(collection);
  }, [collection]);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = collection ? "PUT" : "POST";
    const url = collection
      ? `${API_BASE}/collections/${collection._id}`
      : `${API_BASE}/collections`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSaved();
    } else {
      alert("Save failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {collection ? "✏️ Edit Collection" : "➕ New Collection"}
      </h2>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Slug
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                     bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-amber-500 focus:border-amber-500"
          placeholder="collection-slug"
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                     bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Collection Title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                     bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-amber-500 focus:border-amber-500"
          rows="3"
          placeholder="Short description of the collection"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image URL
        </label>
        <input
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                     bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-amber-500 focus:border-amber-500"
          placeholder="https://example.com/image.jpg"
          value={form.image}
          onChange={(e) => updateField("image", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                     hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}
