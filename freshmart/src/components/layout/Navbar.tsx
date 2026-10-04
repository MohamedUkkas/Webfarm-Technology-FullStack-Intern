import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  MapPin, 
  X, 
  SlidersHorizontal,
  LayoutDashboard,
  Store,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  LogIn,
  KeyRound
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isAuthenticated,
    isStaff,
    isSuperAdmin,
    isStoreManager,
    isStaffMember,
    openAuthModal,
    logout,
    cart,
    wishlist,
    totalCartItemsCount,
    cartTotal,
    setIsCartOpen,
    setIsAccountOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    setSelectedCategory,
    currentView,
    setCurrentView,
    orders,
    setTrackingOrder,
    addresses,
    showToast
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for quick search dropdown
  const searchResults: Product[] = searchQuery.trim()
    ? products
        .filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const popularSearches = ['Avocados', 'Whole Milk', 'Sourdough', 'Olive Oil', 'Honeycrisp Apples', 'Farm Eggs'];

  // Latest active order for quick indicator
  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const handleAdminClick = () => {
    if (!isAuthenticated) {
      openAuthModal('admin');
      return;
    }
    if (!isStaff) {
      showToast('Management access required. Sign in with an authorized email.');
      openAuthModal('admin');
      return;
    }
    setCurrentView('admin');
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      openAuthModal('wishlist');
      return;
    }
    setIsAccountOpen(true);
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      openAuthModal('account');
      return;
    }
    setIsAccountOpen(true);
  };

  return (
    <header className="mac-toolbar-wrap sticky top-3 z-40 px-3 sm:px-6 max-w-7xl mx-auto transition-all duration-300">
      <nav 
        className={`glass-nav rounded-2xl transition-all duration-300 ${
          isScrolled ? 'py-2.5 px-4 shadow-lg bg-white/95' : 'py-3.5 px-4 sm:px-6 bg-white/85'
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Logo & Delivery Zone */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <button 
              onClick={() => {
                setCurrentView('storefront');
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-display font-bold text-xl shadow-sm group-hover:bg-emerald-900 group-hover:shadow-md group-hover:-rotate-3 group-hover:scale-105 transition-all duration-200">
                <span>F</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-stone-900 block leading-none">
                  FreshMart
                </span>
                <span className="text-[11px] font-medium tracking-wide uppercase text-emerald-800">
                  Supermarket
                </span>
              </div>
            </button>

            {/* Delivery address & 30-min drop indicator */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-stone-200 text-xs">
              <div className="p-1.5 rounded-lg bg-stone-100 text-emerald-800">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowAddressDropdown(!showAddressDropdown)}
                  className="flex items-center gap-1 text-stone-800 font-medium hover:text-emerald-800 transition-colors"
                >
                  <span className="truncate max-w-[140px] font-semibold">{defaultAddress ? `${defaultAddress.title} (${defaultAddress.street.slice(0, 16)}...)` : 'Deliver to Chennai'}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>
                <div className="text-[11px] text-stone-600 font-medium">
                  Fast 30-min drop
                </div>
              </div>
            </div>
          </div>

          {/* Search bar with real-time interactive dropdown */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fresh groceries, organic produce, dairy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-900 rounded-xl border border-stone-200/80 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 outline-none transition-all placeholder:text-stone-600"
              />
              <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-200 text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown on Focus */}
            {isSearchFocused && (
              <div className="search-suggestions absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 p-3">
                {searchQuery.trim() === '' ? (
                  <div>
                    <div className="text-[11px] font-semibold tracking-wider uppercase text-stone-600 mb-2 px-2">
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1 mb-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setIsSearchFocused(false);
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-semibold tracking-wider uppercase text-stone-600 mb-2 px-2 flex justify-between">
                      <span>Matching Groceries</span>
                      <span>{searchResults.length} items</span>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsSearchFocused(false);
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 object-cover rounded-lg bg-stone-100"
                              />
                              <div>
                                <div className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-stone-600">
                                  {p.brand} · {p.unit}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-stone-900">₹{p.price.toFixed(2)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-stone-600">
                        No groceries matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Active order quick tracking button */}
            {activeOrder && (
              <button
                onClick={() => setTrackingOrder(activeOrder)}
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 transition-colors shadow-2xs cursor-pointer"
                title={`Live tracking #${activeOrder.id}: ${activeOrder.status.replace(/_/g, ' ')}`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                <span>Live #{activeOrder.id} ({activeOrder.status.replace(/_/g, ' ')})</span>
              </button>
            )}

            {/* Wishlist Button (Login gated) */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2 rounded-xl text-stone-700 hover:text-red-600 hover:bg-red-50 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
              title="Saved items (Sign in required)"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / User Menu Dropdown */}
            {isAuthenticated && currentUser ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-[11px] font-bold">
                    {currentUser.firstName.charAt(0)}
                  </span>
                  <span className="hidden sm:inline truncate max-w-[100px]">{currentUser.firstName}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-stone-100">
                      <div className="font-bold text-stone-900">{currentUser.firstName} {currentUser.lastName}</div>
                      <div className="text-[11px] text-stone-500 truncate">{currentUser.email}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {currentUser.role}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsAccountOpen(true);
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 text-stone-800 text-left font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>My FreshMart Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsAccountOpen(true);
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 text-stone-800 text-left font-medium"
                    >
                      <Package className="w-3.5 h-3.5 text-stone-500" />
                      <span>Order History ({orders.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsAccountOpen(true);
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 text-stone-800 text-left font-medium"
                    >
                      <Heart className="w-3.5 h-3.5 text-stone-500" />
                      <span>Saved Items ({wishlist.length})</span>
                    </button>

                    {(isSuperAdmin || isStoreManager) && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setCurrentView('admin');
                        }}
                        className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50 text-emerald-800 text-left font-bold border-t border-stone-100"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{isSuperAdmin ? 'Admin Management Console' : 'Store Manager Portal'}</span>
                      </button>
                    )}

                    {isStaffMember && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          setCurrentView('staff');
                        }}
                        className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50 text-emerald-800 text-left font-bold border-t border-stone-100"
                      >
                        <Package className="w-3.5 h-3.5 text-emerald-700" />
                        <span>My Staff Duty Workspace</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-rose-50 text-rose-700 text-left font-medium border-t border-stone-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public / Logged-out Sign In Trigger */
              <button
                onClick={() => openAuthModal('general')}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}

            {/* Floating Cart Drawer Trigger (Guest or Account) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-[.98] transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
                {totalCartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                ₹{cartTotal.toFixed(2)}
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search groceries, milk, fruits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-100 rounded-xl border border-stone-200 outline-none text-stone-900 placeholder:text-stone-600"
            />
            <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </nav>
    </header>
  );
};
