import React from "react";

export default function ShippingReturns() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Shipping & Returns</h1>

      <section className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          We process all orders within <strong>2-4 business days</strong>. 
          Once your order ships, you’ll receive a tracking link via email.
        </p>

        <h3 className="text-xl font-semibold mt-6">Shipping</h3>
        <p>
          - Standard shipping: 5–10 business days.  
          - Express shipping: 2–5 business days.
        </p>

        <h3 className="text-xl font-semibold mt-6">Returns</h3>
        <p>
          Returns are accepted within <strong>7 days</strong> of delivery. 
          Items must be unused and in original packaging.
        </p>

        <p>
          To initiate a return, please contact our support team at  
          <span className="text-amber-600"> support@auradecore.com</span>.
        </p>
      </section>
    </div>
  );
}
