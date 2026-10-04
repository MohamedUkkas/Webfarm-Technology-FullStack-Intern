import React, { useEffect, useState } from 'react';
import { Heart, Plus, Minus, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    cart, 
    addToCart, 
    updateCartQuantity, 
    toggleWishlist, 
    isInWishlist, 
    setSelectedProduct 
  } = useStore();

  const [isJustAdded, setIsJustAdded] = useState(false);
  const [isFavoritePopping, setIsFavoritePopping] = useState(false);

  const cartItem = cart.find(c => c.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isWishlisted = isInWishlist(product.id);

  useEffect(() => {
    if (!isJustAdded) return;
    const timeout = window.setTimeout(() => setIsJustAdded(false), 900);
    return () => window.clearTimeout(timeout);
  }, [isJustAdded]);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1);
    setIsJustAdded(true);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCartQuantity(product.id, quantityInCart - 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    setIsFavoritePopping(true);
    window.setTimeout(() => setIsFavoritePopping(false), 320);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="mac-product-card group bg-white rounded-3xl border border-stone-200/90 hover:border-emerald-600/40 p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 grocery-card-shadow hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 cursor-pointer relative catalog-card"
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProduct(product); } }}
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square rounded-[1.35rem] overflow-hidden bg-stone-100 mb-3 product-photo">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />

          {/* Floating Glass Wishlist Icon Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2.5 right-2.5 p-2.5 rounded-2xl glass-pill transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 ${
              isWishlisted
                ? 'text-red-500 bg-white/90 shadow-sm'
                : 'text-stone-600 hover:text-red-500 hover:bg-white'
            }`}
            title={isWishlisted ? 'Saved' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-red-500' : ''} ${isFavoritePopping ? 'favorite-pop' : ''}`} />
          </button>

          {/* Savings / Deal Tag - clean quiet accent */}
          {product.discountPercent > 0 && (
            <span className="absolute bottom-2.5 left-2.5 bg-amber-400 text-stone-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-xs transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              Save {product.discountPercent}%
            </span>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-bold text-stone-700 bg-stone-200/90 px-3 py-1 rounded-md">
                Temporarily Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Clean Unboxed Metadata (Anti-Slop / Zero-Pill Discipline) */}
        <div className="text-[11px] text-emerald-800 flex items-center gap-1 font-semibold mb-1">
          <span>{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{product.origin || 'Farm Direct'}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {/* Unit & Packaging specification */}
        <div className="text-xs text-stone-700 mt-0.5">
          {product.unit}
        </div>

        {/* Rating and review count */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
            <span className="text-xs font-bold text-stone-800 ml-1">{product.rating}</span>
          </div>
          <span className="text-stone-300">·</span>
          <span className="text-[11px] text-stone-600">({product.reviewCount})</span>
        </div>
      </div>

      {/* Pricing & Add to Cart Micro-Interaction */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        
        {/* Price stack */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
              ₹{product.price.toFixed(2)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-stone-600 line-through">
                ₹{product.mrp.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-[10px] text-stone-600">
            {product.stockCount > 0 && product.stockCount < 10 ? (
              <span className="text-amber-800 font-semibold">Only {product.stockCount} left</span>
            ) : (
              <span>In stock</span>
            )}
          </div>
        </div>

        {/* Add Button or Quantity Stepper */}
        {product.inStock ? (
          quantityInCart > 0 ? (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center gap-2 bg-emerald-800 text-white px-2 py-1.5 rounded-xl text-xs font-semibold shadow-xs"
            >
              <button
                onClick={handleDecrement}
                aria-label={`Remove one ${product.name}`}
                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-900 rounded-md transition-colors active:scale-90"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span key={quantityInCart} aria-live="polite" className="min-w-4 text-center font-bold text-sm quantity-pop">{quantityInCart}</span>
              <button
                onClick={handleIncrement}
                aria-label={`Add one ${product.name}`}
                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-900 rounded-md transition-colors active:scale-90"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 shadow-sm ${
                isJustAdded
                  ? 'bg-emerald-800 text-white'
                  : 'bg-stone-100 hover:bg-emerald-800 text-stone-900 hover:text-white border border-stone-200 hover:border-emerald-800'
              }`}
            >
              {isJustAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )
        ) : (
          <span className="text-[11px] text-stone-600 font-medium">Sold Out</span>
        )}

      </div>
    </div>
  );
};
