import React, { useState } from "react";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Contact Us</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Have a question or need support? We’d love to hear from you!  
        Please fill out the form below, and our team will get back to you as soon as possible.
      </p>

      {!submitted ? (
        <form
          action="https://formspree.io/f/mkgqorvp"  // ✅ Your working Formspree endpoint
          method="POST"
          onSubmit={() => setSubmitted(true)}
          className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <input
            type="text"
            name="subject"
            placeholder="Subject (optional)"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <textarea
            name="message"
            rows="5"
            required
            placeholder="Your Message..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          ></textarea>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            ✉️ Send Message
          </button>
        </form>
      ) : (
        <div className="text-center bg-green-100 dark:bg-green-900/40 p-8 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
            ✅ Message Sent Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Thank you for reaching out. We'll get back to you soon!
          </p>
        </div>
      )}
    </div>
  );
}
