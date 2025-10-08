import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeroBanner({ deals = [] }) {
  const active = deals.length
    ? deals[0]
    : {
        title: "✨ 50% Off Selected",
        subtitle: "Top deals on premium décor",
        cta: "/collections",
      };

  return (
    <section className="relative bg-gradient-to-r from-amber-100 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {active.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {active.subtitle}
          </p>
          <Link
            to={active.cta}
            className="inline-block mt-6 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg shadow hover:bg-amber-700 transition"
          >
            🛍️ Shop Deals
          </Link>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden md:block relative"
        >
          <div
            className="w-full h-72 bg-cover bg-center rounded-xl shadow-lg"
            style={{ backgroundImage: "url('/hero-decor.jpg')" }}
          />
          {/* floating glow effect */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        </motion.div>
      </div>
    </section>
  );
}
