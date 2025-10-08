import React, { useState, useEffect } from "react";
import { API_BASE, authHeader, fetchJSON } from "../../utils/api";

export default function DiscountForm({ discount, onSaved, onCancel }) {
  const [form, setForm] = useState(
    discount || {
      name: "",
      type: "percentage",
      value: 0,
      criteria: { global: false, collections: [], categories: [], productIds: [] },
      active: true,
    }
  );

  const [collections, setCollections] = useState([]);
  const [categories] = useState(["Tables", "Vases", "Sculptures", "Wood"]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (discount) setForm(discount);
  }, [discount]);

  useEffect(() => {
    fetchJSON(`${API_BASE}/collections`, []).then(setCollections);
    fetchJSON(`${API_BASE}/products?limit=100`, { items: [] }).then((res) =>
      setProducts(res.items || [])
    );
  }, []);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanForm = {
      ...form,
      criteria: {
        ...form.criteria,
        productIds: Array.isArray(form.criteria.productIds)
          ? form.criteria.productIds
          : [form.criteria.productIds],
      },
    };

    const method = discount ? "PUT" : "POST";
    const url = discount
      ? `${API_BASE}/discounts/${discount._id}`
      : `${API_BASE}/discounts`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(cleanForm),
    });

    if (res.ok) {
      onSaved();
    } else {
      const errText = await res.text();
      alert(`Save failed: ${errText}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white dark:bg-gray-900 p-6 shadow-lg rounded-lg"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {discount ? "✏️ Edit Discount" : "➕ New Discount"}
      </h2>

      {/* Name */}
      <InputField
        label="Discount Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="e.g. Summer Sale"
      />

      {/* Type & Value */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Discount Type"
          value={form.type}
          options={[
            { value: "percentage", label: "Percentage (%)" },
            { value: "fixed", label: "Fixed Amount" },
          ]}
          onChange={(e) => updateField("type", e.target.value)}
        />
        <InputField
          type="number"
          label="Value"
          value={form.value}
          onChange={(e) => updateField("value", Number(e.target.value))}
          placeholder="Enter discount value"
        />
      </div>

      {/* Collections */}
      <MultiSelect
        label="Apply to Collections"
        options={collections.map((c) => ({ value: c.slug, label: c.title }))}
        value={form.criteria?.collections || []}
        onChange={(vals) =>
          setForm({ ...form, criteria: { ...form.criteria, collections: vals } })
        }
      />

      {/* Categories */}
      <MultiSelect
        label="Apply to Categories"
        options={categories.map((cat) => ({ value: cat, label: cat }))}
        value={form.criteria?.categories || []}
        onChange={(vals) =>
          setForm({ ...form, criteria: { ...form.criteria, categories: vals } })
        }
      />

      {/* Products */}
      <MultiSelect
        label="Apply to Specific Products"
        options={products.map((p) => ({ value: p._id, label: p.name }))}
        value={form.criteria?.productIds || []}
        onChange={(vals) =>
          setForm({
            ...form,
            criteria: {
              ...form.criteria,
              productIds: Array.isArray(vals) ? vals : [vals],
            },
          })
        }
      />

      {/* Toggles */}
      <div className="grid grid-cols-2 gap-4">
        <ToggleSwitch
          label="Global Discount?"
          checked={form.criteria?.global || false}
          onChange={(val) =>
            setForm({ ...form, criteria: { ...form.criteria, global: val } })
          }
          color="amber"
        />
        <ToggleSwitch
          label="Active?"
          checked={form.active}
          onChange={(val) => updateField("active", val)}
          color="green"
        />
      </div>

      {/* 🔥 Preview Box */}
      <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Preview
        </h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>
            <strong>Name:</strong> {form.name || "—"}
          </li>
          <li>
            <strong>Type:</strong> {form.type} ({form.value})
          </li>
          <li>
            <strong>Status:</strong> {form.active ? "✅ Active" : "❌ Inactive"}
          </li>
          <li>
            <strong>Global:</strong> {form.criteria?.global ? "🌍 Yes" : "—"}
          </li>
          <li>
            <strong>Collections:</strong>{" "}
            {form.criteria?.collections.length > 0
              ? form.criteria.collections.join(", ")
              : "—"}
          </li>
          <li>
            <strong>Categories:</strong>{" "}
            {form.criteria?.categories.length > 0
              ? form.criteria.categories.join(", ")
              : "—"}
          </li>
          <li>
            <strong>Products:</strong>{" "}
            {form.criteria?.productIds?.length > 0
              ? form.criteria.productIds
                  .map((id) => products.find((p) => p._id === id)?.name || id)
                  .join(", ")
              : "—"}
          </li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
        >
          💾 Save Discount
        </button>
        <button
          type="button"
          className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={onCancel}
        >
          ❌ Cancel
        </button>
      </div>
    </form>
  );
}

/* --- Reusable Components --- */
function InputField({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        className="mt-1 border p-2 w-full rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        className="mt-1 border p-2 w-full rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        value={value}
        onChange={onChange}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({ label, options, value, onChange }) {
  const handleChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    onChange(selected);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        multiple
        className="mt-1 border p-2 w-full rounded-lg h-40 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        value={value}
        onChange={handleChange}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Hold <kbd>Ctrl</kbd> / <kbd>Cmd</kbd> to select multiple.
      </p>
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange, color = "amber" }) {
  const colorClass =
    color === "green"
      ? "peer-checked:bg-green-600"
      : "peer-checked:bg-amber-600";

  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 transition ${colorClass}`}
        ></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></div>
      </label>
    </div>
  );
}
