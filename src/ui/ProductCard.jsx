import React from "react";

export default function ProductCard({ product, onOpen }) {
  const priceDisplay = (p) => (typeof p === "number" ? p.toFixed(2) : "0.00");
  const discountPrice = product?.discount
    ? product.price * (1 - product.discount / 100)
    : product?.price || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden group">
      {/* Product image */}
      <div className="h-52 w-full overflow-hidden relative">
        <img
          src={product?.imageUrl || product?.images?.[0] || "/prod-placeholder.jpg"}
          alt={product?.name || "Product"}
          className="h-52 w-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
          onClick={onOpen}
        />
        {/* Discount badge */}
        {product?.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-4">
        {/* Product name & title */}
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-lg">
          {product?.name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {product?.title}
        </p>

        {/* Price & discount */}
        <div className="mt-3 flex items-baseline gap-3">
          {product?.discount ? (
            <>
              <span className="text-gray-400 dark:text-gray-500 line-through">
                ${priceDisplay(product.price)}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">
                ${priceDisplay(discountPrice)}
              </span>
            </>
          ) : (
            <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              ${priceDisplay(product?.price || 0)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-between">
          <button
            onClick={onOpen}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm transition"
          >
            View
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
