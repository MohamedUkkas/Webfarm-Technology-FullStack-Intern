import React, { useState, useEffect } from 'react';
import { Tag, Clock, ArrowRight, Plus, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const DealsBanner: React.FC = () => {
  const { products, addToCart, cart, updateCartQuantity } = useStore();

  // Simulated countdown for supermarket daily fresh picks
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter deal products
  const dealProducts = products.filter(p => p.isDeal || p.discountPercent >= 18).slice(0, 3);

  return (
    <section id="deals-section" className="py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="deals-panel relative rounded-3xl bg-stone-900 text-white overflow-hidden p-6 sm:p-10 border border-stone-800 shadow-md">
        
        {/* Subtle warm glow accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-900/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Asymmetrical Editorial Deals Header */}
          <div className="lg:col-span-5 space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Today's Fresh Picks
            </div>

            <div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                Fresh pantry & produce <br />
                <span className="text-amber-400">up to 30% off.</span>
              </h2>
              <p className="text-stone-300 text-sm mt-3 leading-relaxed">
                Hand-harvested morning selections discounted for today only. Apply coupon <span className="font-mono bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded border border-stone-700">FRESH30</span> in your basket for additional savings.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-stone-300">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Price refresh in:</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-sm font-bold text-white">
                <span className="bg-stone-800 px-2 py-1 rounded-lg border border-stone-700">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-stone-800 px-2 py-1 rounded-lg border border-stone-700">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-stone-800 px-2 py-1 rounded-lg border border-stone-700">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const catalog = document.getElementById('catalog-section');
                  if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 group cursor-pointer"
              >
                <span>Browse all discounted market goods</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Curated Deal Item Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {dealProducts.map((product) => {
              const cartItem = cart.find(c => c.product.id === product.id);
              const qty = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={product.id}
                  className="deal-card bg-stone-800/90 rounded-3xl p-3.5 border border-stone-700/80 flex flex-col justify-between hover:border-emerald-500/60 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group shadow-lg shadow-black/10"
                >
                  <div>
                    {/* Deal Image Container */}
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <span className="absolute top-2 left-2 bg-amber-400 text-stone-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md">
                        {product.discountPercent}% OFF
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 font-medium">{product.brand}</div>
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                    <div className="text-[11px] text-stone-400 mt-0.5">{product.unit}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-700/60 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">₹{product.price.toFixed(2)}</div>
                      <div className="text-[11px] text-stone-400 line-through">₹{product.mrp.toFixed(2)}</div>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-emerald-800 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        <button aria-label={`Remove one ${product.name}`}
                          onClick={() => updateCartQuantity(product.id, qty - 1)}
                          className="hover:text-stone-300 px-1.5 py-1 active:scale-90 transition-transform"
                        >
                          −
                        </button>
                        <span>{qty}</span>
                        <button aria-label={`Add one ${product.name}`}
                          onClick={() => updateCartQuantity(product.id, qty + 1)}
                          className="hover:text-stone-300 px-1.5 py-1 active:scale-90 transition-transform"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2.5 rounded-full bg-amber-400 text-stone-950 hover:bg-amber-300 hover:scale-110 hover:shadow-lg active:scale-95 transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-800"
                        title="Add to basket"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
