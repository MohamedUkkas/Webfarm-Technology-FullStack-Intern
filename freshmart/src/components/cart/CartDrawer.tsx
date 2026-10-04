import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Sparkles,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    deliveryFee,
    couponDiscount,
    cartTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    isAuthenticated,
    openAuthModal
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  // Free delivery threshold: ?1,920.
  const freeDeliveryThreshold = 1920;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      openAuthModal('checkout');
      return;
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-drawer bg-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg text-stone-900">
                  Your Grocery Basket
                </h2>
                <span className="text-xs text-stone-700">
                  {cart.length} unique {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter Bar */}
          {cart.length > 0 && (
            <div className="bg-emerald-50/70 p-3 px-5 border-b border-emerald-100 text-xs text-stone-700">
              <div className="flex items-center justify-between font-medium mb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-900">
                  <Truck className="w-3.5 h-3.5" />
                  {amountNeededForFreeDelivery === 0 ? (
                    <span className="font-bold">You qualify for FREE express delivery!</span>
                  ) : (
                    <span>Add <strong>₹{amountNeededForFreeDelivery.toFixed(2)}</strong> more for <strong>FREE Delivery</strong></span>
                  )}
                </div>
                <span className="font-bold text-emerald-800">{Math.round(freeDeliveryProgress)}%</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-800 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 group hover:border-stone-300 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-stone-600 font-medium">
                      {item.product.brand}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                      {item.product.name}
                    </div>
                    <div className="text-[11px] text-stone-600 mt-0.5">
                      {item.product.unit}
                    </div>
                    <div className="text-xs font-bold text-stone-900 mt-1">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                      <span className="text-[11px] text-stone-600 font-normal ml-1">
                        (₹{item.product.price.toFixed(2)} each)
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-stone-100 rounded text-stone-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-stone-100 rounded text-stone-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Basket State */
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-2xl">
                  🛒'
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-stone-900">
                    Your basket is empty
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                    Explore fresh vegetables, daily dairy, and bakery items to start your grocery delivery.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs"
                >
                  Explore groceries
                </button>
              </div>
            )}
          </div>

          {/* Footer: Coupon Code & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/60 space-y-4">
              
              {/* Promo Code Input */}
              {activeCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Coupon <strong>{activeCoupon.code}</strong> applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-600 hover:text-red-600 text-[11px] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try FRESH30 or WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-stone-200 uppercase outline-none focus:border-emerald-700 font-mono placeholder:font-sans placeholder:normal-case"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <div className="text-[11px] text-red-600 pl-1">{couponError}</div>
                  )}
                </form>
              )}

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Basket Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{cartSubtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Express Supermarket Delivery</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-800">FREE</span>
                  ) : (
                    <span className="font-semibold text-stone-900">₹{deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Discount Savings</span>
                    <span>−₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-extrabold text-stone-950">
                  <span>Total Payable</span>
                  <span className="text-emerald-950">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                <span>Proceed to Delivery & Payment</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
