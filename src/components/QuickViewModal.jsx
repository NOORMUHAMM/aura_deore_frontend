import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { imageUrl } from "../utils/api";
import CartDrawer from "./CartDrawer";

export default function QuickViewModal({ product, onClose }) {
  const [cartOpen, setCartOpen] = React.useState(false);

  if (!product) return null;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.discountedPrice || product.price,
        qty: 1,
        images: product.images || [],
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartOpen(true);
  };

  const discounted = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[101] inset-0 flex justify-center items-center p-4"
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-700"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Left - Image */}
              <div>
                <img
                  src={imageUrl(product.images?.[0]) || "/prod-placeholder.jpg"}
                  alt={product.name}
                  className="rounded-lg w-full h-80 object-cover"
                />
              </div>

              {/* Right - Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {product.title || product.description}
                  </p>

                  {/* Price */}
                  {product.discount ? (
                    <div className="flex items-baseline gap-3">
                      <span className="line-through text-gray-400">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-amber-600 text-2xl font-bold">
                        ${discounted.toFixed(2)}
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        {product.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-amber-600">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={addToCart}
                    className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition text-sm"
                  >
                    🛒 Add to Cart
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => (window.location.href = `/product/${product._id}`)}
                    className="flex-1 border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                  >
                    View Details →
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ✅ Drawer opens when adding to cart */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
