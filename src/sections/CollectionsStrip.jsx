import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CollectionsStrip({ collections = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        🌟 Featured Collections
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {collections.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link
              to={`/collections/${c.slug}`}
              className="group block rounded-xl overflow-hidden shadow-md hover:shadow-xl bg-white dark:bg-gray-800 transition"
            >
              {/* Image */}
              <div
                className="h-44 bg-cover bg-center transform group-hover:scale-105 transition duration-500"
                style={{
                  backgroundImage: `url(${c.image || "/collection-placeholder.jpg"})`,
                }}
              />

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 transition">
                  {c.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {c.count || 0} items
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
