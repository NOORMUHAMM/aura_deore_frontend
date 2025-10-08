import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage"; // ✅ detail view
import ProductDetails from "./pages/ProductDetails";
import { API_BASE, fetchJSON } from "./utils/api";
import Footer from "./components/Footer";
import ContactUs from "./pages/ContactUs";
import ShippingReturns from "./pages/ShippingReturns";
import FAQs from "./pages/FAQs";

// Admin imports
import { isLoggedIn } from "./utils/auth";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/products/ProductList";
import Collections from "./admin/collections/CollectionList";
import Discounts from "./admin/discounts/DiscountList";

// ✅ Wrapper for protected routes
function RequireAuth({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  const [initial, setInitial] = useState({ collections: [], deals: [] });

  useEffect(() => {
    const load = async () => {
      const collections = await fetchJSON(`${API_BASE}/collections`, []);
      const deals = await fetchJSON(`${API_BASE}/deals`, []);
      setInitial({ collections: collections || [], deals: deals || [] });
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <div className="flex-1">
      <Routes>
        {/* Public site */}
        <Route
          path="/"
          element={
            <>
              <TopNav />
              <HomePage initial={initial} />
            </>
          }
        />
        <Route
          path="/collections"
          element={
            <>
              <TopNav />
              <CollectionsPage />
            </>
          }
        />
        <Route
          path="/collections/:slug"
          element={
            <>
              <TopNav />
              <CollectionDetailPage /> {/* ✅ dedicated page */}
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <TopNav />
              <ProductDetails />
            </>
          }
        />
           <Route path="/contact" element={ <><TopNav /> <ContactUs /></>} />
        <Route path="/shipping-returns" element={<><TopNav /><ShippingReturns /></>} />
        <Route path="/faqs" element={<><TopNav /><FAQs /> </>} />

        {/* Admin site */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="collections" element={<Collections />} />
          <Route path="discounts" element={<Discounts />} />
          
        </Route>
     
      </Routes>
      </div>
      <Footer />
    </div>
  );
}
