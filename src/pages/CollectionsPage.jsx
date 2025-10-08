import React, { useState } from "react";
import ProductsGrid from "../sections/ProductsGrid";
import Filters from "../ui/Filters";

export default function CollectionsPage() {
  const [query, setQuery] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        {/* <aside className="hidden md:block bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg h-fit sticky top-20">
          <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
            🧩 Filters
          </h3>
          <Filters query={query} onChange={setQuery} />
        </aside> */}

        {/* Products */}
        <div className="md:col-span-4">
          <ProductsGrid query={query} />
        </div>
      </div>
    </div>
  );
}
