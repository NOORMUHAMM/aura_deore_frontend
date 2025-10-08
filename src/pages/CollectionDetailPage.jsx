import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductsGrid from "../sections/ProductsGrid";
import { fetchJSON, API_BASE, imageUrl } from "../utils/api";

export default function CollectionDetailPage() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJSON(`${API_BASE}/collections`, []);
        const found = data.find((c) => c.slug === slug);
        if (found) {
          setCollection({
            ...found,
            imageUrl: imageUrl(found.image),
          });
        }
      } catch (err) {
        console.error("Failed to load collection:", err);
      }
    };
    load();
  }, [slug]);

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300 px-6">
        <p className="text-gray-600 dark:text-gray-400 text-center animate-pulse">
          Loading collection...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-20 md:pt-24 lg:pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ✅ Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg group">
          {collection.imageUrl && (
            <img
              src={collection.imageUrl}
              alt={collection.title}
              className="w-full h-64 sm:h-72 md:h-96 object-cover transform group-hover:scale-105 transition duration-700 ease-in-out brightness-90"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end items-start p-4 sm:p-6 md:p-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg animate-fadeInUp leading-tight">
              {collection.title}
            </h1>
            <p className="mt-3 text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl animate-fadeIn delay-200 leading-relaxed">
              {collection.description ||
                "✨ Explore our curated collection of unique designs and products."}
            </p>
          </div>
        </div>

        {/* ✅ Products Section */}
        <div className="mt-10 sm:mt-12 animate-fadeInUp">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-5 sm:mb-6 text-gray-900 dark:text-gray-100 text-center sm:text-left">
            Products in {collection.title}
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 sm:p-6 md:p-8">
            <ProductsGrid query={{ collection: slug }} />
          </div>
        </div>
      </div>
    </div>
  );
}
