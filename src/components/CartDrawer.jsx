import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { imageUrl } from "../utils/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// then: const doc = new jsPDF();



export default function CartDrawer({ open, onClose }) {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState("form");
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const OWNER_PHONE = "919876543210"; // your WhatsApp number (no +)
  const OWNER_EMAIL = "youremail@example.com";

  // ✅ Load cart from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, [open]);

  // ✅ Update cart in localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const removeItem = (id) => updateCart(cart.filter((i) => i._id !== id));

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  // ✅ Build WhatsApp/email message
  const buildMessage = () => {
    const now = new Date();
    const date = now.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    let lines = [];
    lines.push(`🛍️ *New Order from ${userInfo.name}*`);
    lines.push(`📅 Ordered on: ${date}`);
    lines.push(`🧾 Total Items: ${totalItems}`);
    lines.push("");
    lines.push(`📧 Email: ${userInfo.email || "N/A"}`);
    lines.push(`📞 Phone: ${userInfo.phone}`);
    lines.push("");
    lines.push("🛒 *Order Details:*");
    cart.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.name} × ${item.qty} — $${item.price.toFixed(2)}`
      );
    });
    lines.push("");
    lines.push(`💰 *Total Amount:* $${total.toFixed(2)}`);
    lines.push("");
    lines.push(
      "Thank you for shopping with *The Aura Decore*! 🌸\nWe’ll confirm your order shortly.\n\n— *The Aura Decore Team 💫*"
    );
    return lines.join("\n");
  };

  // ✅ Increase or decrease quantity
const handleQuantityChange = (id, change) => {
  const updated = cart
    .map((item) => {
      if (item._id === id) {
        const newQty = Math.max(0, item.qty + change);
        return { ...item, qty: newQty };
      }
      return item;
    })
    .filter((i) => i.qty > 0); // auto-remove if qty becomes 0

  updateCart(updated);
};

  // const handleDownloadReceipt = () => {
  //   const doc = new jsPDF();
  //   const date = new Date().toLocaleString("en-IN", {
  //     dateStyle: "medium",
  //     timeStyle: "short",
  //   });

  //   doc.setFontSize(18);
  //   doc.text("🪞 The Aura Decore", 14, 20);
  //   doc.setFontSize(12);
  //   doc.text("Order Receipt", 14, 30);
  //   doc.text(`Date: ${date}`, 14, 36);
  //   doc.text(`Customer: ${userInfo.name}`, 14, 42);
  //   doc.text(`Email: ${userInfo.email || "Not provided"}`, 14, 48);
  //   doc.text(`Phone: ${userInfo.phone}`, 14, 54);

  //   const rows = cart.map((item, i) => [
  //     i + 1,
  //     item.name,
  //     item.qty,
  //     `$${item.price.toFixed(2)}`,
  //     `$${(item.price * item.qty).toFixed(2)}`,
  //   ]);

  //   doc.autoTable({
  //     startY: 60,
  //     head: [["#", "Product", "Qty", "Price", "Subtotal"]],
  //     body: rows,
  //     theme: "striped",
  //     styles: { fontSize: 11 },
  //   });

  //   const finalY = doc.lastAutoTable.finalY || 80;
  //   doc.text(`Total Amount: $${total.toFixed(2)}`, 14, finalY + 10);
  //   doc.text("Thank you for shopping with The Aura Decore!", 14, finalY + 20);

  //   doc.save(`AuraDecore_Receipt_${Date.now()}.pdf`);
  //   setToast("📄 Receipt downloaded successfully!");
  //   setTimeout(() => setToast(null), 2500);
  // };



// const handleDownloadReceipt = () => {
//   const doc = new jsPDF();

//   // 📅 Format date
//   const date = new Date().toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });

//   // 🧾 Header
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(20);
//   doc.text("🪞 The Aura Decore", 105, 20, { align: "center" });

//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text("Order Receipt", 105, 28, { align: "center" });

//   // 🧍‍♂️ Customer Info
//   doc.setFontSize(11);
//   doc.text(`Date: ${date}`, 14, 45);
//   doc.text(`Customer: ${userInfo.name}`, 14, 52);
//   doc.text(`Email: ${userInfo.email || "Not provided"}`, 14, 59);
//   doc.text(`Phone: ${userInfo.phone}`, 14, 66);

//   // 🛒 Table Data
//   const rows = cart.map((item, i) => [
//     i + 1,
//     item.name,
//     item.qty,
//     `$${item.price.toFixed(2)}`,
//     `$${(item.price * item.qty).toFixed(2)}`,
//   ]);

//   autoTable(doc, {
//     startY: 75,
//     head: [["#", "Product", "Qty", "Price", "Subtotal"]],
//     body: rows,
//     theme: "striped",
//     headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: "bold" },
//     styles: { fontSize: 11 },
//     columnStyles: {
//       0: { halign: "center", cellWidth: 10 },
//       1: { cellWidth: 80 },
//       2: { halign: "center", cellWidth: 20 },
//       3: { halign: "right", cellWidth: 25 },
//       4: { halign: "right", cellWidth: 30 },
//     },
//   });

//   // 💰 Total Section
//   const finalY = doc.lastAutoTable.finalY || 85;
//   doc.setFont("helvetica", "bold");
//   doc.text(`Total Amount: $${total.toFixed(2)}`, 14, finalY + 10);
//   doc.setFont("helvetica", "normal");
//   doc.text(
//     "Thank you for shopping with The Aura Decore! 🌸",
//     14,
//     finalY + 20
//   );
//   doc.text("We hope to see you again soon 💫", 14, finalY + 27);

//   // 💾 Save PDF
//   doc.save(`AuraDecore_Receipt_${Date.now()}.pdf`);

//   // ✅ Toast message
//   setToast("📄 Receipt downloaded successfully!");
//   setTimeout(() => setToast(null), 2500);
// };

const handleDownloadReceipt = () => {
  const doc = new jsPDF();

  const date = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // ✅ Use only supported ASCII text — no emojis
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("The Aura Decore", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Order Receipt", 105, 28, { align: "center" });

  // Customer Info
  doc.setFontSize(11);
  doc.text(`Date: ${date}`, 14, 44);
  doc.text(`Customer: ${userInfo.name || "N/A"}`, 14, 50);
  doc.text(`Email: ${userInfo.email || "Not provided"}`, 14, 56);
  doc.text(`Phone: ${userInfo.phone || "N/A"}`, 14, 62);

  // Table Rows
  const rows = cart.map((item, i) => [
    i + 1,
    item.name,
    item.qty,
    `$${item.price.toFixed(2)}`,
    `$${(item.price * item.qty).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 74,
    head: [["#", "Product", "Qty", "Price", "Subtotal"]],
    body: rows,
    theme: "striped",
    headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "right", cellWidth: 25 },
      4: { halign: "right", cellWidth: 30 },
    },
  });

  const finalY = doc.lastAutoTable?.finalY ?? 90;

  // ✅ Total and footer text — only plain characters
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: $${total.toFixed(2)}`, 14, finalY + 10);

  doc.setFont("helvetica", "normal");
  doc.text("Thank you for shopping with The Aura Decore!", 14, finalY + 18);
  doc.text("We hope to see you again soon.", 14, finalY + 25);

  // ✅ Save
  doc.save(`AuraDecore_Receipt_${Date.now()}.pdf`);

  setToast("📄 Receipt downloaded successfully!");
  setTimeout(() => setToast(null), 2500);
};



  // ✅ Send order via WhatsApp or Email
  const handleSendOrder = () => {
    const message = buildMessage();
    const encodedMessage = encodeURIComponent(message);

    const waLink = `https://api.whatsapp.com/send?phone=${OWNER_PHONE}&text=${encodedMessage}`;
    const mailLink = `mailto:${OWNER_EMAIL}?subject=New%20Order%20from%20${encodeURIComponent(
      userInfo.name
    )}&body=${encodedMessage}`;

    const newWindow = window.open(waLink, "_blank");

    setTimeout(() => {
      if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
        window.location.href = mailLink;
      }
    }, 2000);

    // ✅ Clear cart after sending
    updateCart([]);
    setToast("✅ Order sent and cart cleared!");
    setTimeout(() => setToast(null), 3000);

    setShowCheckout(false);
    setStep("form");
    setUserInfo({ name: "", email: "", phone: "" });
    onClose();
  };

  const handleFormSubmit = () => {
    if (!userInfo.name.trim() || !userInfo.phone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }
    setStep("summary");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-80 sm:w-96 h-full bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                🛒 Your Cart
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500"
              >
                ✖
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-3 styled-scrollbar">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  Your cart is empty 😔
                </p>
              ) : (
                // cart.map((item) => (
                //   <div
                //     key={item._id}
                //     className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                //   >
                //     <img
                //       src={imageUrl(item.images?.[0]) || "/prod-placeholder.jpg"}
                //       alt={item.name}
                //       className="w-16 h-16 object-cover rounded"
                //     />
                //     <div className="flex-1">
                //       <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                //         {item.name}
                //       </h3>
                //       <p className="text-sm text-gray-600 dark:text-gray-400">
                //         ${item.price.toFixed(2)} × {item.qty}
                //       </p>
                //     </div>
                //     <button
                //       onClick={() => removeItem(item._id)}
                //       className="text-red-500 hover:text-red-700 text-sm"
                //     >
                //       ✖
                //     </button>
                //   </div>
                // ))
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg"
                  >
                    <img
                      src={imageUrl(item.images?.[0]) || "/prod-placeholder.jpg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${item.price.toFixed(2)}
                      </p>
                
                      {/* ➕ Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-gray-800 dark:text-gray-100 font-medium">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✖
                    </button>
                  </div>
                ))
                

              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between text-gray-800 dark:text-gray-100 font-semibold mb-3">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-500 text-white font-semibold rounded-lg transition"
                  onClick={() => {
                    setShowCheckout(true);
                    setStep("form");
                  }}
                >
                  🛍️ Checkout
                </button>
              </div>
            )}

            {/* Checkout Modal */}
            <AnimatePresence>
              {showCheckout && (
                <motion.div
                  className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 flex flex-col justify-center items-center px-6 overflow-y-auto"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  {step === "form" && (
                    <>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                        Enter Your Details
                      </h3>
                      <div className="w-full space-y-3">
                        <input
                          type="text"
                          placeholder="Name"
                          value={userInfo.name}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, name: e.target.value })
                          }
                          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-gray-100"
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          value={userInfo.email}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, email: e.target.value })
                          }
                          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-gray-100"
                        />
                        <input
                          type="text"
                          placeholder="Phone number"
                          value={userInfo.phone}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, phone: e.target.value })
                          }
                          className="w-full p-2 rounded border dark:bg-gray-800 dark:text-gray-100"
                        />
                      </div>

                      <div className="flex gap-3 mt-5 w-full">
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="flex-1 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleFormSubmit}
                          className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition"
                        >
                          Continue →
                        </button>
                      </div>
                    </>
                  )}

                  {step === "summary" && (
                    <>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                        Confirm Your Order
                      </h3>

                      <div className="w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 text-sm text-gray-800 dark:text-gray-200">
                        <p>👤 <strong>Name:</strong> {userInfo.name}</p>
                        <p>📧 <strong>Email:</strong> {userInfo.email || "Not provided"}</p>
                        <p>📞 <strong>Phone:</strong> {userInfo.phone}</p>
                      </div>

                      <div className="w-full bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-4">
                        {cart.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between text-sm text-gray-700 dark:text-gray-200 mb-2"
                          >
                            <span>
                              {item.name} × {item.qty}
                            </span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-300 dark:border-gray-700 mt-2 pt-2 flex justify-between font-semibold text-gray-900 dark:text-gray-100">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-3 w-full flex-wrap justify-between">
                        <button
                          onClick={() => setStep("form")}
                          className="flex-1 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          ← Back
                        </button>
                        <button
                          onClick={handleDownloadReceipt}
                          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition"
                        >
                          📄 Download Receipt
                        </button>
                        <button
                          onClick={handleSendOrder}
                          className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-500 transition"
                        >
                          Send Order
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                className="fixed bottom-6 right-6 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] font-semibold text-sm"
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Put this just before the closing fragment in your component return */}
<style>{`
  /* Custom scrollbar for cart list (works in most browsers) */
  .styled-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #d97706 #f9fafb; /* thumb then track for Firefox */
  }

  .styled-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .styled-scrollbar::-webkit-scrollbar-track {
    background: #f9fafb;
    border-radius: 10px;
  }

  .styled-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #fbbf24, #d97706);
    border-radius: 10px;
  }

  .styled-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #f59e0b, #b45309);
  }

  /* Dark-mode fallback using prefers-color-scheme */
  @media (prefers-color-scheme: dark) {
    .styled-scrollbar {
      scrollbar-color: #fbbf24 #111827;
    }
    .styled-scrollbar::-webkit-scrollbar-track {
      background: #111827;
    }
    .styled-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #fbbf24, #92400e);
    }
    .styled-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #f59e0b, #7c2d12);
    }
  }

  /* Extra: improve contrast when your site toggles .dark on body/html */
  .dark .styled-scrollbar {
    scrollbar-color: #fbbf24 #111827;
  }
  .dark .styled-scrollbar::-webkit-scrollbar-track {
    background: #111827;
  }
  .dark .styled-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #fbbf24, #92400e);
  }
`}</style>
        </>
      )}
    </AnimatePresence>
  );
}

