/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { CategoryRail } from './components/home/CategoryRail';
import { DealsBanner } from './components/home/DealsBanner';
import { ProductGrid } from './components/product/ProductGrid';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { CustomerDashboard } from './components/account/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffWorkspace } from './components/staff/StaffWorkspace';
import { AuthModal } from './components/auth/AuthModal';
import { Check } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, toastMessage } = useStore();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem('freshmart-theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('freshmart-theme', theme); } catch { /* storage may be unavailable */ }
  }, [theme]);

  return (
    <div className="macos-app min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans relative selection:bg-emerald-100 selection:text-emerald-900">
      <button type="button" className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        {theme === 'light' ? '☾' : '☀'} <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
      
      {/* Toast Notification Micro-Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {currentView === 'storefront' ? (
        <>
          {/* Floating Sticky Glass Navbar */}
          <Navbar />

          {/* Main Storefront Content */}
          <main className="flex-1">
            <Hero />
            <CategoryRail />
            <DealsBanner />
            <ProductGrid />
          </main>

          {/* Supermarket Editorial Footer */}
          <Footer />
        </>
      ) : currentView === 'staff' ? (
        /* Dedicated Staff Task & Works Done Workspace */
        <StaffWorkspace />
      ) : (
        /* Supermarket Operations & Fulfillment Admin View */
        <AdminDashboard />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Multi-step Checkout Flow */}
      <CheckoutModal />

      {/* Live Order Timeline Tracking */}
      <OrderTrackingModal />

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Customer "My FreshMart" Account Modal */}
      <CustomerDashboard />

      {/* Authentication Gate Modal (Google OAuth & Email) */}
      <AuthModal />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
