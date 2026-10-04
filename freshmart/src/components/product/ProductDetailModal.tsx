import React, { useState } from 'react';
import { X, Heart, Plus, Minus, Star, Truck, ShieldCheck, Check, Leaf, Clock, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    cart, 
    updateCartQuantity, 
    toggleWishlist, 
    isInWishlist, 
    products 
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProduct) return null;

  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image];

  const cartItem = cart.find((c) => c.product.id === selectedProduct.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(selectedProduct.id);

  // Related products in the same category
  const related = products
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 3);

  const handleAdd = () => {
    addToCart(selectedProduct, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        
        {/* Modal Window */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="inline-block w-full max-w-4xl text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 my-4"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8">
            
            {/* Left Column: Image & Gallery */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={images[activeImageIndex] || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="absolute top-3 right-3 p-2.5 rounded-xl glass-pill text-stone-700 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {selectedProduct.discountPercent > 0 && (
                  <span className="absolute bottom-3 left-3 bg-amber-500 text-stone-950 font-bold text-xs px-2.5 py-1 rounded-lg">
                    Save {selectedProduct.discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-emerald-700 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery Promise Guarantee */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  <span className="font-semibold text-stone-900">Next delivery slot: Today 2:00 PM →" 4:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Quality checked upon farm dispatch & temperature controlled</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information, Pricing, & Actions */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-5">
              
              <div>
                {/* Brand & Origin metadata */}
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                  <span>{selectedProduct.brand}</span>
                  <span className="text-stone-300">·</span>
                  <span>SKU: {selectedProduct.sku}</span>
                </div>

                {/* Title */}
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="text-sm font-medium text-stone-600 mt-1">
                  Net Weight: {selectedProduct.unit}
                </div>

                {/* Star rating & review */}
                <div className="flex items-center gap-2 mt-2 pb-4 border-b border-stone-100">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                    <span className="text-sm font-bold text-stone-900 ml-1">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs text-stone-600 font-medium">
                    {selectedProduct.reviewCount} customer reviews
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stockCount} units)
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-display font-extrabold text-3xl text-stone-950">
                    ₹{selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.mrp > selectedProduct.price && (
                    <>
                      <span className="text-base text-stone-600 line-through">
                        ₹{selectedProduct.mrp.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Save ₹{(selectedProduct.mrp - selectedProduct.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Dietary Tags (Unboxed Discipline) */}
                {selectedProduct.dietary && selectedProduct.dietary.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-stone-600 font-medium">
                    <Leaf className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{selectedProduct.dietary.join(' · ')}</span>
                  </div>
                )}

                {/* Nutrition Breakdown if available */}
                {selectedProduct.nutrition && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                      Nutritional Facts (Per 100g)
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                        <div className="font-bold text-stone-900">{selectedProduct.nutrition.calories}</div>
                        <div className="text-[10px] text-stone-600">Calories</div>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                        <div className="font-bold text-stone-900">{selectedProduct.nutrition.protein}</div>
                        <div className="text-[10px] text-stone-600">Protein</div>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                        <div className="font-bold text-stone-900">{selectedProduct.nutrition.carbs}</div>
                        <div className="text-[10px] text-stone-600">Carbs</div>
                      </div>
                      <div className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                        <div className="font-bold text-stone-900">{selectedProduct.nutrition.fiber}</div>
                        <div className="text-[10px] text-stone-600">Fiber</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Storage Instructions */}
                {selectedProduct.storage && (
                  <div className="mt-3 text-xs text-stone-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60 flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span><strong>Storage Guide:</strong> {selectedProduct.storage}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Quantity Stepper & Add to Cart */}
              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                {qtyInCart > 0 ? (
                  <div className="flex items-center gap-3 bg-stone-100 px-3 py-2.5 rounded-xl">
                    <button
                      onClick={() => updateCartQuantity(selectedProduct.id, qtyInCart - 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-stone-900 min-w-6 text-center text-base">
                      {qtyInCart}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(selectedProduct.id, qtyInCart + 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : null}

                <button
                  onClick={handleAdd}
                  disabled={!selectedProduct.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    justAdded
                      ? 'bg-emerald-800 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Basket</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{qtyInCart > 0 ? 'Add More' : 'Add to Basket'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

          {/* Related Products Row */}
          {related.length > 0 && (
            <div className="bg-stone-50 p-6 border-t border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                Complementary Produce in {selectedProduct.brand} & Aisle
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedProduct(item);
                      setActiveImageIndex(0);
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-stone-200 hover:border-emerald-600 text-left transition-all group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg bg-stone-100"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-800 truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-stone-600">{item.unit}</div>
                      <div className="text-xs font-bold text-stone-900">₹{item.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
