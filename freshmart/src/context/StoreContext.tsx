import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  CategoryId, 
  CartItem, 
  Order, 
  DeliveryAddress, 
  Coupon, 
  OrderStatus,
  User,
  UserRole,
  AuthIntent,
  StoreMember,
  StaffWorkItem,
  StaffRole,
  WorkStatus,
  DeletedMemberRecord,
  AuditLogEntry,
  DarkStoreInfo,
  WeightVariant,
  CutOption
} from '../types';
import { 
  CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ADDRESSES,
  COUPONS, 
  INITIAL_MANAGERS,
  INITIAL_STAFF,
  INITIAL_STAFF_WORKS,
  INITIAL_AUDIT_LOGS,
  DEFAULT_DARK_STORES
} from '../data/mockData';
import { 
  processUserAuthentication, 
  ADMIN_EMAIL,
  AuthenticatedSession 
} from '../services/authService';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, fbSignOut, onAuthStateChanged } from '../services/firebase';

interface StoreContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isStaff: boolean;
  isSuperAdmin: boolean;
  isStoreManager: boolean;
  isStaffMember: boolean;

  managers: StoreMember[];
  staffMembers: StoreMember[];
  staffWorks: StaffWorkItem[];
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;
  deletedMembers: DeletedMemberRecord[];
  restoreMember: (recordId: string) => { success: boolean; message: string };

  isAuthModalOpen: boolean;
  authIntent: AuthIntent;
  pendingWishlistProductId: string | null;

  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addresses: DeliveryAddress[];
  activeCoupon: Coupon | null;
  selectedCategory: CategoryId | 'all';
  searchQuery: string;
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating';
  dietaryFilter: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isAccountOpen: boolean;
  trackingOrder: Order | null;
  selectedProduct: Product | null;
  currentView: 'storefront' | 'admin' | 'staff';
  toastMessage: string | null;

  // Setters & Actions
  setCurrentUser: (user: User | null) => void;
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'popular' | 'price-low' | 'price-high' | 'rating') => void;
  setDietaryFilter: React.Dispatch<React.SetStateAction<string[]>>;
  setPriceRange: (range: [number, number]) => void;
  setInStockOnly: (val: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAccountOpen: (open: boolean) => void;
  setTrackingOrder: (order: Order | null) => void;
  setSelectedProduct: (product: Product | null) => void;
  setCurrentView: (view: 'storefront' | 'admin' | 'staff') => void;
  handlePostLoginMigration: (user: User, isAdmin?: boolean) => void;

  openAuthModal: (intent: AuthIntent, targetProductId?: string) => void;
  closeAuthModal: () => void;
  loginWithGoogle: (googleEmail?: string) => Promise<AuthenticatedSession>;
  loginWithEmail: (emailOrId: string, password?: string) => Promise<{ success: boolean; session?: AuthenticatedSession; message?: string }>;
  loginWithId: (id: string) => Promise<{ success: boolean; session?: AuthenticatedSession; message?: string }>;
  signupWithEmail: (details: { firstName: string; lastName: string; email: string; password: string }) => Promise<{ success: boolean; session?: AuthenticatedSession; message?: string }>;
  logout: () => void;

  // Zepto Hyperlocal & Dark Store Engine
  darkStores: DarkStoreInfo[];
  selectedDarkStore: DarkStoreInfo;
  setSelectedDarkStore: (ds: DarkStoreInfo) => void;
  isDarkStoreModalOpen: boolean;
  setIsDarkStoreModalOpen: (open: boolean) => void;
  customizingProduct: Product | null;
  setCustomizingProduct: (p: Product | null) => void;

  // Management & Hierarchy Functions
  assignManager: (data: { firstName: string; lastName: string; email: string; phone?: string; department: string; customId?: string }) => { success: boolean; message: string; managerId?: string };
  deleteManager: (managerId: string) => { success: boolean; message: string };
  assignStaff: (data: { firstName: string; lastName: string; email: string; phone?: string; role: StaffRole; department: string; customId?: string }) => { success: boolean; message: string; staffId?: string };
  deleteStaff: (staffId: string) => { success: boolean; message: string };
  assignMemberByEmail: (data: { firstName: string; lastName: string; email: string; phone?: string; role: 'STORE_MANAGER' | StaffRole; department?: string; customId?: string }) => { success: boolean; message: string; memberId?: string };
  assignWorkToStaff: (data: { staffId: string; title: string; description: string; category: 'packing' | 'stocking' | 'delivery' | 'inspection'; orderId?: string; itemsSummary?: string; location?: string; notes?: string }) => { success: boolean; message: string };
  updateWorkStatus: (workId: string, status: WorkStatus, notes?: string) => void;

  addToCart: (product: Product, quantity?: number, selectedVariant?: WeightVariant, selectedCut?: CutOption) => void;
  removeFromCart: (productId: string, variantId?: string, cutType?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variantId?: string, cutType?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (details: { address: DeliveryAddress; slot: string; paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery' }) => Order;
  cancelOrder: (orderId: string, reason?: string) => { success: boolean; message: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  restockProduct: (productId: string, count: number) => void;
  updateProduct: (product: Product) => void;
  addProduct: (productData: Omit<Product, 'id'>) => void;
  addAddress: (addressData: Omit<DeliveryAddress, 'id'>) => void;
  showToast: (msg: string) => void;

  // Computed
  cartSubtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  cartTotal: number;
  totalCartItemsCount: number;
  filteredProducts: Product[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PURGED_LEGACY_ACCOUNTS = [
  'manager.elena@gmail.com',
  'manager.marcus@gmail.com',
  'packer.john@gmail.com',
  'stocker.sara@gmail.com',
  'courier.david@gmail.com',
  'courier.david@freshmart.internal'
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State: Super Admin Mohamed Ukkas
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('freshmart_auth_user');
      if (saved) localStorage.removeItem('freshmart_auth_user');
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<AuthIntent>('general');
  const [pendingWishlistProductId, setPendingWishlistProductId] = useState<string | null>(null);

  // Products & Catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const currencyVersion = localStorage.getItem('freshmart_currency_version');
      const priceVersion = localStorage.getItem('freshmart_price_version');
      const saved = localStorage.getItem('freshmart_products');
      if (!saved) {
        localStorage.setItem('freshmart_currency_version', 'INR-v1');
        return INITIAL_PRODUCTS;
      }

      const storedProducts: Product[] = JSON.parse(saved);
      if (currencyVersion !== 'INR-v1') {
        // Stored catalog entries are already INR; only legacy cart/order seed data
        // used the old USD values. Never multiply admin-edited catalog prices here.
        localStorage.setItem('freshmart_currency_version', 'INR-v1');
      }
      if (priceVersion === 'chennai-market-v2') return storedProducts;

      // Apply the corrected catalog once in existing browsers while preserving
      // stock and admin-added products. Later admin price edits remain intact.
      const storedById = new Map(storedProducts.map((product) => [product.id, product]));
      const currentProducts = INITIAL_PRODUCTS.map((seed) => {
        const storedProduct = storedById.get(seed.id);
        if (!storedProduct) return seed;
        storedById.delete(seed.id);
        return {
          ...storedProduct,
          price: seed.price,
          mrp: seed.mrp,
          discountPercent: seed.discountPercent,
          weightVariants: seed.weightVariants,
          cutOptions: seed.cutOptions
        };
      });
      const mergedProducts = [...currentProducts, ...storedProducts.filter((product) => storedById.has(product.id))];
      localStorage.setItem('freshmart_products', JSON.stringify(mergedProducts));
      localStorage.setItem('freshmart_price_version', 'chennai-market-v2');
      return mergedProducts;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(CATEGORIES);

  // Cart (Guest cart or merged account cart)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('freshmart_cart');
      if (!saved) {
        sessionStorage.setItem('freshmart_cart_currency_version', 'INR-v1');
        return [];
      }
      const storedCart: CartItem[] = JSON.parse(saved);
      if (sessionStorage.getItem('freshmart_cart_currency_version') !== 'INR-v1') {
        storedCart.forEach((item) => {
          item.product.price = Math.round(item.product.price * 96);
          item.product.mrp = Math.round(item.product.mrp * 96);
          item.selectedVariant?.price && (item.selectedVariant.price = Math.round(item.selectedVariant.price * 96));
          item.selectedVariant?.mrp && (item.selectedVariant.mrp = Math.round(item.selectedVariant.mrp * 96));
          if (item.selectedCut?.extraPrice !== undefined) item.selectedCut.extraPrice = Math.round(item.selectedCut.extraPrice * 96);
        });
        sessionStorage.setItem('freshmart_cart', JSON.stringify(storedCart));
        sessionStorage.setItem('freshmart_cart_currency_version', 'INR-v1');
      }
      return storedCart;
    } catch {
      return [];
    }
  });

  // Saved user account cart for migration
  const [accountCart, setAccountCart] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('freshmart_account_cart');
      if (!saved) {
        sessionStorage.setItem('freshmart_account_cart_currency_version', 'INR-v1');
        return [];
      }
      const storedCart: CartItem[] = JSON.parse(saved);
      if (sessionStorage.getItem('freshmart_account_cart_currency_version') !== 'INR-v1') {
        storedCart.forEach((item) => {
          item.product.price = Math.round(item.product.price * 96);
          item.product.mrp = Math.round(item.product.mrp * 96);
          item.selectedVariant?.price && (item.selectedVariant.price = Math.round(item.selectedVariant.price * 96));
          item.selectedVariant?.mrp && (item.selectedVariant.mrp = Math.round(item.selectedVariant.mrp * 96));
          if (item.selectedCut?.extraPrice !== undefined) item.selectedCut.extraPrice = Math.round(item.selectedCut.extraPrice * 96);
        });
        sessionStorage.setItem('freshmart_account_cart', JSON.stringify(storedCart));
        sessionStorage.setItem('freshmart_account_cart_currency_version', 'INR-v1');
      }
      return storedCart;
    } catch {
      return [];
    }
  });

  // Wishlist (User-specific)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('freshmart_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = sessionStorage.getItem('freshmart_orders');
      const currencyVersion = localStorage.getItem('freshmart_orders_currency_version');
      if (!saved) {
        localStorage.setItem('freshmart_orders_currency_version', 'INR-v1');
        return [];
      }

      const storedOrders: Order[] = JSON.parse(saved);
      if (currencyVersion !== 'INR-v1') {
        storedOrders.forEach((order) => {
          order.subtotal = Math.round(order.subtotal * 96);
          order.deliveryFee = Math.round(order.deliveryFee * 96);
          order.discount = Math.round(order.discount * 96);
          order.total = Math.round(order.total * 96);
          order.items.forEach((item) => { item.price = Math.round(item.price * 96); });
        });
        sessionStorage.setItem('freshmart_orders', JSON.stringify(storedOrders));
        localStorage.setItem('freshmart_orders_currency_version', 'INR-v1');
      }
      return storedOrders;
    } catch {
      return [];
    }
  });

  // Delivery Addresses
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = sessionStorage.getItem('freshmart_addresses');
      const addressVersion = localStorage.getItem('freshmart_addresses_currency_version');
      if (!saved || addressVersion !== 'INR-v1') {
        sessionStorage.setItem('freshmart_addresses', JSON.stringify(INITIAL_ADDRESSES));
        localStorage.setItem('freshmart_addresses_currency_version', 'INR-v1');
        return INITIAL_ADDRESSES;
      }
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Zepto Hyperlocal & Dark Store Engine
  const [darkStores] = useState<DarkStoreInfo[]>(DEFAULT_DARK_STORES);
  const [selectedDarkStore, setSelectedDarkStore] = useState<DarkStoreInfo>(DEFAULT_DARK_STORES[0]);
  const [isDarkStoreModalOpen, setIsDarkStoreModalOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<'storefront' | 'admin' | 'staff'>('storefront');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Store Managers (Assigned by Mohamed Ukkas by Email)
  const [managers, setManagers] = useState<StoreMember[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_managers');
      if (saved) {
        const parsed: StoreMember[] = JSON.parse(saved);
        const filtered = parsed.filter(m => !PURGED_LEGACY_ACCOUNTS.includes(m.email.toLowerCase()));
        if (filtered.length !== parsed.length) {
          localStorage.setItem('freshmart_managers', JSON.stringify(filtered));
        }
        return filtered;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Staff Members (Assigned by Mohamed Ukkas or Store Managers by Email)
  const [staffMembers, setStaffMembers] = useState<StoreMember[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_staff');
      if (saved) {
        const parsed: StoreMember[] = JSON.parse(saved);
        const filtered = parsed.filter(s => !PURGED_LEGACY_ACCOUNTS.includes(s.email.toLowerCase()));
        if (filtered.length !== parsed.length) {
          localStorage.setItem('freshmart_staff', JSON.stringify(filtered));
        }
        return filtered;
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser?.email) {
        setCurrentUser(null);
        return;
      }
      const [firstName, ...lastName] = (firebaseUser.displayName || firebaseUser.email.split('@')[0]).split(' ');
      const session = processUserAuthentication(firebaseUser.email, firstName, lastName.join(' '), managers, staffMembers);
      if (session.user.role === 'CUSTOMER' || session.user.role === 'ADMIN') session.user.id = firebaseUser.uid;
      setCurrentUser(session.user);
      setCurrentView(session.targetState);
    });
  }, [managers, staffMembers]);

  // Staff Work Items (Assigned and completed tasks)
  const [staffWorks, setStaffWorks] = useState<StaffWorkItem[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_staff_works');
      if (saved) {
        const parsed: StaffWorkItem[] = JSON.parse(saved);
        const filtered = parsed.filter(w => !PURGED_LEGACY_ACCOUNTS.includes(w.staffEmail.toLowerCase()));
        if (filtered.length !== parsed.length) {
          localStorage.setItem('freshmart_staff_works', JSON.stringify(filtered));
        }
        return filtered;
      }
      return [];
    } catch {
      return [];
    }
  });

  // Deleted Members Log (for audit and instant restoration)
  const [deletedMembers, setDeletedMembers] = useState<DeletedMemberRecord[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_deleted_members');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // System & Management Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('freshmart_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('freshmart_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('freshmart_auth_user');
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('freshmart_managers', JSON.stringify(managers));
    } catch {}
  }, [managers]);

  useEffect(() => {
    try {
      localStorage.setItem('freshmart_staff', JSON.stringify(staffMembers));
    } catch {}
  }, [staffMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('freshmart_staff_works', JSON.stringify(staffWorks));
    } catch {}
  }, [staffWorks]);

  useEffect(() => {
    try {
      localStorage.setItem('freshmart_deleted_members', JSON.stringify(deletedMembers));
    } catch {}
  }, [deletedMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('freshmart_audit_logs', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('freshmart_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      sessionStorage.setItem('freshmart_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      sessionStorage.setItem('freshmart_account_cart', JSON.stringify(accountCart));
    } catch {}
  }, [accountCart]);

  useEffect(() => {
    try {
      sessionStorage.setItem('freshmart_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      sessionStorage.setItem('freshmart_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      sessionStorage.setItem('freshmart_addresses', JSON.stringify(addresses));
    } catch {}
  }, [addresses]);

  // Order progression is controlled by store operations; no live fulfillment service is configured.
  // Real-time synchronization of trackingOrder with live orders array
  useEffect(() => {
    if (trackingOrder) {
      const latest = orders.find((o) => o.id === trackingOrder.id);
      if (
        latest &&
        (latest.status !== trackingOrder.status ||
          latest.estimatedDeliveryTime !== trackingOrder.estimatedDeliveryTime ||
          latest.deliveryAgent?.currentLocation !== trackingOrder.deliveryAgent?.currentLocation)
      ) {
        setTrackingOrder(latest);
      }
    }
  }, [orders, trackingOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const isAuthenticated = !!currentUser;
  // The configured super admin is identified by Firebase's verified account email.
  const isSuperAdmin = !!currentUser && currentUser.role === 'ADMIN' && currentUser.email.trim().toLowerCase() === ADMIN_EMAIL;
  const isStoreManager = !!currentUser && currentUser.role === 'STORE_MANAGER' && managers.some(
    (member) => member.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase() && member.status === 'active'
  );
  const isStaffMember = !!currentUser && currentUser.role.startsWith('STAFF') && staffMembers.some(
    (member) => member.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase() && member.status === 'active'
  );
  const isStaff = isSuperAdmin || isStoreManager;

  // Auth Gate Control
  const openAuthModal = (intent: AuthIntent = 'general', targetProductId?: string) => {
    setAuthIntent(intent);
    if (targetProductId) {
      setPendingWishlistProductId(targetProductId);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingWishlistProductId(null);
  };

  // Cart Migration on Login: Merge Guest Cart with Server Cart
  const handlePostLoginMigration = (user: User, isAdmin: boolean = false) => {
    // Don't restore browser-global account carts when switching signed-in users.
    setAccountCart([]);
    setCurrentView(isAdmin || user.role === 'STORE_MANAGER' ? 'admin' : user.role.startsWith('STAFF') ? 'staff' : 'storefront');

    // 3. Resolve customer pending action if any
    if (authIntent === 'wishlist' && pendingWishlistProductId) {
      setWishlist((prev) => {
        if (!prev.includes(pendingWishlistProductId)) {
          showToast('Added to wishlist');
          return [...prev, pendingWishlistProductId];
        }
        return prev;
      });
      setPendingWishlistProductId(null);
    } else if (authIntent === 'checkout') {
      setIsCheckoutOpen(true);
    } else if (authIntent === 'account') {
      setIsAccountOpen(true);
    }

    closeAuthModal();
  };

  const loginWithGoogle = async (): Promise<AuthenticatedSession> => {
    if (!auth) throw new Error('Authentication is not configured. Set the Firebase VITE_* values and try again.');
    const result = await signInWithPopup(auth, googleProvider);
    if (!result.user.email) throw new Error('Your Google account did not provide an email address.');
    const [firstName, ...lastParts] = (result.user.displayName || '').split(' ');
    const session = processUserAuthentication(result.user.email, firstName, lastParts.join(' '), managers, staffMembers);
    if (session.user.role === 'CUSTOMER' || session.user.role === 'ADMIN') session.user.id = result.user.uid;
    setCurrentUser(session.user);
    handlePostLoginMigration(session.user, session.isAdmin);
    showToast(`Welcome, ${session.user.firstName}!`);
    return session;
  };

  const loginWithId = async (_id: string) => ({ success: false, message: 'Assigned IDs are not credentials. Sign in with your verified email and password.' });

  const loginWithEmail = async (email: string, password?: string) => {
    if (!auth) return { success: false, message: 'Authentication is not configured. Set the Firebase VITE_* values and try again.' };
    if (!password) return { success: false, message: 'Please enter your password.' };
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!credential.user.email) return { success: false, message: 'Your account has no email address.' };
      const session = processUserAuthentication(credential.user.email, undefined, undefined, managers, staffMembers);
      if (session.user.role === 'CUSTOMER' || session.user.role === 'ADMIN') session.user.id = credential.user.uid;
      setCurrentUser(session.user);
      handlePostLoginMigration(session.user, session.isAdmin);
      showToast(`Welcome back, ${session.user.firstName}!`);
      return { success: true, session };
    } catch (error: any) {
      return { success: false, message: error?.code === 'auth/invalid-credential' ? 'Invalid email or password.' : error?.message || 'Could not sign in.' };
    }
  };

  const signupWithEmail = async (details: { firstName: string; lastName: string; email: string; password: string }) => {
    if (!auth) return { success: false, message: 'Authentication is not configured. Set the Firebase VITE_* values and try again.' };
    try {
      const credential = await createUserWithEmailAndPassword(auth, details.email.trim(), details.password);
      if (!credential.user.email) return { success: false, message: 'Could not verify the new account email.' };
      const session = processUserAuthentication(credential.user.email, details.firstName, details.lastName, managers, staffMembers);
      if (session.user.role === 'CUSTOMER' || session.user.role === 'ADMIN') session.user.id = credential.user.uid;
      setCurrentUser(session.user);
      handlePostLoginMigration(session.user, session.isAdmin);
      showToast(`Account created! Welcome to FreshMart, ${session.user.firstName}!`);
      return { success: true, session };
    } catch (error: any) {
      return { success: false, message: error?.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' : error?.message || 'Could not create account.' };
    }
  };
  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setAccountCart([]);
    setWishlist([]);
    setAddresses([]);
    setOrders([]);
    for (const key of ['freshmart_cart', 'freshmart_account_cart', 'freshmart_wishlist', 'freshmart_addresses', 'freshmart_orders']) {
      sessionStorage.removeItem(key);
    }
    if (auth) void fbSignOut(auth);
    setCurrentView('storefront');
    setIsAccountOpen(false);
    showToast('Signed out successfully');
  };

  // Helper to add audit logs
  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' +
      now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const newLog: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: formattedTime
    };

    setAuditLogs((prev) => {
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem('freshmart_audit_logs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAuditLogs = () => {
    if (!isSuperAdmin) return;
    setAuditLogs([]);
    try {
      localStorage.removeItem('freshmart_audit_logs');
    } catch {}
    showToast('Audit log history cleared.');
  };

  // Restore previously removed member (Store Manager or Staff)
  const restoreMember = (recordId: string): { success: boolean; message: string } => {
    if (!isSuperAdmin && !isStoreManager) return { success: false, message: 'Management access required.' };
    const target = deletedMembers.find((r) => r.id === recordId || r.email.toLowerCase() === recordId.toLowerCase());
    if (!target) {
      return { success: false, message: 'Deleted record not found.' };
    }

    if (target.type === 'manager') {
      setManagers((prev) => {
        const updated = [target.originalMember, ...prev];
        try { localStorage.setItem('freshmart_managers', JSON.stringify(updated)); } catch {}
        return updated;
      });
    } else {
      setStaffMembers((prev) => {
        const updated = [target.originalMember, ...prev];
        try { localStorage.setItem('freshmart_staff', JSON.stringify(updated)); } catch {}
        return updated;
      });
    }

    setDeletedMembers((prev) => {
      const updated = prev.filter((r) => r.id !== recordId && r.email.toLowerCase() !== target.email.toLowerCase());
      try { localStorage.setItem('freshmart_deleted_members', JSON.stringify(updated)); } catch {}
      return updated;
    });

    addAuditLog({
      action: 'MEMBER_RESTORED',
      title: `${target.type === 'manager' ? 'Store Manager' : 'Staff Member'} Restored`,
      details: `${currentUser?.firstName || 'Admin'} restored ${target.firstName} ${target.lastName} (${target.email}) to active duty in ${target.department}`,
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mohamed Ukkas (Super Admin)',
      actorEmail: currentUser?.email || ADMIN_EMAIL,
      targetId: target.id,
      targetName: `${target.firstName} ${target.lastName}`,
      targetRole: target.role,
      severity: 'success'
    });

    showToast(`Restored ${target.firstName} ${target.lastName} to active team.`);
    return { success: true, message: 'Member restored successfully.' };
  };

  // Hierarchy Management Functions
  // 1. Admin assigns Store Manager
  const assignManager = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department: string;
    customId?: string;
  }): { success: boolean; message: string; managerId?: string } => {
    if (!isSuperAdmin) return { success: false, message: 'Super administrator access required.' };
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Manager Gmail / email is required.' };
    }
    if (managers.some((m) => m.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'A manager with this email already exists.' };
    }

    let assignedId = data.customId?.trim().toLowerCase();
    if (!assignedId) {
      let nextNum = 1;
      while (managers.some((m) => m.id.toLowerCase() === `mgr-${nextNum}`)) {
        nextNum++;
      }
      assignedId = `mgr-${nextNum}`;
    }

    if (managers.some((m) => m.id.toLowerCase() === assignedId)) {
      return { success: false, message: `Manager ID '${assignedId}' is already in use. Please choose another ID.` };
    }

    const newManager: StoreMember = {
      id: assignedId,
      email: cleanEmail,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      role: 'STORE_MANAGER',
      phone: data.phone || '+91 90000 00000',
      department: data.department.trim() || 'Store Operations',
      assignedBy: currentUser?.id || 'usr-admin-1',
      assignedByName: 'Mohamed Ukkas (Admin)',
      assignedAt: 'Today',
      status: 'active'
    };

    setManagers((prev) => {
      const updated = [newManager, ...prev];
      try {
        localStorage.setItem('freshmart_managers', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addAuditLog({
      action: 'MANAGER_ASSIGNED',
      title: 'Store Manager Appointed',
      details: `Super Admin Mohamed Ukkas appointed ${newManager.firstName} ${newManager.lastName} (${newManager.email}) as Store Manager for ${newManager.department}`,
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName} (Super Admin)` : 'Mohamed Ukkas (Super Admin)',
      actorEmail: currentUser?.email || ADMIN_EMAIL,
      targetId: newManager.id,
      targetName: `${newManager.firstName} ${newManager.lastName}`,
      targetRole: 'Store Manager',
      severity: 'success'
    });

    showToast(`Store Manager ${newManager.firstName} assigned.`);
    return { success: true, message: `Store Manager successfully assigned with ID: ${newManager.id}`, managerId: newManager.id };
  };

  // 2. Admin deletes Store Manager
  const deleteManager = (managerId: string): { success: boolean; message: string } => {
    // Permission check: Admin can remove manager
    const canDeleteManager = isSuperAdmin;
    if (!canDeleteManager) {
      return { success: false, message: 'Only Super Admin (Mohamed Ukkas) can remove Store Managers.' };
    }

    const cleanId = managerId.trim().toLowerCase();
    const target = managers.find((m) => m.id.toLowerCase() === cleanId || m.email.toLowerCase() === cleanId);
    if (!target) {
      return { success: false, message: 'Manager not found.' };
    }

    // Remove from active managers
    setManagers((prev) => {
      const updated = prev.filter((m) => m.id.toLowerCase() !== cleanId && m.email.toLowerCase() !== target.email.toLowerCase());
      try {
        localStorage.setItem('freshmart_managers', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Save to deleted members audit store
    const deletedRecord: DeletedMemberRecord = {
      id: target.id,
      email: target.email,
      firstName: target.firstName,
      lastName: target.lastName,
      role: target.role,
      department: target.department,
      deletedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      deletedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName} (Super Admin)` : 'Mohamed Ukkas (Super Admin)',
      type: 'manager',
      originalMember: target
    };

    setDeletedMembers((prev) => {
      const updated = [deletedRecord, ...prev];
      try {
        localStorage.setItem('freshmart_deleted_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Log to Audit Log
    addAuditLog({
      action: 'MANAGER_REMOVED',
      title: 'Store Manager Removed',
      details: `Super Admin Mohamed Ukkas removed Store Manager ${target.firstName} ${target.lastName} (${target.email}) from ${target.department}`,
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName} (Super Admin)` : 'Mohamed Ukkas (Super Admin)',
      actorEmail: currentUser?.email || ADMIN_EMAIL,
      targetId: target.id,
      targetName: `${target.firstName} ${target.lastName}`,
      targetRole: 'Store Manager',
      severity: 'danger'
    });

    showToast(`Store Manager ${target.firstName} ${target.lastName} removed.`);
    return { success: true, message: 'Manager removed successfully.' };
  };

  // 3. Store Manager assigns Staff
  const assignStaff = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: StaffRole;
    department: string;
    customId?: string;
  }): { success: boolean; message: string; staffId?: string } => {
    if (!isStoreManager && !isSuperAdmin) return { success: false, message: 'Store manager access required.' };
    const cleanEmail = data.email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Staff Gmail / email is required.' };
    }
    if (staffMembers.some((s) => s.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'A staff member with this email already exists.' };
    }

    let assignedId = data.customId?.trim().toLowerCase();
    if (!assignedId) {
      let nextNum = 1;
      while (staffMembers.some((s) => s.id.toLowerCase() === `staff-${nextNum}`)) {
        nextNum++;
      }
      assignedId = `staff-${nextNum}`;
    }

    if (staffMembers.some((s) => s.id.toLowerCase() === assignedId)) {
      return { success: false, message: `Staff ID '${assignedId}' is already in use. Please choose another ID.` };
    }

    const assignedByName = isStoreManager
      ? `${currentUser?.firstName} ${currentUser?.lastName} (Store Manager)`
      : 'Mohamed Ukkas (Admin)';

    const newStaff: StoreMember = {
      id: assignedId,
      email: cleanEmail,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      role: data.role,
      phone: data.phone || '+91 90000 00000',
      department: data.department.trim() || 'Fulfillment',
      assignedBy: currentUser?.id || 'mgr-1',
      assignedByName,
      assignedAt: 'Today',
      status: 'active'
    };

    setStaffMembers((prev) => {
      const updated = [newStaff, ...prev];
      try {
        localStorage.setItem('freshmart_staff', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addAuditLog({
      action: 'STAFF_ASSIGNED',
      title: 'Staff Member Onboarded',
      details: `${assignedByName} appointed ${newStaff.firstName} ${newStaff.lastName} (${newStaff.email}) to ${newStaff.department}`,
      actor: assignedByName,
      actorEmail: currentUser?.email || 'manager@freshmart.internal',
      targetId: newStaff.id,
      targetName: `${newStaff.firstName} ${newStaff.lastName}`,
      targetRole: newStaff.role,
      severity: 'success'
    });

    showToast(`Staff member ${newStaff.firstName} assigned.`);
    return { success: true, message: `Staff successfully assigned with ID: ${newStaff.id}`, staffId: newStaff.id };
  };

  // 4. Store Manager or Admin deletes Staff
  const deleteStaff = (staffId: string): { success: boolean; message: string } => {
    // Permission check: Manager can remove staffs, Admin can remove staffs too
    const canDeleteStaff = isStoreManager || isSuperAdmin;
    if (!canDeleteStaff) {
      return { success: false, message: 'Only Store Managers or Super Admin can remove Staff members.' };
    }

    const cleanId = staffId.trim().toLowerCase();
    const target = staffMembers.find((s) => s.id.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId);
    if (!target) {
      return { success: false, message: 'Staff member not found.' };
    }

    // Remove from active staff members
    setStaffMembers((prev) => {
      const updated = prev.filter((s) => s.id.toLowerCase() !== cleanId && s.email.toLowerCase() !== target.email.toLowerCase());
      try {
        localStorage.setItem('freshmart_staff', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Also clean up any works assigned to this staff member
    setStaffWorks((prev) => {
      const updated = prev.filter((w) => w.staffId.toLowerCase() !== cleanId && w.staffEmail.toLowerCase() !== target.email.toLowerCase());
      try {
        localStorage.setItem('freshmart_staff_works', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Save to deleted members audit store
    const deletedRecord: DeletedMemberRecord = {
      id: target.id,
      email: target.email,
      firstName: target.firstName,
      lastName: target.lastName,
      role: target.role,
      department: target.department,
      deletedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      deletedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Store Manager',
      type: 'staff',
      originalMember: target
    };

    setDeletedMembers((prev) => {
      const updated = [deletedRecord, ...prev];
      try {
        localStorage.setItem('freshmart_deleted_members', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Log to Audit Log
    addAuditLog({
      action: 'STAFF_REMOVED',
      title: 'Staff Member Removed',
      details: `${currentUser?.firstName || 'Manager'} removed staff member ${target.firstName} ${target.lastName} (${target.email}) from ${target.department}`,
      actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName} (${currentUser.role === 'ADMIN' ? 'Super Admin' : 'Store Manager'})` : 'Store Manager',
      actorEmail: currentUser?.email || 'manager@freshmart.internal',
      targetId: target.id,
      targetName: `${target.firstName} ${target.lastName}`,
      targetRole: target.role,
      severity: 'danger'
    });

    showToast(`Staff member ${target.firstName} ${target.lastName} removed.`);
    return { success: true, message: 'Staff member removed successfully.' };
  };

  // 4b. Admin or Store Manager assigns member by email to any role
  const assignMemberByEmail = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'STORE_MANAGER' | StaffRole;
    department?: string;
    customId?: string;
  }): { success: boolean; message: string; memberId?: string } => {
    if (!isStoreManager && !isSuperAdmin) return { success: false, message: 'Management access required.' };
    if (data.role === 'STORE_MANAGER') {
      const res = assignManager({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department || 'Store Operations & Logistics',
        customId: data.customId
      });
      return { success: res.success, message: res.message, memberId: res.managerId };
    } else {
      const defaultDept =
        data.role === 'STAFF_PACKER' ? 'Order Fulfillment & Packing' :
        data.role === 'STAFF_STOCKER' ? 'Shelf & Inventory Replenishment' :
        data.role === 'STAFF_DISPATCH' ? 'Fleet & Express Courier' : 'Store Operations';

      const res = assignStaff({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        department: data.department || defaultDept,
        customId: data.customId
      });
      return { success: res.success, message: res.message, memberId: res.staffId };
    }
  };

  // 5. Store Manager assigns task/work to Staff
  const assignWorkToStaff = (data: {
    staffId: string;
    title: string;
    description: string;
    category: 'packing' | 'stocking' | 'delivery' | 'inspection';
    orderId?: string;
    itemsSummary?: string;
    location?: string;
    notes?: string;
  }): { success: boolean; message: string } => {
    if (!isStoreManager && !isSuperAdmin) return { success: false, message: 'Store manager access required.' };
    if (!isStoreManager && !isSuperAdmin) {
      return { success: false, message: 'Only Store Managers can assign work duties.' };
    }
    const targetStaff = staffMembers.find((s) => s.id === data.staffId);
    if (!targetStaff) {
      return { success: false, message: 'Selected staff member not found.' };
    }

    const assignedByName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Store Manager';

    const newWork: StaffWorkItem = {
      id: `work-${Date.now()}`,
      staffId: targetStaff.id,
      staffEmail: targetStaff.email,
      staffName: `${targetStaff.firstName} ${targetStaff.lastName}`,
      staffRole: targetStaff.role as StaffRole,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      status: 'approved', // Pre-approved by manager
      assignedByManagerId: currentUser?.id || 'mgr-1',
      assignedByManagerName: assignedByName,
      assignedAt: 'Today, Just now',
      orderId: data.orderId,
      itemsSummary: data.itemsSummary,
      location: data.location,
      notes: data.notes
    };

    setStaffWorks((prev) => [newWork, ...prev]);

    addAuditLog({
      action: 'TASK_ASSIGNED',
      title: 'Staff Task Dispatched',
      details: `${assignedByName} dispatched "${data.title}" to ${targetStaff.firstName} ${targetStaff.lastName} (${targetStaff.email})`,
      actor: assignedByName,
      actorEmail: currentUser?.email || 'manager@freshmart.internal',
      targetId: targetStaff.id,
      targetName: `${targetStaff.firstName} ${targetStaff.lastName}`,
      targetRole: targetStaff.role,
      severity: 'info'
    });

    showToast(`Approved work assigned to ${targetStaff.firstName}.`);
    return { success: true, message: 'Work assigned.' };
  };

  // 6. Staff updates work status
  const updateWorkStatus = (workId: string, status: WorkStatus, notes?: string) => {
    const targetItem = staffWorks.find((w) => w.id === workId);
    if (!targetItem || (!isSuperAdmin && !isStoreManager && (!isStaffMember || targetItem.staffId !== currentUser?.id))) return;

    setStaffWorks((prev) =>
      prev.map((w) => {
        if (w.id === workId) {
          return {
            ...w,
            status,
            notes: notes !== undefined ? notes : w.notes,
            completedAt: status === 'completed' ? 'Today, Just now' : w.completedAt
          };
        }
        return w;
      })
    );

    if (targetItem) {
      addAuditLog({
        action: 'TASK_UPDATED',
        title: `Task Status Updated (${status.replace('_', ' ').toUpperCase()})`,
        details: `${currentUser?.firstName || targetItem.staffName} marked "${targetItem.title}" as ${status.replace('_', ' ')}`,
        actor: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : targetItem.staffName,
        targetId: targetItem.id,
        targetName: targetItem.title,
        severity: status === 'completed' ? 'success' : 'info'
      });
    }

    showToast(`Work status updated to ${status.replace('_', ' ')}.`);
  };

  // Cart operations (Guest or Logged in, with Weight Variants and Custom Cuts)
  const getItemPrice = (item: CartItem): number => {
    const base = item.selectedVariant ? item.selectedVariant.price : item.product.price;
    const cutExtra = item.selectedCut?.extraPrice ?? 0;
    return base + cutExtra;
  };

  const addToCart = (
    product: Product, 
    quantity: number = 1,
    selectedVariant?: WeightVariant,
    selectedCut?: CutOption
  ) => {
    if (quantity <= 0) return;
    const available = products.find((item) => item.id === product.id)?.stockCount ?? 0;
    setCart((prev) => {
      const inOtherVariants = prev.filter((item) => item.product.id === product.id && !(item.selectedVariant?.id === selectedVariant?.id && item.selectedCut?.type === selectedCut?.type)).reduce((sum, item) => sum + item.quantity, 0);
      const allowedQuantity = Math.min(quantity, Math.max(0, available - inOtherVariants));
      if (!allowedQuantity) {
        showToast(available ? `Only ${available} ${product.name} available` : `${product.name} is out of stock`);
        return prev;
      }
      const existing = prev.find((item) => 
        item.product.id === product.id && 
        item.selectedVariant?.id === selectedVariant?.id &&
        item.selectedCut?.type === selectedCut?.type
      );
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: Math.min(available - inOtherVariants, item.quantity + allowedQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: allowedQuantity, selectedVariant, selectedCut }];
    });

    const customLabel = [selectedVariant?.label, selectedCut?.label].filter(Boolean).join(' · ');
    showToast(`Added ${product.name}${customLabel ? ` (${customLabel})` : ''} to basket`);
  };

  const removeFromCart = (productId: string, variantId?: string, cutType?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        if (variantId || cutType) {
          return !(
            item.product.id === productId &&
            item.selectedVariant?.id === variantId &&
            item.selectedCut?.type === cutType
          );
        }
        return item.product.id !== productId;
      })
    );
  };

  const updateCartQuantity = (
    productId: string, 
    quantity: number, 
    variantId?: string, 
    cutType?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId, cutType);
      return;
    }
    const available = products.find((item) => item.id === productId)?.stockCount ?? 0;
    setCart((prev) =>
      prev.map((item) => {
        const match =
          item.product.id === productId &&
          (variantId ? item.selectedVariant?.id === variantId : true) &&
          (cutType ? item.selectedCut?.type === cutType : true);
        if (!match) return item;
        const inOtherVariants = prev.filter((other) => other.product.id === productId && other !== item).reduce((sum, other) => sum + other.quantity, 0);
        return { ...item, quantity: Math.min(Math.max(0, available - inOtherVariants), quantity) };
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Wishlist Gate (Authentication Required!)
  const toggleWishlist = (productId: string) => {
    if (!isAuthenticated) {
      openAuthModal('wishlist', productId);
      return;
    }

    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast('Removed from saved items');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Computations
  const cartSubtotal = cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  // Delivery is free over ?1,920, otherwise ?287.
  const deliveryFee = cartSubtotal > 1920 || cartSubtotal === 0 ? 0 : 287;

  let couponDiscount = 0;
  if (activeCoupon && cartSubtotal >= activeCoupon.minSpend) {
    if (activeCoupon.discountType === 'percentage') {
      const rawDiscount = (cartSubtotal * activeCoupon.value) / 100;
      couponDiscount = Math.min(rawDiscount, 1440); // max ?1,440
    } else {
      couponDiscount = activeCoupon.value;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + deliveryFee - couponDiscount);
  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon handling
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try FRESH30 or WELCOME10' };
    }
    if (cartSubtotal < found.minSpend) {
      return { 
        success: false, 
        message: `Requires minimum order of ?${found.minSpend}. Add ?${(found.minSpend - cartSubtotal).toFixed(2)} more.` 
      };
    }
    setActiveCoupon(found);
    showToast(`Applied ${found.code}: Save on your fresh groceries!`);
    return { success: true, message: `Applied ${found.code} successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Promo code removed');
  };

  // Place order
  const placeOrder = ({
    address,
    slot,
    paymentMethod
  }: {
    address: DeliveryAddress;
    slot: string;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
  }): Order => {
    if (!address) throw new Error('A delivery address is required.');
    if (cart.length === 0) throw new Error('Your basket is empty.');
    const unavailable = cart.find((item) => item.quantity > (products.find((product) => product.id === item.product.id)?.stockCount ?? 0));
    if (unavailable) throw new Error(`${unavailable.product.name} no longer has enough stock. Update your basket and try again.`);
    const newOrderId = `FM${crypto.randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
    const newOrder: Order = {
      id: newOrderId,
      createdAt: 'Just now',
      customerName: address.recipientName,
      customerPhone: address.phone,
      customerEmail: currentUser?.email || 'customer@freshmart.com',
      address,
      slot,
      paymentMethod,
      status: 'placed',
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.selectedCut ? `${item.product.name} (${item.selectedCut.label})` : item.product.name,
        brand: item.product.brand,
        unit: item.selectedVariant ? item.selectedVariant.label : item.product.unit,
        price: getItemPrice(item),
        quantity: item.quantity,
        image: item.product.image,
        variantLabel: item.selectedVariant?.label,
        cutLabel: item.selectedCut?.label
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discount: couponDiscount,
      total: cartTotal,
      canCancel: true,
      estimatedDeliveryTime: 'Awaiting store confirmation'
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          const newStock = prod.stockCount - cartMatch.quantity;
          return {
            ...prod,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setTrackingOrder(newOrder);
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  // Order Cancellation (Specification Section 35)
  const cancelOrder = (orderId: string, reason: string = 'Customer requested cancellation') => {
    const target = orders.find(o => o.id === orderId);
    if (!target) {
      return { success: false, message: 'Order not found' };
    }

    if (target.status !== 'placed' && target.status !== 'confirmed') {
      return { 
        success: false, 
        message: `Order cannot be cancelled in '${target.status}' stage as packaging/dispatch has begun.` 
      };
    }

    // Restore inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const itemMatch = target.items.find(i => i.productId === prod.id);
        if (itemMatch) {
          const restoredStock = prod.stockCount + itemMatch.quantity;
          return {
            ...prod,
            stockCount: restoredStock,
            inStock: restoredStock > 0
          };
        }
        return prod;
      })
    );

    // Update order status
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, status: 'cancelled', canCancel: false, cancellationReason: reason }
          : ord
      )
    );

    if (trackingOrder?.id === orderId) {
      setTrackingOrder((prev) => prev ? { ...prev, status: 'cancelled', canCancel: false } : null);
    }

    showToast(`Order #${orderId} cancelled. Stock restored to inventory.`);
    return { success: true, message: 'Order cancelled successfully' };
  };

  // Order status management (for staff/admin)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (!isStaff) return;
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    if (trackingOrder && trackingOrder.id === orderId) {
      setTrackingOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Order #${orderId} status set to ${status.replace(/_/g, ' ')}`);
  };

  // Inventory management
  const restockProduct = (productId: string, count: number) => {
    if (!isStaff) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newCount = Math.max(0, p.stockCount + count);
          return {
            ...p,
            stockCount: newCount,
            inStock: newCount > 0
          };
        }
        return p;
      })
    );
    showToast(`Restocked SKU`);
  };

  const updateProduct = (updated: Product) => {
    if (!isStaff) return;
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated ${updated.name}`);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    if (!isStaff) return;
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added ${newProduct.name} to catalog`);
  };

  const addAddress = (addressData: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    setAddresses((prev) => [newAddr, ...prev]);
    showToast('Saved new delivery address');
  };

  // Filtered and sorted products
  const filteredProducts = products.filter((prod) => {
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const brandMatch = prod.brand.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchDietary = prod.dietary?.some((d) => d.toLowerCase().includes(q));
      if (!matchName && !brandMatch && !matchDesc && !matchDietary) {
        return false;
      }
    }
    if (inStockOnly && !prod.inStock) {
      return false;
    }
    if (prod.price < priceRange[0] || prod.price > priceRange[1]) {
      return false;
    }
    if (dietaryFilter.length > 0) {
      const hasAllDietary = dietaryFilter.every((d) =>
        prod.dietary?.includes(d as any)
      );
      if (!hasAllDietary) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewCount - a.reviewCount; // popular
  });

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isStaff,
        isSuperAdmin,
        isStoreManager,
        isStaffMember,

        managers,
        staffMembers,
        staffWorks,

        isAuthModalOpen,
        authIntent,
        pendingWishlistProductId,

        products,
        categories,
        cart,
        wishlist,
        orders,
        addresses,
        activeCoupon,
        selectedCategory,
        searchQuery,
        sortBy,
        dietaryFilter,
        priceRange,
        inStockOnly,
        isCartOpen,
        isCheckoutOpen,
        isAccountOpen,
        trackingOrder,
        selectedProduct,
        currentView,
        toastMessage,

        setSelectedCategory,
        setSearchQuery,
        setSortBy,
        setDietaryFilter,
        setPriceRange,
        setInStockOnly,
        setIsCartOpen,
        setIsCheckoutOpen,
        setIsAccountOpen,
        setTrackingOrder,
        setSelectedProduct,
        setCurrentView,
        setCurrentUser,
        handlePostLoginMigration,

        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        loginWithId,
        signupWithEmail,
        logout,

        darkStores,
        selectedDarkStore,
        setSelectedDarkStore,
        isDarkStoreModalOpen,
        setIsDarkStoreModalOpen,
        customizingProduct,
        setCustomizingProduct,

        assignManager,
        deleteManager,
        assignStaff,
        deleteStaff,
        assignMemberByEmail,
        assignWorkToStaff,
        updateWorkStatus,

        auditLogs,
        addAuditLog,
        clearAuditLogs,
        deletedMembers,
        restoreMember,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        restockProduct,
        updateProduct,
        addProduct,
        addAddress,
        showToast,

        cartSubtotal,
        deliveryFee,
        couponDiscount,
        cartTotal,
        totalCartItemsCount,
        filteredProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
