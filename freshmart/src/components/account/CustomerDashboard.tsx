import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Heart, 
  MapPin, 
  Tag, 
  User as UserIcon, 
  ArrowRight, 
  Clock, 
  Plus, 
  Trash2, 
  ShoppingBag,
  LogOut,
  AlertOctagon,
  Ban
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { COUPONS } from '../../data/mockData';

export const CustomerDashboard: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    currentUser,
    logout,
    orders,
    wishlist,
    products,
    addresses,
    setTrackingOrder,
    addToCart,
    toggleWishlist,
    applyCoupon,
    setIsCartOpen,
    cancelOrder,
    openAuthModal,
    isAuthenticated
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'coupons'>('orders');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  if (!isAccountOpen) return null;

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
          onClick={() => setIsAccountOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />
        <div className="min-h-screen px-4 text-center flex items-center justify-center py-6">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="inline-block w-full max-w-md text-center bg-white rounded-3xl shadow-2xl border border-stone-200 p-8 relative z-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-2xl mb-4">
              👤
            </div>
            <h3 className="font-display font-extrabold text-xl text-stone-900">
              Sign In to Your Account
            </h3>
            <p className="text-xs text-stone-600 mt-2 mb-6">
              Access your order tracking, saved wishlist items, and delivery preferences.
            </p>
            <button
              onClick={() => {
                setIsAccountOpen(false);
                openAuthModal('account');
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products in wishlist
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleConfirmCancel = (orderId: string) => {
    cancelOrder(orderId);
    setCancellingOrderId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAccountOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="inline-block w-full max-w-3xl text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 my-4"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-200/80 bg-stone-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg">
                {currentUser.firstName.charAt(0)}{currentUser.lastName ? currentUser.lastName.charAt(0) : ''}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-xl text-stone-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-xs text-stone-600">
                  {currentUser.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  logout();
                  setIsAccountOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              <button
                onClick={() => setIsAccountOpen(false)}
                className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 px-6 gap-6 text-xs font-semibold overflow-x-auto no-scrollbar">
            {[
              { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
              { id: 'wishlist', label: `Saved (${wishlistedProducts.length})`, icon: Heart },
              { id: 'addresses', label: `Addresses (${addresses.length})`, icon: MapPin },
              { id: 'coupons', label: `Coupons (${COUPONS.length})`, icon: Tag },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-emerald-800 text-emerald-800'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
            
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((ord) => {
                    const canCancel = ord.status === 'placed' || ord.status === 'confirmed';
                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-stone-200">
                          <div>
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              #{ord.id}
                            </span>
                            <span className="text-stone-300 mx-2">·</span>
                            <span className="text-stone-600">{ord.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${
                                ord.status === 'delivered'
                                  ? 'text-emerald-800'
                                  : ord.status === 'cancelled'
                                  ? 'text-rose-700'
                                  : 'text-amber-800'
                              }`}
                            >
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Items thumbnails row */}
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {ord.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs shrink-0"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-7 h-7 rounded-md object-cover"
                              />
                              <span className="font-medium text-stone-800 max-w-[120px] truncate">
                                {item.name}
                              </span>
                              <span className="text-stone-600">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Cancellation Confirmation Bar */}
                        {cancellingOrderId === ord.id && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
                            <div className="font-bold text-rose-800">
                              Cancel order #{ord.id}?
                            </div>
                            <div className="text-rose-700">
                              Your reservation will be released and goods will be returned to supermarket inventory.
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleConfirmCancel(ord.id)}
                                className="px-3 py-1.5 bg-rose-700 text-white rounded-lg font-bold text-[11px]"
                              >
                                Confirm Cancel
                              </button>
                              <button
                                onClick={() => setCancellingOrderId(null)}
                                className="px-3 py-1.5 bg-white text-stone-700 border border-stone-200 rounded-lg font-semibold text-[11px]"
                              >
                                Keep Order
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Actions & Bill Total */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="font-extrabold text-stone-900 text-sm">
                            ₹{ord.total.toFixed(2)}
                          </div>

                          <div className="flex items-center gap-2">
                            {canCancel && cancellingOrderId !== ord.id && (
                              <button
                                onClick={() => setCancellingOrderId(ord.id)}
                                className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-rose-700 hover:bg-rose-50 border border-stone-200 font-semibold text-xs transition-colors"
                              >
                                Cancel Order
                              </button>
                            )}

                            {ord.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  setIsAccountOpen(false);
                                  setTrackingOrder(ord);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs transition-colors"
                              >
                                Track Status
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-stone-600 text-sm">
                    No orders placed yet.
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlistedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlistedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl border border-stone-200 bg-white flex items-center justify-between gap-3 grocery-card-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-xl bg-stone-100"
                          />
                          <div>
                            <div className="text-xs font-bold text-stone-900 line-clamp-1">{p.name}</div>
                            <div className="text-[11px] text-stone-600">{p.unit}</div>
                            <div className="text-xs font-extrabold text-stone-900 mt-1">₹{p.price.toFixed(2)}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => addToCart(p)}
                            className="p-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl"
                            title="Add to basket"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="p-2 text-stone-600 hover:text-red-500 rounded-xl"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-600 text-sm">
                    Your wishlist is empty. Tap the heart on products you love!
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-stone-900">
                        {addr.title}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-stone-800">{addr.recipientName}</div>
                    <div className="text-stone-600">{addr.street} {addr.apartment}</div>
                    <div className="text-stone-600">{addr.city}, {addr.pincode}</div>
                    <div className="text-stone-700 font-mono pt-1">{addr.phone}</div>
                  </div>
                ))}
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COUPONS.map((cpn) => (
                  <div
                    key={cpn.code}
                    className="p-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm bg-white px-2 py-1 rounded-lg border border-emerald-200 text-emerald-900">
                        {cpn.code}
                      </span>
                      <button
                        onClick={() => {
                          applyCoupon(cpn.code);
                          setIsAccountOpen(false);
                          setIsCartOpen(true);
                        }}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
                      >
                        Apply to basket →'
                      </button>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{cpn.description}</p>
                    <div className="text-[11px] text-stone-600">
                      Min order: ₹{cpn.minSpend}.00
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
