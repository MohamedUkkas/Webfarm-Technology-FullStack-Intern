import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Leaf, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Hero: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mac-hero-section relative pt-5 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mac-hero relative rounded-3xl bg-gradient-to-b from-stone-100/90 to-stone-50 border border-stone-200/90 p-6 sm:p-10 lg:p-14 overflow-hidden shadow-sm group/hero">
        
        {/* Subtle background ambient warm light - no rainbow gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Supermarket kicker metadata - clean unboxed typography, no pill capsule, no dot */}
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Morning harvests in stock · 30-minute dispatch
            </div>

            {/* Main Editorial Title - Plus Jakarta Sans */}
            <div className="space-y-3">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.08]">
                Fresh groceries.<br />
                <span className="text-emerald-800">Delivered simply.</span>
              </h1>
              <p className="text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Handpicked farm produce, artisan sourdough, organic dairy, and weekly kitchen staples. From local growers directly to your table.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={scrollToCatalog}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-[.98] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 group"
              >
                <span>Shop groceries</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => {
                  const dealsEl = document.getElementById('deals-section');
                  if (dealsEl) dealsEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-medium text-sm hover:-translate-y-0.5 hover:shadow-md active:scale-[.98] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                <span>Today's fresh deals</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                  Up to 30% off
                </span>
              </button>
            </div>

            {/* Supermarket Trust Highlights */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-3 sm:gap-6 text-stone-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">30-min express slot</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">100% farm origin</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Freshness guaranteed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Supermarket Real Imagery Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Grocery Photo */}
              <div className="hero-image relative rounded-2xl overflow-hidden shadow-lg border border-stone-200/80 bg-stone-100 aspect-4/3 sm:aspect-5/4">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh organic market produce"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/hero:scale-[1.035]"
                />
                
                {/* Floating Glass Quality Badge */}
                <div className="absolute bottom-4 left-4 right-4 glass-pill rounded-xl p-3 flex items-center justify-between text-stone-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Daily Morning Inspection</div>
                      <div className="text-[11px] text-stone-600">Zero wilted greens, chilled transit</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800">Verified</span>
                </div>
              </div>

              {/* Floating Mini Produce Card */}
              <div className="hero-float hidden sm:flex absolute -top-5 -left-5 bg-white p-3 rounded-2xl border border-stone-200 shadow-md items-center gap-3 max-w-[200px]">
                <img
                  src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=150&q=80"
                  alt="Avocado"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900">Hass Avocados</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">?335 / 3 pcs</div>
                </div>
              </div>

              {/* Delivery Guarantee Badge */}
              <div className="hero-float hero-float-delay hidden sm:flex absolute -bottom-4 -right-4 bg-white py-2 px-3.5 rounded-xl border border-stone-200 shadow-md items-center text-xs font-semibold text-stone-800">
                <span>Active Chennai Delivery Fleet</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
