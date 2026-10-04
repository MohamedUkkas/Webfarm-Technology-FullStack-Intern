import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    selectedCategory,
    categories,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setPriceRange,
    setInStockOnly,
    setDietaryFilter
  } = useStore();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const categoryTitle = selectedCategory === 'all' ? 'All Groceries & Essentials' : activeCategoryObj?.name;

  return (
    <section id="catalog-section" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Catalog Header with Sort and Mobile Filter Toggle */}
      <div className="catalog-heading flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 p-5 sm:p-6 rounded-[1.6rem] bg-gradient-to-br from-white via-white to-emerald-50/70 border border-emerald-950/10 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" /> Curated for your kitchen
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1 tracking-tight">
            {categoryTitle}
          </h2>
          <div className="text-xs text-stone-600 mt-1.5">
            {filteredProducts.length} handpicked items, ready for your basket
          </div>
        </div>

        {/* Controls: Filter trigger (mobile) & Sort dropdown */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-stone-200 text-stone-800 text-xs font-semibold grocery-card-shadow hover:border-emerald-700 hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-800" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3.5 py-2.5 rounded-full text-xs grocery-card-shadow hover:border-emerald-700/40 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-600" />
            <span className="text-stone-600 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-900 font-semibold outline-none cursor-pointer text-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar on Left (Desktop) + Product Cards Grid on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <FilterSidebar />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="catalog-item" style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
          <div className="empty-catalog-state py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-3xl mb-4">
                🧺
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900 mb-1">
                No matching groceries found
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-sm mx-auto mb-6">
                We couldn't find any items matching your current filters or search terms. Try clearing search or adjusting your price limits.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceRange([0, 100000]);
                  setInStockOnly(false);
                  setDietaryFilter([]);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-layer fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="mobile-filter-backdrop fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
          />
          <div className="mobile-filter-panel fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-4 overflow-y-auto">
            <FilterSidebar onCloseMobile={() => setIsMobileFilterOpen(false)} />
          </div>
        </div>
      )}

    </section>
  );
};
