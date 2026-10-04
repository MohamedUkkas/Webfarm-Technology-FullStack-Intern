import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onCloseMobile }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    priceRange,
    setPriceRange,
    inStockOnly,
    setInStockOnly,
    dietaryFilter,
    setDietaryFilter,
    products
  } = useStore();

  const maxPrice = Math.max(0, ...products.map((product) => product.price));

  const dietaryOptions = ['Organic', 'Farm Fresh', 'Vegan', 'Gluten-Free', 'Non-GMO'];

  const handleDietaryToggle = (item: string) => {
    setDietaryFilter((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 100000]);
    setInStockOnly(false);
    setDietaryFilter([]);
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    dietaryFilter.length +
    (priceRange[1] < 100000 && priceRange[1] < maxPrice ? 1 : 0);

  return (
    <aside className="w-full bg-white rounded-2xl border border-stone-200/90 p-5 space-y-6 grocery-card-shadow">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-emerald-800" />
          <h3 className="font-display font-bold text-sm sm:text-base text-stone-900">
            Aisle Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-stone-600 hover:text-emerald-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories Section */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
          Departments
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
              selectedCategory === 'all'
                ? 'bg-emerald-50 text-emerald-900 font-bold'
                : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span>All Aisles</span>
            <span className="text-[11px] text-stone-600">{products.length}</span>
          </button>
          
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className="text-[11px] text-stone-600">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Price Range
          </h4>
          <span className="text-xs font-semibold text-stone-800">
            Up to ₹{Math.min(priceRange[1], maxPrice).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={Math.max(maxPrice, 1)}
          step="1"
          value={priceRange[1] >= 100000 ? maxPrice : Math.min(priceRange[1], maxPrice)}
          onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
          className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-stone-600 mt-1">
          <span>₹0</span>
          <span>₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Dietary & Lifestyle Preferences */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
          Dietary & Origin
        </h4>
        <div className="space-y-2">
          {dietaryOptions.map((opt) => {
            const checked = dietaryFilter.includes(opt);
            return (
              <label
                key={opt}
                className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-stone-900 select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleDietaryToggle(opt)}
                  className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700/20 w-4 h-4 accent-emerald-800 cursor-pointer"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* In Stock Only Toggle */}
      <div className="pt-4 border-t border-stone-100">
        <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer select-none">
          <span className="font-medium">In-Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700/20 accent-emerald-800 cursor-pointer"
          />
        </label>
      </div>

      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="w-full py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-semibold mt-4 lg:hidden"
        >
          Apply Filters
        </button>
      )}

    </aside>
  );
};
