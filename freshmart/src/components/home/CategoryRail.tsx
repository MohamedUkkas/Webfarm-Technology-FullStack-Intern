import React from 'react';
import { ArrowRight, ShoppingBasket, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';

export const CategoryRail: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  const handleCategoryClick = (catId: CategoryId | 'all') => {
    setSelectedCategory(catId);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-7 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-5">
        <div>
          <span className="text-xs font-bold tracking-[.16em] uppercase text-emerald-800">
            The market, sorted for you
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1 tracking-tight">
            Find your fresh favorites
          </h2>
        </div>
        
        <button
          onClick={() => handleCategoryClick('all')}
          className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-lg"
        >
          <span>View all products</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Visual Category Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
        
        {/* All Products Tile */}
        <button
          onClick={() => handleCategoryClick('all')}
          className={`category-tile flex flex-col items-center p-3.5 rounded-[1.4rem] border text-center transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-xl active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
            selectedCategory === 'all'
              ? 'is-selected bg-emerald-950 border-emerald-950 text-white shadow-lg shadow-emerald-950/15'
              : 'bg-white border-stone-200/90 hover:border-emerald-600/40 text-stone-900 grocery-card-shadow'
          }`}
        >
          <div className="category-image w-full h-20 sm:h-24 rounded-[1.1rem] overflow-hidden mb-3 flex items-center justify-center bg-emerald-50 group-hover:scale-[1.02] transition-transform duration-300">
            <ShoppingBasket className={`w-9 h-9 ${selectedCategory === 'all' ? 'text-emerald-100' : 'text-emerald-800'}`} strokeWidth={1.5} />
          </div>
          <span className={`text-xs font-bold leading-tight ${selectedCategory === 'all' ? 'text-white' : 'text-stone-900'}`}>
            All Aisles
          </span>
          <span className={`text-[11px] mt-0.5 ${selectedCategory === 'all' ? 'text-emerald-100' : 'text-stone-600'}`}>
            Full Pantry
          </span>
        </button>

        {/* Dynamic Category Tiles with Authentic Groceries Photography */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`category-tile flex flex-col items-center p-3.5 rounded-[1.4rem] border text-center transition-all duration-300 group cursor-pointer hover:-translate-y-1 hover:shadow-xl active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'is-selected bg-emerald-950 border-emerald-950 text-white shadow-lg shadow-emerald-950/15'
                  : 'bg-white border-stone-200/90 hover:border-emerald-600/40 text-stone-900 grocery-card-shadow'
              }`}
            >
              <div className="category-image w-full h-20 sm:h-24 rounded-[1.1rem] overflow-hidden mb-3 bg-stone-100 relative group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/25 to-transparent opacity-60" />
              </div>
              <span className={`text-xs font-bold leading-tight line-clamp-1 ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                {cat.name}
              </span>
              <span className={`text-[11px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-stone-600'}`}>
                {cat.itemCount} fresh finds
              </span>
            </button>
          );
        })}

      </div>
    </section>
  );
};
