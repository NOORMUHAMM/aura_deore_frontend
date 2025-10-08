// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// import CartDrawer from "./CartDrawer"; // ✅ Import the Cart Drawer

// export default function TopNav() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [cartCount, setCartCount] = useState(0);
//   const { theme, toggleTheme } = useTheme();

//   // ✅ Update cart count dynamically
//   useEffect(() => {
//     const updateCartCount = () => {
//       const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//       const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
//       setCartCount(totalItems);
//     };

//     updateCartCount();
//     window.addEventListener("storage", updateCartCount);
//     const interval = setInterval(updateCartCount, 1000); // fallback sync

//     return () => {
//       window.removeEventListener("storage", updateCartCount);
//       clearInterval(interval);
//     };
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <AnimatePresence>
//       <motion.header
//         key={scrolled ? "scrolled" : "top"}
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className={`fixed top-0 left-0 w-full z-50 transition ${
//           scrolled
//             ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100"
//             : "bg-transparent text-white"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           {/* Logo */}
//           <Link
//             to="/"
//             className={`text-2xl font-bold ${
//               scrolled ? "text-amber-600" : "text-white"
//             }`}
//           >
//             Aura Decore
//           </Link>

//           {/* Desktop Menu */}
//           <nav className="hidden md:flex items-center gap-6 font-medium">
//             <Link to="/" className="hover:text-amber-500">
//               Home
//             </Link>
//             <Link to="/collections" className="hover:text-amber-500">
//               Collections
//             </Link>
//             <Link to="/admin/login" className="hover:text-amber-500">
//               Admin
//             </Link>

//             {/* Theme toggle */}
//             <button
//               onClick={toggleTheme}
//               className="px-3 py-1 rounded border hover:bg-amber-600 hover:text-white transition"
//             >
//               {theme === "light" ? "🌙 Dark" : "☀️ Light"}
//             </button>

//             {/* 🛒 Cart Icon */}
//             <button
//               onClick={() => setCartOpen(true)}
//               className="relative flex items-center justify-center ml-4"
//             >
//               <span
//                 className={`text-2xl ${
//                   scrolled ? "text-amber-600" : "text-white"
//                 }`}
//               >
//                 🛒
//               </span>
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </nav>

//           {/* Mobile Menu button */}
//           <button
//             className="md:hidden flex flex-col gap-1.5 focus:outline-none"
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             <span
//               className={`w-6 h-0.5 ${scrolled ? "bg-black" : "bg-white"}`}
//             ></span>
//             <span
//               className={`w-6 h-0.5 ${scrolled ? "bg-black" : "bg-white"}`}
//             ></span>
//             <span
//               className={`w-6 h-0.5 ${scrolled ? "bg-black" : "bg-white"}`}
//             ></span>
//           </button>
//         </div>
//       </motion.header>

//       {/* ✅ Cart Drawer Component */}
//       <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
//     </AnimatePresence>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../context/ThemeContext";
// import CartDrawer from "./CartDrawer"; // ✅ Import your Cart Drawer

// export default function TopNav() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [cartOpen, setCartOpen] = useState(false); // ✅ Drawer toggle
//   const { theme, toggleTheme } = useTheme();
//   const [cartCount, setCartCount] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);

//     // ✅ Load cart count from localStorage
//     const updateCartCount = () => {
//       const cart = JSON.parse(localStorage.getItem("cart") || "[]");
//       const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
//       setCartCount(total);
//     };

//     updateCartCount();
//     window.addEventListener("storage", updateCartCount); // Sync across tabs
//     const interval = setInterval(updateCartCount, 1000); // Small polling

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("storage", updateCartCount);
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <AnimatePresence>
//       <motion.header
//         key={scrolled ? "scrolled" : "top"}
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -50 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className={`fixed top-0 left-0 w-full z-50 transition ${
//           scrolled
//             ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100"
//             : "bg-transparent text-white"
//         }`}
//       >
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           {/* Logo */}
//           <Link
//             to="/"
//             className={`text-2xl font-bold ${
//               scrolled ? "text-amber-600" : "text-white"
//             }`}
//           >
//             Aura Decore
//           </Link>

//           {/* Desktop Menu */}
//           <nav className="hidden md:flex items-center gap-6 font-medium">
//             <Link to="/" className="hover:text-amber-500">
//               Home
//             </Link>
//             <Link to="/collections" className="hover:text-amber-500">
//               Collections
//             </Link>
//             <Link to="/admin/login" className="hover:text-amber-500">
//               Admin
//             </Link>

//             {/* Theme toggle */}
//             <button
//               onClick={toggleTheme}
//               className="px-3 py-1 rounded border hover:bg-amber-600 hover:text-white transition"
//             >
//               {theme === "light" ? "🌙 Dark" : "☀️ Light"}
//             </button>

//             {/* 🛒 Cart Button */}
//             <button
//               onClick={() => setCartOpen(true)}
//               className="relative px-3 py-1 rounded hover:text-amber-500 transition"
//             >
//               🛒
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </button>
//           </nav>

//           {/* Mobile Menu button */}
//           <div className="flex items-center gap-4 md:hidden">
//             {/* 🛒 Cart Button (Mobile) */}
//             <button
//               onClick={() => setCartOpen(true)}
//               className="relative focus:outline-none"
//             >
//               🛒
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
//                   {cartCount}
//                 </span>
//               )}
//             </button>

//             {/* Hamburger Menu */}
//             <button
//               className="flex flex-col gap-1.5 focus:outline-none"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               <span
//                 className={`w-6 h-0.5 ${
//                   scrolled ? "bg-black" : "bg-white"
//                 } transition`}
//               ></span>
//               <span
//                 className={`w-6 h-0.5 ${
//                   scrolled ? "bg-black" : "bg-white"
//                 } transition`}
//               ></span>
//               <span
//                 className={`w-6 h-0.5 ${
//                   scrolled ? "bg-black" : "bg-white"
//                 } transition`}
//               ></span>
//             </button>
//           </div>
//         </div>
//       </motion.header>

//       {/* ✅ Cart Drawer Integration */}
//       <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
//     </AnimatePresence>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import CartDrawer from "./CartDrawer";

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const overlayRef = useRef(null);

  const isHomePage = location.pathname === "/";

  // Keep cart count in sync
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    const interval = setInterval(updateCartCount, 1000);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Detect scroll for color change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  // Dynamic styling logic
  // ✅ Dynamic styling logic (fixed for dark mode)
  const showTransparent = isHomePage && !scrolled;
  const textColor = showTransparent
    ? "text-white"
    : "text-gray-900 dark:text-gray-100";
  const headerBg = showTransparent
    ? "bg-transparent"
    : "bg-white dark:bg-gray-900 shadow";

  return (
    <>
      <AnimatePresence>
        <motion.header
          key={showTransparent ? "transparent" : "solid"}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className={`text-2xl font-bold ${
                showTransparent ? "text-white" : "text-amber-600"
              }`}
            >
              Aura Decore
            </Link>

            {/* Desktop Nav */}
            <nav
              className={`hidden md:flex items-center gap-6 font-medium ${textColor}`}
            >
              <Link to="/" className={`hover:text-amber-500 ${textColor}`}>
                Home
              </Link>
              <Link
                to="/collections"
                className={`hover:text-amber-500 ${textColor}`}
              >
                Collections
              </Link>
              <Link
                to="/admin/login"
                className={`hover:text-amber-500 ${textColor}`}
              >
                Admin
              </Link>

              {/* <button
                onClick={toggleTheme}
                className={`px-3 py-1 rounded border ${
                  showTransparent
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : "border-gray-300 text-black hover:bg-amber-600 hover:text-white"
                } transition`}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button> */}
              <button
                onClick={toggleTheme}
                className={`px-3 py-1 rounded border transition ${
                  showTransparent
                    ? "border-white text-white hover:bg-white hover:text-black"
                    : theme === "dark"
                    ? "border-gray-700 text-gray-100 hover:bg-amber-600 hover:text-white"
                    : "border-gray-300 text-gray-900 hover:bg-amber-600 hover:text-white"
                }`}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="relative px-3 py-1 rounded hover:text-amber-500 transition"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile Controls */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setCartOpen(true)}
                className="relative"
                aria-label="Open cart"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Burger */}
              <button
                className="flex flex-col gap-1.5 p-2"
                onClick={() => setMenuOpen((s) => !s)}
                aria-expanded={menuOpen}
              >
                <span
                  className={`w-6 h-0.5 transition-transform ${
                    menuOpen ? "rotate-45 translate-y-1.5" : ""
                  } ${showTransparent ? "bg-white" : "bg-black"}`}
                />
                <span
                  className={`w-6 h-0.5 transition-opacity ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  } ${showTransparent ? "bg-white" : "bg-black"}`}
                />
                <span
                  className={`w-6 h-0.5 transition-transform ${
                    menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  } ${showTransparent ? "bg-white" : "bg-black"}`}
                />
              </button>
            </div>
          </div>
        </motion.header>
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={(e) => {
              if (e.target === overlayRef.current) setMenuOpen(false);
            }}
          >
            <motion.div
              initial={{ y: "-10%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-10%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="absolute top-0 right-0 left-0 mt-16 mx-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Menu
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-600 dark:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Home
                  </Link>
                  <Link
                    to="/collections"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Collections
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={() => setMenuOpen(false)}
                    className="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Admin
                  </Link>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800 mt-3">
                    <button
                      onClick={() => toggleTheme()}
                      className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                    <button
                      onClick={() => {
                        setCartOpen(true);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left mt-2 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      View Cart {cartCount > 0 ? `(${cartCount})` : ""}
                    </button>
                  </div>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
