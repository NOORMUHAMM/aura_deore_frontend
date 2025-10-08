import React from "react";

export default function FAQs() {
  const faqs = [
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 5–10 business days depending on your location.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes! We ship worldwide. Shipping costs are calculated at checkout.",
    },
    {
      q: "Can I return or exchange an item?",
      a: "Yes. Returns are accepted within 7 days if the item is unused and in its original packaging.",
    },
    {
      q: "How can I track my order?",
      a: "Once shipped, you’ll receive an email with a tracking number and link.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">FAQs</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b pb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{faq.q}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
