import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-amber-600">Aura Decore</h2>
          <p className="mt-3 text-sm">
            Elevate your space with timeless elegance. Premium home décor at your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-amber-600">Home</Link></li>
            <li><Link to="/collections" className="hover:text-amber-600">Collections</Link></li>
            <li><Link to="/admin/login" className="hover:text-amber-600">Admin</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-amber-600 transition">Contact Us</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-amber-600 transition">Shipping & Returns</Link></li>
            <li><Link to="/faqs" className="hover:text-amber-600 transition">FAQs</Link></li>
          </ul>
        </div>
        {/* <div>
          <h3 className="font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-amber-600">Contact Us</a></li>
            <li><a href="#" className="hover:text-amber-600">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-amber-600">FAQs</a></li>
          </ul>
        </div> */}

        {/* Socials */}
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-amber-600"><FaFacebook /></a>
            <a href="#" className="hover:text-amber-600"><FaTwitter /></a>
            <a href="#" className="hover:text-amber-600"><FaInstagram /></a>
            <a href="#" className="hover:text-amber-600"><FaPinterest /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-6 py-4 text-center text-sm">
        © {new Date().getFullYear()} Aura Decore. All rights reserved.
      </div>
    </footer>
  );
}
