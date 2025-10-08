import React, { useEffect, useState, useCallback } from "react";
import { api, fetchJSON, imageUrl } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";

export default function ProductsGrid({ query = {} }) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch categories
  useEffect(() => {
    fetchJSON(api("/products/categories"), [])
      .then((cats) => setCategories(["All", ...cats]))
      .catch(() => setCategories(["All"]));
  }, []);

  // Reset products when category/filter changes
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [query?.collection, activeCategory]);

  // Load products
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const qs = `?page=${page}&limit=12${
          query?.collection ? `&collection=${encodeURIComponent(query.collection)}` : ""
        }${
          activeCategory && activeCategory !== "All"
            ? `&category=${encodeURIComponent(activeCategory)}`
            : ""
        }`;
        const data = await fetchJSON(api(`/products${qs}`), { items: [], total: 0 });
        if (!cancelled) {
          setProducts((prev) => (page === 1 ? data.items || [] : [...prev, ...(data.items || [])]));
          setHasMore((data.items || []).length >= 12);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page, query?.collection, activeCategory]);

  // Infinite scroll + scroll-to-top visibility
  const handleScroll = useCallback(() => {
    if (!hasMore || loading) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
      setPage((p) => p + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const onScroll = () => {
      handleScroll();
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // Add to cart
  const handleAddToCart = (product) => {
    const success = addToCart(product);
    if (success) {
      setCart((prev) => {
        const exists = prev.find((it) => it._id === product._id);
        if (exists) {
          return prev.map((it) =>
            it._id === product._id ? { ...it, qty: it.qty + 1 } : it
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });
      setToast(`🛒 "${product.name}" added to cart!`);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setIsFilterOpen(false);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    document.body.style.overflow = selectedProduct || isFilterOpen ? "hidden" : "auto";
  }, [selectedProduct, isFilterOpen]);

  const ProductSkeleton = () => (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm">
      <div className="h-44 sm:h-56 bg-gray-300 dark:bg-gray-700 rounded-t-2xl" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );

  const handleDragEnd = (e, info, images) => {
    if (!images || images.length <= 1) return;
    if (info.offset.x < -50) setCarouselIndex((i) => (i + 1) % images.length);
    else if (info.offset.x > 50) setCarouselIndex((i) => (i - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-20 md:pt-24 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100">
            ✨ Explore Our Products
          </h2>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden px-4 py-2 bg-amber-600 text-white rounded-full shadow hover:bg-amber-700 transition text-sm"
          >
            🧩 Filter
          </button>
        </div>

{/* MOBILE category scroller — responsive & compact */}
<div className="md:hidden mb-4 px-3">
  <div
    className="flex flex-wrap justify-center gap-3 sm:gap-4 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
  >
    {categories.map((cat, i) => (
      <motion.button
        whileTap={{ scale: 0.95 }}
        key={i}
        onClick={() => handleCategorySelect(cat)}
        className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full border transition-all duration-200 ${
          activeCategory === cat
            ? "bg-amber-600 border-amber-600 text-white shadow-md"
            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700"
        }`}
      >
        {cat}
      </motion.button>
    ))}
  </div>
</div>



        {/* Main Layout */}
        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 lg:gap-10">
  {/* Sidebar */}
  <aside className="hidden md:block bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24 max-h-[80vh] overflow-y-auto sidebar-scroll">
    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
      🧩 Categories
    </h3>
    <div className="flex flex-col gap-3">
      {categories.map((cat, i) => (
        <motion.button
          whileHover={{ scale: 1.02 }}
          key={i}
          onClick={() => handleCategorySelect(cat)}
          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-shadow ${
            activeCategory === cat
              ? "bg-amber-600 text-white shadow-lg border-amber-500"
              : "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  </aside>

  {/* Product Grid */}
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    ) : products.length === 0 ? (
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        🚫 No products found.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, idx) => (
          <motion.div
            key={p._id || p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <div className="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 border border-gray-100 dark:border-gray-700">
              <div className="relative">
                <img
                  src={imageUrl(p.images?.[0]) || "/prod-placeholder.jpg"}
                  alt={p.name}
                  className="w-full h-44 sm:h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {p.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    -{p.discount}%
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedProduct(p);
                    setCarouselIndex(0);
                  }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-amber-600 text-white rounded-full text-xs sm:text-sm transition"
                >
                  👁 Quick View
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {p.title || "Beautiful home décor piece."}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="font-bold text-amber-600 text-sm sm:text-base">
                    ${p.price?.toFixed(2)}
                  </span>
                  <button
                    onClick={() => navigate(`/product/${p._id || p.id}`)}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-full text-xs sm:text-sm hover:bg-amber-700 transition"
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>

  {/* ✨ Custom Scrollbar Styling */}
  <style>{`
    .sidebar-scroll::-webkit-scrollbar {
      width: 10px;
    }
    .sidebar-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #f59e0b, #b45309);
      border-radius: 10px;
      border: 2px solid transparent;
      background-clip: content-box;
      transition: all 0.3s ease;
    }
    .sidebar-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #fbbf24, #d97706);
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
    }
    .sidebar-scroll::-webkit-scrollbar-track {
      background: #fdf6e3;
      border-radius: 10px;
    }
    .dark .sidebar-scroll::-webkit-scrollbar-track {
      background: #1f2937;
    }
    .dark .sidebar-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #d97706, #92400e);
    }
  `}</style>
</div>

        
      </div>

      {/* ✅ Quick View Modal (Fully Preserved) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <motion.img
                  key={carouselIndex}
                  src={
                    imageUrl(
                      selectedProduct.images?.[carouselIndex] ||
                        selectedProduct.images?.[0]
                    ) || "/prod-placeholder.jpg"
                  }
                  alt={selectedProduct.name}
                  className="w-full h-64 sm:h-80 object-cover"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) =>
                    handleDragEnd(e, info, selectedProduct.images || [])
                  }
                />
                {selectedProduct.images?.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCarouselIndex(
                          (i) =>
                            (i - 1 + selectedProduct.images.length) %
                            selectedProduct.images.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() =>
                        setCarouselIndex(
                          (i) => (i + 1) % selectedProduct.images.length
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
                    >
                      ▶
                    </button>
                  </>
                )}
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedProduct.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ✖
                  </button>
                </div>
                <p className="mt-4 text-amber-600 text-lg font-semibold">
                  ${selectedProduct.price?.toFixed(2)}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate(`/product/${selectedProduct._id}`);
                    }}
                    className="flex-1 px-4 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-800 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-4 sm:right-6 bg-amber-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg text-sm font-medium z-50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
