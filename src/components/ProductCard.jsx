import React from "react";

export default function ProductCard({ product, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition overflow-hidden group"
    >
      {/* Product image with hover zoom + discount badge */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={product.imageUrl || "/prod-placeholder.jpg"}
          alt={product.name}
          className="h-52 w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {product.name}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
          {product.title}
        </p>

        {/* Price & Discount */}
        {product.discount ? (
          <div className="mt-3 flex items-baseline gap-2">
            <span className="line-through text-gray-400 dark:text-gray-500 text-sm">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">
              ${(product.discountedPrice || product.price).toFixed(2)}
            </span>
            <span className="ml-1 text-xs text-green-600 font-medium">
              {product.discount}% OFF
            </span>
          </div>
        ) : (
          <div className="mt-3 font-semibold text-gray-900 dark:text-gray-100 text-lg">
            ${product.price.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
