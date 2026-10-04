import React from 'react';
import { ShieldCheck, Truck, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setCurrentView } = useStore();

  return (
    <footer className="mac-footer bg-stone-900 text-stone-300 pt-14 pb-10 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-display font-bold text-lg">
                F
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                FreshMart
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Your neighborhood digital supermarket. Curated daily from regional organic farms, artisan bakeries, and sustainable dairies. Delivered safely in 30→"45 minutes.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Operating Hubs across Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Customer Care: +1 (800) 582-9011 (7 AM →" 11 PM Daily)</span>
              </div>
            </div>
          </div>

          {/* Department Aisles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Departments
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setSelectedCategory('fruits-veg')}
                  className="hover:text-white transition-colors"
                >
                  Fresh Fruits & Veggies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('dairy-eggs')}
                  className="hover:text-white transition-colors"
                >
                  Pasture Dairy & Farm Eggs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('bakery')}
                  className="hover:text-white transition-colors"
                >
                  Artisan Sourdough & Breads
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('organic-pantry')}
                  className="hover:text-white transition-colors"
                >
                  Organic Grains & Oils
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('beverages')}
                  className="hover:text-white transition-colors"
                >
                  Cold-Pressed Juices
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              FreshMart Promise
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>100% Quality Guarantee</li>
              <li>Temperature Chilled Vans</li>
              <li>Eco-Friendly Biodegradable Bags</li>
              <li>No Wilted Produce Return Policy</li>
              <li>Local Grower Partnerships</li>
            </ul>
          </div>

          {/* Store Hours & Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Service Hours
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Order online 24/7. Supermarket packing and local dispatch runs daily from 7:00 AM to 10:00 PM.
            </p>
            <div className="pt-1 text-xs text-stone-400">
              <span className="font-semibold text-stone-300">Delivery Guarantee:</span> 30-minute express drop in service zones.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} FreshMart Supermarket Operations Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300">Privacy Policy</span>
            <span className="hover:text-stone-300">Food Safety Standards</span>
            <span className="hover:text-stone-300">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
