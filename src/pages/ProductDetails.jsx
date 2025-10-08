import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, fetchJSON, imageUrl } from "../utils/api";
import useExchangeRates from "../hooks/useExchangeRates";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "../utils/cart";

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const { convert } = useExchangeRates();
  const [toast, setToast] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJSON(api(`/products/${id}`));
        if (!data) return;
        setProduct(data);

        if (data.collections?.length) {
          const relatedData = await fetchJSON(
            api(`/products?collection=${data.collections[0]}&limit=4`)
          );
          const filtered =
            relatedData?.items?.filter((p) => p._id !== id) || [];
          setRelated(filtered);
        } else setRelated([]);
      } catch (err) {
        console.error("Failed to load product details:", err);
      }
    };
    if (id) load();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Prevent scroll when Quick View modal is open
  useEffect(() => {
    if (quickViewProduct) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [quickViewProduct]);

  const handleAddToCart = (prod = product) => {
    const success = addToCart(prod, onAddToCart);
    if (success) {
      setToast(`${prod.name} added to cart 🛒`);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const discountedPrice = product?.discount
    ? product.price * (1 - product.discount / 100)
    : product?.price;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-20 md:pt-24 lg:pt-28 pb-28 md:pb-0">
      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="fixed bottom-6 right-6 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Main Product Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT: Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
              <img
                src={imageUrl(product.images?.[0]) || "/prod-placeholder.jpg"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.images?.length > 1 && (
                <div className="mt-3 flex gap-3 justify-center flex-wrap">
                  {product.images.slice(0, 4).map((im, i) => (
                    <motion.img
                      key={i}
                      src={imageUrl(im)}
                      alt="thumb"
                      className="w-20 h-20 object-cover rounded-md cursor-pointer border hover:scale-110 transition-transform"
                      whileHover={{ scale: 1.1 }}
                      onClick={() => {
                        const newImgs = [...product.images];
                        [newImgs[0], newImgs[i]] = [newImgs[i], newImgs[0]];
                        setProduct({ ...product, images: newImgs });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* RIGHT: Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {product.name}
            </h1>
            {product.title && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                {product.title}
              </p>
            )}
            {/* Pricing */}
            <div className="mt-4">
              {product.discount ? (
                <div className="flex items-baseline gap-3">
                  <span className="line-through text-gray-400 dark:text-gray-500">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-amber-600 font-extrabold text-3xl">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm text-green-600">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  ${product.price.toFixed(2)}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    product.description || "<p>No description available.</p>",
                }}
              />
            </div>

            {/* Buttons */}
            <div className="hidden md:flex mt-6 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleAddToCart(product)}
                className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                🛒 Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ✅ Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
              You May Also Like
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((r) => {
                const relatedDiscounted = r.discount
                  ? r.price * (1 - r.discount / 100)
                  : r.price;
                return (
                  <motion.div
                    key={r._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex flex-col"
                  >
                    <img
                      src={imageUrl(r.images?.[0]) || "/prod-placeholder.jpg"}
                      alt={r.name}
                      className="w-full h-52 object-cover rounded-lg"
                    />
                    <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {r.name}
                    </h3>
                    <p className="text-amber-600 font-bold mt-1">
                      ${relatedDiscounted.toFixed(2)}
                    </p>

                    <div className="mt-3 flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(r)}
                        className="bg-amber-600 text-white py-1.5 rounded-lg hover:bg-amber-700 transition text-sm"
                      >
                        🛒 Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          setQuickViewProduct(r);
                          setActiveImage(r.images?.[0]);
                          setCarouselIndex(0);
                        }}
                        className="border py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                      >
                        👁️ Quick View
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ✅ Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            key="quick-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-lg w-full overflow-hidden relative"
            >
              {/* 🖼️ Swipeable Image Carousel */}
              <div className="relative overflow-hidden rounded-lg">
                <motion.img
                  key={carouselIndex}
                  src={
                    imageUrl(
                      quickViewProduct.images?.[carouselIndex] ||
                        quickViewProduct.images?.[0]
                    ) || "/prod-placeholder.jpg"
                  }
                  alt="carousel"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-72 object-cover rounded-lg"
                />
                {quickViewProduct.images?.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCarouselIndex(
                          (carouselIndex - 1 + quickViewProduct.images.length) %
                            quickViewProduct.images.length
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() =>
                        setCarouselIndex(
                          (carouselIndex + 1) %
                            quickViewProduct.images.length
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Indicators */}
              {quickViewProduct.images?.length > 1 && (
                <div className="flex gap-2 mt-3 justify-center">
                  {quickViewProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={imageUrl(img)}
                      alt="thumb"
                      onClick={() => setCarouselIndex(idx)}
                      className={`w-14 h-14 object-cover rounded-md cursor-pointer border transition ${
                        carouselIndex === idx
                          ? "border-amber-600 scale-105"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Info */}
              <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">
                {quickViewProduct.name}
              </h3>
              <p className="text-amber-600 font-semibold mt-1">
                ${quickViewProduct.price.toFixed(2)}
              </p>

              {/* Scrollable Description */}
              <div className="mt-3 max-h-32 overflow-y-auto pr-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t pt-2">
                {quickViewProduct.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: quickViewProduct.description,
                    }}
                  />
                ) : (
                  <p>No description available.</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleAddToCart(quickViewProduct)}
                  className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="flex-1 border py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  ✖️ Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Animated Sticky Bottom Bar (Mobile Only) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            key="sticky-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="fixed md:hidden bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center z-50 shadow-xl"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Price</span>
              <span className="text-lg font-semibold text-amber-600">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition w-1/2"
            >
              🛒 Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
