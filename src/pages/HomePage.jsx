import React, { useEffect, useState, useRef } from "react";
import { fetchJSON, API_BASE, imageUrl } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { useQuery } from "@tanstack/react-query";



export default function HomePage({ onAddToCart }) {
  const [deals, setDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);



  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [quickView, setQuickView] = useState(null);
  const [toast, setToast] = useState(null);
  const [discount, setDiscount] = useState([]);
  const [activeDealKey, setActiveDealKey] = useState(null);
  const [discountProducts, setDiscountProducts] = useState([]);
  const scrollRef = useRef(null); // hot-deals auto-scroll container
  const carouselRef = useRef(null); // sticky carousel wrapper
  const carouselTrackRef = useRef(null); // the overflow-x element (scrollable)
  const pauseRef = useRef(false);
  const stopRef = useRef(false);
  const toastTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchJSON(`${API_BASE}/deals`, []).then((d) => {
  //     setDeals(Array.isArray(d) ? d : d.items ?? d ?? []);
  //   });

  //   fetchJSON(`${API_BASE}/discounts`, []).then((d) => {
  //     setDiscount(d)
  //   });
  //   fetchJSON(`${API_BASE}/products?limit=200`, { items: [] }).then((data) => {
  //     const items = data.items || data || [];
  //     setProducts(items);
  //     setFilteredProducts(items);
  //   });

  //   return () => clearTimeout(toastTimeoutRef.current);
  // }, []);

  // auto-scroll hot deals row
  // useEffect(() => {
  //   setLoadingDeals(true);
  //   setLoadingProducts(true);

  //   fetchJSON(`${API_BASE}/deals`, [])
  //     .then((d) => setDeals(Array.isArray(d) ? d : d.items ?? d ?? []))
  //     .finally(() => setLoadingDeals(false));

  //   fetchJSON(`${API_BASE}/discounts`, []).then((d) => setDiscount(d));

  //   fetchJSON(`${API_BASE}/products?limit=200`, { items: [] })
  //     .then((data) => {
  //       const items = data.items || data || [];
  //       setProducts(items);
  //       setFilteredProducts(items);
  //     })
  //     .finally(() => setLoadingProducts(false));

  //   return () => clearTimeout(toastTimeoutRef.current);
  // }, []);

  // ✅ React Query hooks (renamed to avoid name conflicts)
  const { data: dealsData = [], isLoading: dealsLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const d = await fetchJSON(`${API_BASE}/deals`, []);
      return Array.isArray(d) ? d : d.items ?? d ?? [];
    },
    staleTime: 5 * 60 * 1000,  // 5 min
    cacheTime: 15 * 60 * 1000, // 15 min

  });

  const { data: discountsData = [], isLoading: discountsLoading } = useQuery({
    queryKey: ["discounts"],
    queryFn: async () => fetchJSON(`${API_BASE}/discounts`, []),
    staleTime: 5 * 60 * 1000,  // 5 min
    cacheTime: 15 * 60 * 1000, // 15 min

  });

  const { data: productsData = { items: [] }, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => fetchJSON(`${API_BASE}/products?limit=200`, { items: [] }),
    staleTime: 5 * 60 * 1000,  // 5 min
    cacheTime: 15 * 60 * 1000, // 15 min

  });
  useEffect(() => {
    const items = productsData.items || productsData || [];
    setProducts(items);
    setFilteredProducts(items);
    setDeals(dealsData);
    setDiscount(discountsData);
  }, [productsData, dealsData, discountsData]);



  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    stopRef.current = false;
    let scrollAmount = 0;
    const speed = 0.6;
    let raf;
    const step = () => {
      if (stopRef.current) return;
      if (!pauseRef.current && el.scrollWidth > el.clientWidth) {
        scrollAmount += speed;
        if (scrollAmount >= el.scrollWidth - el.clientWidth) scrollAmount = 0;
        el.scrollLeft = Math.round(scrollAmount);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      stopRef.current = true;
      cancelAnimationFrame(raf);
    };
  }, [deals]);

  // parse discount helper
  // const parseDiscount = (val) => {
  //   if (val == null) return NaN;
  //   if (typeof val === "number") return val;
  //   if (typeof val === "string") {
  //     const m = val.match(/-?\d+/);
  //     return m ? Number(m[0]) : NaN;
  //   }
  //   if (typeof val === "object") {
  //     if (Array.isArray(val) && val.length) return parseDiscount(val[0]);
  //     const keys = ["value", "amount", "percentage", "percent", "discount"];
  //     for (const k of keys) if (k in val) return parseDiscount(val[k]);
  //   }
  //   return NaN;
  // };
  const parseDiscount = (val) => {
    if (val == null) return NaN;

    if (typeof val === "number") return val;

    if (typeof val === "string") {
      const m = val.match(/(\d+(\.\d+)?)/); // capture number even in messy text
      return m ? Number(m[1]) : NaN;
    }

    if (typeof val === "object") {
      if (Array.isArray(val) && val.length) return parseDiscount(val[0]);
      for (const key of Object.keys(val)) {
        const nested = parseDiscount(val[key]);
        if (!isNaN(nested)) return nested;
      }
    }

    return NaN;
  };


  const computeProductDiscount = (p) => {
    const explicit = parseDiscount(p?.discount ?? p?.off ?? p?.salePercent);
    if (!isNaN(explicit)) return Math.round(explicit);

    // try to infer from price + original price fields
    const priceKeys = ["price", "sellingPrice", "currentPrice", "amount", "salePrice"];
    const origKeys = ["compareAtPrice", "originalPrice", "mrp", "listPrice", "oldPrice", "previousPrice", "basePrice", "strikePrice", "compare_price"];

    let price = NaN;
    for (const k of priceKeys) {
      if (p && p[k] != null) {
        const v = Number(p[k]);
        if (!isNaN(v) && v > 0) {
          price = v;
          break;
        }
      }
    }
    if (isNaN(price) && p && p.price != null) {
      const v = Number(p.price);
      if (!isNaN(v) && v > 0) price = v;
    }
    if (isNaN(price)) return NaN;

    for (const k of origKeys) {
      if (p && p[k] != null) {
        const orig = Number(p[k]);
        if (!isNaN(orig) && orig > price) {
          const perc = ((orig - price) / orig) * 100;
          return Math.round(perc);
        }
      }
    }
    return NaN;
  };

  const showToast = (msg, ms = 2500) => {
    clearTimeout(toastTimeoutRef.current);
    setToast(msg);
    toastTimeoutRef.current = setTimeout(() => setToast(null), ms);
  };

  const handleAddToCart = (product) => {
    const success = addToCart(product, onAddToCart);
    if (success) showToast(`${product.name} added to cart 🛒`);
  };

  const GlowBorder = ({ theme = "light" }) => (
    <span
      className={`absolute inset-0 rounded-lg bg-gradient-to-r ${theme === "dark"
          ? "from-indigo-500 via-blue-400 to-purple-500"
          : "from-pink-500 via-amber-400 to-red-500"
        } bg-[length:200%_200%] animate-borderGlow opacity-80`}
      style={{
        maskImage: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "5px",
        backgroundClip: "border-box",
      }}
    />
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
  };

  // helper to make stable key for deals
  const dealKey = (deal, idx) => deal?._id ?? deal?.id ?? `deal-${idx}`;
  const handleDealClick = (deal, idx) => {
    const key = dealKey(deal, idx);

    // Collapse if same deal clicked again
    if (activeDealKey === key) {
      setActiveDealKey(null);
      setDiscountProducts([]);
      return;
    }

    setActiveDealKey(key);

    // Extract discount number from deal.subtitle or title
    const extractDiscount = (text) => {
      if (!text) return NaN;
      const match = String(text).match(/(\d+(\.\d+)?)/);
      return match ? Number(match[1]) : NaN;
    };

    const discNum =
      extractDiscount(deal?.discount) ||
      extractDiscount(deal?.subtitle) ||
      extractDiscount(deal?.title);

    // If we got a valid discount number, match products with similar discount
    if (!isNaN(discNum)) {
      const matched = products.filter((p) => {
        const pd = computeProductDiscount(p);
        const explicit = parseDiscount(p.discount ?? p.off ?? p.salePercent);
        const discountValue = !isNaN(explicit) ? explicit : pd;

        return !isNaN(discountValue) && Math.abs(discountValue - discNum) <= 3;
      });

      setDiscountProducts(matched);
      showToast(
        matched.length
          ? `Showing ${matched.length} products for ${discNum}% OFF 🎉`
          : `No products found for ${discNum}% OFF 😔`
      );

      setTimeout(() => {
        carouselTrackRef.current?.scrollTo?.({ left: 0, behavior: "smooth" });
        carouselRef.current?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
      }, 100);

      return;
    }

    // If no discount found in text, fallback to keyword match (rare)
    const keyword = (deal.title ?? deal.subtitle ?? "").toLowerCase();
    if (keyword.length >= 2) {
      const matched = products.filter(
        (p) =>
          p.name?.toLowerCase().includes(keyword) ||
          p.title?.toLowerCase().includes(keyword)
      );
      setDiscountProducts(matched);
      showToast(
        matched.length
          ? `Showing ${matched.length} matching products`
          : "No products found for this deal"
      );
      return;
    }

    // No match
    setDiscountProducts([]);
    showToast("No products found for this deal 😔");
  };



  // ===== FIXED: robust manual scroll for sticky carousel =====
  const getScrollableTrack = () => {
    // prefer the explicit ref
    let el = carouselTrackRef.current;
    if (el && el.scrollWidth > el.clientWidth + 1) return el;

    // fallback: search inside carouselRef for the first element that scrolls horizontally
    if (carouselRef.current) {
      const candidates = carouselRef.current.querySelectorAll("*");
      for (const c of candidates) {
        if (c.scrollWidth && c.clientWidth && c.scrollWidth > c.clientWidth + 1) return c;
      }
    }
    return null;
  };

  const scrollCarousel = (dir = "right") => {
    const el = getScrollableTrack();
    if (!el) return;
    // determine offset: 70% of visible width or at least 220px
    const offset = Math.max(220, Math.floor(el.clientWidth * 0.7));
    const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const target = dir === "right" ? el.scrollLeft + offset : el.scrollLeft - offset;
    const newLeft = Math.max(0, Math.min(maxLeft, target));
    el.scrollTo({ left: newLeft, behavior: "smooth" });
  };

  // autoplay carousel for sticky products (pauses on hover/touch)
  useEffect(() => {
    if (!activeDealKey) return;
    const el = carouselTrackRef.current;
    if (!el || (discountProducts?.length || 0) === 0) return;

    // cancel previous
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let last = performance.now();
    const speedPxPerSec = 40; // change speed here
    const step = (time) => {
      rafRef.current = requestAnimationFrame(step);
      if (carouselTrackRef.current == null || carouselTrackRef.current.scrollWidth <= carouselTrackRef.current.clientWidth) return;
      if (pauseRef.current) return; // if whole page hover/interaction pause
      // local pause for carousel
      if (carouselRef.current && carouselRef.current.matches(":hover")) return;
      const dt = (time - last) / 1000;
      last = time;
      const delta = speedPxPerSec * dt;
      const track = carouselTrackRef.current;
      track.scrollLeft += delta;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
        track.scrollLeft = 0;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [activeDealKey, discountProducts]);

  return (
    <div className="p-0 bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors overflow-x-hidden">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div key="toast" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.25 }} className="fixed bottom-6 right-6 bg-amber-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold text-sm">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative h-[500px] bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 text-white flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center px-6">
          <motion.h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-yellow-300 animate-gradient-flow" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}>
            The Aura Decore
          </motion.h1>
          <p className="mt-4 text-lg md:text-xl text-gray-100">Elevate Your Space with Timeless Elegance ✨</p>

          <motion.a href="#hot-deals" className="relative inline-block mt-8 px-6 py-3 font-semibold rounded-lg text-white overflow-hidden" whileHover={{ scale: 1.05 }}>
            <GlowBorder />
            <span className="relative z-10">🔥 See Hot Deals</span>
          </motion.a>
        </motion.div>
      </section>

      {/* Hot Deals Row */}
      <section id="hot-deals" className="relative bg-gradient-to-r from-amber-500 via-red-500 to-pink-500 dark:from-amber-600 dark:via-red-700 dark:to-pink-800 py-16 px-6 my-16 shadow-2xl overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <motion.h2 animate={{ y: [0, -6, 0] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} className="text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-lg mb-4">
            🔥 Hot Deals of the Day
          </motion.h2>

          <p className="text-white/90 max-w-2xl mx-auto text-center mb-12">Click a deal to view a sticky mini-carousel of matched products below.</p>

          <div ref={scrollRef} onMouseEnter={() => (pauseRef.current = true)} onMouseLeave={() => (pauseRef.current = false)} onTouchStart={() => (pauseRef.current = true)} onTouchEnd={() => (pauseRef.current = false)} className="grid grid-cols-1 gap-6 md:flex md:gap-6 md:overflow-x-auto md:items-start no-scrollbar scroll-smooth pb-4">
            {dealsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-gray-900 rounded-xl shadow-lg md:min-w-[300px] p-6"
                //  className="skeleton h-6 w-1/2 ..." 
                >

                  <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))
              : deals.map((d, i) => {
                const key = dealKey(d, i);
                const isActive = activeDealKey === key;
                return (
                  <motion.div key={key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, type: "spring", stiffness: 90 }} viewport={{ once: true }} onClick={() => handleDealClick(d, i)} className={`relative group bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform md:min-w-[300px] cursor-pointer ${isActive ? "ring-4 ring-amber-400" : ""}`}>
                    {d.discount && <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce">-{d.discount}%</span>}

                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 line-clamp-1">{d.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{d.subtitle}</p>

                      <motion.div className="relative inline-block mt-4 px-5 py-2 rounded-lg text-white font-semibold overflow-hidden" whileHover={{ scale: 1.05 }}>
                        <GlowBorder theme="light" />
                        <span className="relative z-10">View {d.discount} OFF →</span>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* sticky mini-carousel below deals */}
          <div ref={carouselRef} className="mt-6">
            <AnimatePresence>
              {activeDealKey && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }} className="sticky top-6 z-40 bg-white/80 dark:bg-gray-900/80 rounded-xl p-4 shadow-inner">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {discountProducts.length ? `${discountProducts.length} Product${discountProducts.length > 1 ? "s" : ""}` : "No matching products"}
                    </h3>

                    <div className="flex items-center gap-2">
                      <button onClick={() => { setActiveDealKey(null); setDiscountProducts([]); }} className="text-sm text-gray-600 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">Close</button>

                      <button onClick={(e) => { e.stopPropagation(); scrollCarousel("left"); }} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Scroll left">◀</button>

                      <button onClick={(e) => { e.stopPropagation(); scrollCarousel("right"); }} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Scroll right">▶</button>
                    </div>
                  </div>

                  <div ref={carouselTrackRef} className="overflow-x-auto no-scrollbar" onMouseEnter={() => (pauseRef.current = true)} onMouseLeave={() => (pauseRef.current = false)} onTouchStart={() => (pauseRef.current = true)} onTouchEnd={() => (pauseRef.current = false)} style={{ WebkitOverflowScrolling: "touch" }}>
                    <div className="flex gap-4 pb-2">
                      {discountProducts.length === 0 ? (
                        <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">No matching products found for this deal.</div>
                      ) : (
                        discountProducts.map((p) => (
                          <motion.div key={p._id ?? p.id} className="min-w-[220px] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex-shrink-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                            <img src={imageUrl(p.images?.[0]) || "/prod-placeholder.jpg"} alt={p.name} className="w-full h-36 object-cover" />
                            <div className="p-3">
                              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{p.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">${p.price?.toFixed(2)}</p>
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <button onClick={() => navigate(`/product/${p._id ?? p.id}`)} className="text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition">View</button>
                                <div className="flex gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }} className="text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition">🛒</button>
                                  <button onClick={(e) => { e.stopPropagation(); setQuickView(p); }} className="text-sm border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition">👁</button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2 animate={{ y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-pink-400 animate-gradient-flow">
          ✨ Featured Products
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsLoading ? (
            // 🩶 Skeleton loader shown while products load
            [...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-72 rounded-xl"></div>
            ))
          ) : filteredProducts.slice(0, visibleCount).map((p, i) => (
            <motion.div key={p._id ?? p.id} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} transition={{ delay: i * 0.05 }} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all" whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 100, damping: 10 } }}>
              <div className="relative">
                <img src={imageUrl(p.images?.[0]) || "/prod-placeholder.jpg"} alt={p.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" />
                <button onClick={() => setQuickView(p)} className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm px-4 py-2 rounded">👁 Quick View</button>
              </div>

              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">{p.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{p.title || "No description available."}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-amber-600 text-base">${p.price?.toFixed(2)}</span>
                  <motion.button onClick={() => navigate(`/product/${p._id ?? p.id}`)} className="text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 dark:hover:bg-amber-500 transition" whileHover={{ scale: 1.05 }}>
                    View →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-10">
            <motion.button onClick={() => setVisibleCount((v) => v + 12)} className="relative px-6 py-2 rounded-lg text-white font-semibold overflow-hidden" whileHover={{ scale: 1.05 }}>
              <GlowBorder theme="light" />
              <span className="relative z-10">View More ↓</span>
            </motion.button>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full relative shadow-xl" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: "spring", stiffness: 120 }}>
              <button onClick={() => setQuickView(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
              <img src={imageUrl(quickView.images?.[0]) || "/prod-placeholder.jpg"} alt={quickView.name} className="w-full h-64 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{quickView.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{quickView.title}</p>
              <p className="mt-4 text-amber-600 font-bold text-lg">${quickView.price?.toFixed(2)}</p>

              <div className="mt-6 flex gap-3">
                <motion.button onClick={() => { handleAddToCart(quickView); setQuickView(null); }} className="relative flex-1 text-white py-2 rounded-lg font-semibold overflow-hidden" whileHover={{ scale: 1.05 }}>
                  <GlowBorder theme="light" />
                  <span className="relative z-10">🛒 Add to Cart</span>
                </motion.button>

                <button onClick={() => navigate(`/product/${quickView._id ?? quickView.id}`)} className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  View Details →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
