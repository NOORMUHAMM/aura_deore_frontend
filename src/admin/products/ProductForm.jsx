import React, { useState, useEffect } from "react";
import { API_BASE, authHeader } from "../../utils/api";

export default function ProductForm({ product, onSaved, onCancel }) {
  const [form, setForm] = useState(
    product || {
      name: "",
      title: "",
      description: "",
      price: "",
      categories: [""],
      collections: [""],
      inventory: 0,
      active: true,
    }
  );
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  function validateForm() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required.";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = "Valid price is required.";
    if (!form.categories[0]?.trim())
      newErrors.category = "At least one category is required.";
    if (!form.collections[0]?.trim())
      newErrors.collection = "At least one collection is required.";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const method = product ? "PUT" : "POST";
    const url = product
      ? `${API_BASE}/products/${product._id}`
      : `${API_BASE}/products`;

    const fd = new FormData();
    Object.keys(form).forEach((k) => {
      if (Array.isArray(form[k])) {
        fd.append(k, form[k][0]); // handle single category/collection
      } else {
        fd.append(k, form[k]);
      }
    });
    if (imageFile) {
      fd.append("image", imageFile);
    }

    const res = await fetch(url, {
      method,
      headers: { ...authHeader() },
      body: fd,
    });

    if (res.ok) {
      onSaved();
    } else {
      alert("❌ Save failed");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-6 shadow-lg rounded-lg max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {product ? "✏️ Edit Product" : "➕ New Product"}
      </h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          className={`mt-1 w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 ${
            errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-amber-500"
          }`}
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          className="mt-1 w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500"
          placeholder="Short Title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          className="mt-1 w-full border rounded-lg p-3 h-28 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500"
          placeholder="Product description..."
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Price ($) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          className={`mt-1 w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 ${
            errors.price ? "border-red-500 focus:ring-red-500" : "focus:ring-amber-500"
          }`}
          placeholder="Enter price"
          value={form.price}
          onChange={(e) => updateField("price", e.target.value)}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      {/* Product Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Product Image
        </label>
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="mt-1 block w-full text-sm text-gray-600 dark:text-gray-400"
        />
        {form.images && form.images[0] && !imageFile && (
          <img
            src={form.images[0]}
            alt="preview"
            className="mt-3 h-24 rounded-lg shadow border dark:border-gray-700"
          />
        )}
      </div>

      {/* Category & Collection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 ${
              errors.category ? "border-red-500 focus:ring-red-500" : "focus:ring-amber-500"
            }`}
            placeholder="Category"
            value={form.categories[0] || ""}
            onChange={(e) => updateField("categories", [e.target.value])}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Collection <span className="text-red-500">*</span>
          </label>
          <input
            className={`mt-1 w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 ${
              errors.collection ? "border-red-500 focus:ring-red-500" : "focus:ring-amber-500"
            }`}
            placeholder="Collection"
            value={form.collections[0] || ""}
            onChange={(e) => updateField("collections", [e.target.value])}
          />
          {errors.collection && (
            <p className="text-red-500 text-sm mt-1">{errors.collection}</p>
          )}
        </div>
      </div>

      {/* Inventory */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Inventory
        </label>
        <input
          type="number"
          className="mt-1 w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500"
          placeholder="Stock available"
          value={form.inventory}
          onChange={(e) => updateField("inventory", Number(e.target.value))}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow"
        >
          💾 Save
        </button>
        <button
          type="button"
          className="px-5 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={onCancel}
        >
          ❌ Cancel
        </button>
      </div>
    </form>
  );
}
