export type CategoryId = 
  | 'fruits-veg'
  | 'dairy-eggs'
  | 'bakery'
  | 'beverages'
  | 'snacks'
  | 'organic-pantry'
  | 'household';

export interface Category {
  id: CategoryId;
  name: string;
  itemCount: number;
  image: string;
  description: string;
}

export interface WeightVariant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  discountPercent?: number;
  isPopular?: boolean;
}

export type CutType = 'whole' | 'diced' | 'peeled' | 'sliced' | 'florets' | 'grated';

export interface CutOption {
  type: CutType;
  label: string;
  extraPrice?: number;
  description?: string;
}

export interface DarkStoreInfo {
  id: string;
  name: string;
  city: string;
  address: string;
  distanceKm: number;
  etaMinutes: number;
  activeRidersCount: number;
  packingQueueCount: number;
  temperatureCelsius: number;
  status: 'Optimal' | 'High Demand' | 'Lightning Fast';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  unit: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  image: string;
  images?: string[];
  description: string;
  origin?: string;
  dietary?: ('Organic' | 'Farm Fresh' | 'Vegan' | 'Gluten-Free' | 'Non-GMO')[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  storage?: string;
  isDeal?: boolean;
  featured?: boolean;
  // Zepto Hyperlocal & KPN Fresh Real-Time Extensions
  harvestTime?: string;
  freshnessScore?: number;
  darkStoreName?: string;
  deliveryEtaMins?: number;
  recentOrdersCount?: number;
  weightVariants?: WeightVariant[];
  cutOptions?: CutOption[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: WeightVariant;
  selectedCut?: CutOption;
}

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'packing' 
  | 'out_for_delivery' 
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
  variantLabel?: string;
  cutLabel?: string;
}

export interface DeliveryAddress {
  id: string;
  title: 'Home' | 'Work' | 'Other';
  recipientName: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface DeliverySlot {
  day: 'Today' | 'Tomorrow';
  time: string;
  isAvailable: boolean;
}

export interface DeliveryAgent {
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  photo: string;
  currentLocation: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: DeliveryAddress;
  slot: string;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAgent?: DeliveryAgent;
  estimatedDeliveryTime?: string;
  canCancel?: boolean;
  cancellationReason?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend: number;
  description: string;
}

export type StockStatus = 'healthy' | 'low' | 'critical' | 'out_of_stock';

export type StaffRole = 
  | 'STAFF_PACKER' 
  | 'STAFF_STOCKER' 
  | 'STAFF_DISPATCH' 
  | 'STAFF';

export type UserRole = 
  | 'CUSTOMER' 
  | 'ADMIN' 
  | 'STORE_MANAGER'
  | StaffRole
  | 'INVENTORY_MANAGER' 
  | 'ORDER_MANAGER' 
  | 'DELIVERY_AGENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface StoreMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STORE_MANAGER' | StaffRole;
  phone?: string;
  department: string;
  assignedBy: string; // 'usr-admin-1' or manager id
  assignedByName: string; // 'Mohamed Ukkas' or manager name
  assignedAt: string;
  status: 'active' | 'inactive';
}

export type WorkStatus = 'approved' | 'in_progress' | 'completed';

export interface StaffWorkItem {
  id: string;
  staffId: string;
  staffEmail: string;
  staffName: string;
  staffRole: StaffRole;
  title: string;
  description: string;
  category: 'packing' | 'stocking' | 'delivery' | 'inspection';
  status: WorkStatus;
  assignedByManagerId: string;
  assignedByManagerName: string;
  assignedAt: string;
  completedAt?: string;
  orderId?: string;
  itemsSummary?: string;
  location?: string;
  notes?: string;
}

export type AuthIntent = 'wishlist' | 'checkout' | 'account' | 'admin' | 'staff' | 'general';

export interface DeletedMemberRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  deletedAt: string;
  deletedBy: string;
  type: 'manager' | 'staff';
  originalMember: StoreMember;
}

export type AuditActionType =
  | 'MANAGER_ASSIGNED'
  | 'MANAGER_REMOVED'
  | 'STAFF_ASSIGNED'
  | 'STAFF_REMOVED'
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'MEMBER_RESTORED'
  | 'SECURITY_LOGIN';

export interface AuditLogEntry {
  id: string;
  action: AuditActionType;
  title: string;
  details: string;
  actor: string;
  actorEmail?: string;
  targetId?: string;
  targetName?: string;
  targetRole?: string;
  timestamp: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}
