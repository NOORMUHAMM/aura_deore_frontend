import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props:
 * - open (bool)
 * - onClose (fn)
 * - cartItems (array) each item: { _id, name, price, qty }
 * - amount (number) optional total amount (calculated if not provided)
 * - ownerPhone (string) REQUIRED: international format WITHOUT '+' e.g. 919876543210
 */
export default function CheckoutModal({ open, onClose, cartItems = [], amount, ownerPhone }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhone("");
    }
  }, [open]);

  const calcTotal = () => {
    if (typeof amount === "number") return amount;
    return cartItems.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }
    // Build message
    const total = calcTotal();
    let lines = [];
    lines.push(`New Order from ${name}`);
    lines.push(`Email: ${email || "N/A"}`);
    lines.push(`Phone: ${phone}`);
    lines.push("");
    lines.push("Products:");
    cartItems.forEach((it, i) => {
      lines.push(
        `${i + 1}. ${it.name} x${it.qty || 1} — $${(it.price || 0).toFixed(2)}`
      );
    });
    lines.push("");
    lines.push(`Total: $${total.toFixed(2)}`);
    lines.push("");
    lines.push("Please contact me to confirm the order. Thanks!");

    const text = encodeURIComponent(lines.join("\n"));

    if (!ownerPhone) {
      alert("Owner phone number not configured. Please set ownerPhone in the CheckoutModal props.");
      return;
    }

    // WhatsApp link
    const waLink = `https://api.whatsapp.com/send?phone=${ownerPhone}&text=${text}`;

    // Open WhatsApp (new tab)
    window.open(waLink, "_blank");

    // Optionally: close modal
    onClose && onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Checkout — Your details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300">Phone *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded border px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="e.g. +91-9876543210 or 9876543210"
                  required
                />
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-800 dark:text-gray-200">
                  <div>Items</div>
                  <div>${calcTotal().toFixed(2)}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onClose && onClose()}
                    className="flex-1 px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Send via WhatsApp
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  After submitting, WhatsApp will open with a prefilled message to the owner.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
