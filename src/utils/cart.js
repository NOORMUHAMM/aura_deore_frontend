// src/utils/cart.js
export const addToCart = (product, onAddToCart) => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    if (onAddToCart) onAddToCart(product);
    return true; // success
  } catch (err) {
    console.error("Failed to add to cart:", err);
    return false;
  }
};
