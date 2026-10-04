import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Boxes, 
  Truck, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowLeft,
  Search,
  RefreshCw,
  Edit3,
  UserCheck,
  UserPlus,
  Trash2,
  Briefcase,
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  X,
  Clock,
  MapPin,
  Layers,
  Copy,
  CheckCheck,
  KeyRound,
  History,
  UserX,
  RotateCcw,
  Filter,
  FileText,
  Download
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, OrderStatus, CategoryId, StaffRole, AuditLogEntry, AuditActionType } from '../../types';
import { ADMIN_EMAIL } from '../../services/authService';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    categories,
    updateOrderStatus,
    restockProduct,
    addProduct,
    setCurrentView,
    setTrackingOrder,
    currentUser,
    isAuthenticated,
    isStaff,
    isSuperAdmin,
    isStoreManager,
    isStaffMember,
    managers,
    staffMembers,
    staffWorks,
    assignManager,
    deleteManager,
    assignStaff,
    deleteStaff,
    assignMemberByEmail,
    assignWorkToStaff,
    updateWorkStatus,
    auditLogs,
    clearAuditLogs,
    deletedMembers,
    restoreMember,
    openAuthModal,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'managers' | 'staff-team' | 'work-dispatch' | 'audit-log' | 'inventory' | 'orders' | 'add-product'>('overview');
  const [inventorySearch, setInventorySearch] = useState('');
  const [restockAmounts, setRestockAmounts] = useState<Record<string, string>>({});
  const [selectedOrderFilter, setSelectedOrderFilter] = useState<'all' | OrderStatus>('all');

  // Audit Log State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<'all' | 'removals' | 'additions' | 'tasks' | 'security'>('all');
  const [auditSubTab, setAuditSubTab] = useState<'timeline' | 'archive'>('timeline');

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCat, setNewProdCat] = useState<CategoryId>('fruits-veg');
  const [newProdUnit, setNewProdUnit] = useState('500g');
  const [newProdPrice, setNewProdPrice] = useState('383');
  const [newProdMrp, setNewProdMrp] = useState('479');
  const [newProdStock, setNewProdStock] = useState('50');
  const [newProdSku, setNewProdSku] = useState(`FM-${Math.floor(100 + Math.random() * 900)}`);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Unified Assign Member by Email (Super Admin Mohamed Ukkas)
  const [showAssignMemberModal, setShowAssignMemberModal] = useState(false);
  const [assignRole, setAssignRole] = useState<'STORE_MANAGER' | StaffRole>('STORE_MANAGER');
  const [assignEmail, setAssignEmail] = useState('');
  const [assignFirstName, setAssignFirstName] = useState('');
  const [assignLastName, setAssignLastName] = useState('');
  const [assignDept, setAssignDept] = useState('Store Operations & Logistics');
  const [assignPhone, setAssignPhone] = useState('');

  // Assign Manager Form State (Admin Mohamed Ukkas only)
  const [newMgrFirstName, setNewMgrFirstName] = useState('');
  const [newMgrLastName, setNewMgrLastName] = useState('');
  const [newMgrEmail, setNewMgrEmail] = useState('');
  const [newMgrCustomId, setNewMgrCustomId] = useState('');
  const [newMgrPhone, setNewMgrPhone] = useState('');
  const [newMgrDept, setNewMgrDept] = useState('Store Operations & Logistics');
  const [showAddManagerModal, setShowAddManagerModal] = useState(false);

  // Assign Staff Form State (Store Manager only)
  const [newStaffFirstName, setNewStaffFirstName] = useState('');
  const [newStaffLastName, setNewStaffLastName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffCustomId, setNewStaffCustomId] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('STAFF_PACKER');
  const [newStaffDept, setNewStaffDept] = useState('Order Fulfillment & Packing');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Assign Work Item Form State (Store Manager only)
  const [workStaffId, setWorkStaffId] = useState(staffMembers[0]?.id || '');
  const [workTitle, setWorkTitle] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [workCategory, setWorkCategory] = useState<'packing' | 'stocking' | 'delivery' | 'inspection'>('packing');
  const [workOrderId, setWorkOrderId] = useState('FM10291');
  const [workLocation, setWorkLocation] = useState('Packing Station 1');
  const [workNotes, setWorkNotes] = useState('');
  const [showAssignWorkModal, setShowAssignWorkModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'manager' | 'staff';
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyIdToClipboard = (idText: string) => {
    navigator.clipboard?.writeText(idText);
    setCopiedId(idText);
    showToast(`Copied ID: ${idText}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getNextManagerId = () => {
    let n = 1;
    while (managers.some((m) => m.id.toLowerCase() === `mgr-${n}`)) n++;
    return `mgr-${n}`;
  };

  const getNextStaffId = () => {
    let n = 1;
    while (staffMembers.some((s) => s.id.toLowerCase() === `staff-${n}`)) n++;
    return `staff-${n}`;
  };

  // If user is a staff member, automatically direct to their dedicated workspace
  if (currentUser?.role && (currentUser.role.startsWith('STAFF') || currentUser.role === 'STAFF')) {
    setCurrentView('staff');
    return null;
  }

  // Authorization Gate (Restricted to Admin Mohamed Ukkas or Store Managers)
  if (!isAuthenticated || (!isSuperAdmin && !isStoreManager)) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800 rounded-3xl p-8 border border-stone-700 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
            🔑
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-white">Management Access Restricted</h2>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              Supermarket store inventory, packing pipelines, and staff management require authorized <strong>Store Manager</strong> or <strong>Super Admin (mohamedukkas.ai@gmail.com)</strong> access.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => openAuthModal('admin')}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Sign In with Management Account
            </button>
            <button
              onClick={() => setCurrentView('storefront')}
              className="w-full py-2.5 text-stone-400 hover:text-white text-xs font-medium cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrdersCount = orders.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length;
  const lowStockCount = products.filter(p => p.stockCount <= 10).length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const deliveredOrdersCount = orders.filter((order) => order.status === 'delivered').length;
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const fulfillmentRate = orders.length ? Math.round((deliveredOrdersCount / orders.length) * 100) : 0;
  const stockHealth = products.length ? Math.round(((products.length - lowStockCount) / products.length) * 100) : 100;
  const revenueTrendOrders = [...orders].reverse().slice(-8);
  const revenueTrendMax = Math.max(1, ...revenueTrendOrders.map((order) => order.total));
  const revenueTrendPoints = revenueTrendOrders.map((order, index) => ({
    order,
    x: revenueTrendOrders.length === 1 ? 380 : 28 + (index * 704) / (revenueTrendOrders.length - 1),
    y: 190 - (order.total / revenueTrendMax) * 148
  }));
  const revenueTrendLine = revenueTrendPoints.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const revenueTrendArea = revenueTrendPoints.length
    ? `${revenueTrendLine} L ${revenueTrendPoints[revenueTrendPoints.length - 1].x} 202 L ${revenueTrendPoints[0].x} 202 Z`
    : '';
  const categoryPerformance = categories.map((category) => {
    const revenue = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product?.category === category.id ? itemSum + item.price * item.quantity : itemSum;
    }, 0), 0);
    return { ...category, revenue };
  }).sort((a, b) => b.revenue - a.revenue);
  const categoryRevenueTotal = categoryPerformance.reduce((sum, category) => sum + category.revenue, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const price = parseFloat(newProdPrice) || 0;
    const mrp = parseFloat(newProdMrp) || price;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    addProduct({
      name: newProdName,
      brand: newProdBrand || 'FreshMart Farms',
      category: newProdCat,
      unit: newProdUnit,
      price,
      mrp,
      discountPercent: discount,
      rating: 4.8,
      reviewCount: 1,
      inStock: parseInt(newProdStock) > 0,
      stockCount: parseInt(newProdStock) || 0,
      sku: newProdSku,
      image: newProdImage,
      description: newProdDesc || 'Fresh supermarket produce inspected for peak flavor and quality.',
      origin: 'Regional Harvest',
      dietary: ['Farm Fresh']
    });

    // Reset
    setNewProdName('');
    setNewProdDesc('');
    setActiveTab('inventory');
  };

  const handleAssignMemberUnified = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignFirstName.trim() || !assignEmail.trim()) return;
    const res = assignMemberByEmail({
      firstName: assignFirstName.trim(),
      lastName: assignLastName.trim(),
      email: assignEmail.trim(),
      phone: assignPhone.trim() || undefined,
      role: assignRole,
      department: assignDept.trim() || undefined
    });
    if (res.success) {
      setAssignFirstName('');
      setAssignLastName('');
      setAssignEmail('');
      setAssignPhone('');
      setShowAssignMemberModal(false);
    }
  };

  const handleAssignManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMgrFirstName.trim() || !newMgrEmail.trim()) return;
    const res = assignManager({
      firstName: newMgrFirstName,
      lastName: newMgrLastName,
      email: newMgrEmail,
      phone: newMgrPhone,
      department: newMgrDept,
      customId: newMgrCustomId.trim() || undefined
    });
    if (res.success) {
      setNewMgrFirstName('');
      setNewMgrLastName('');
      setNewMgrEmail('');
      setNewMgrCustomId('');
      setShowAddManagerModal(false);
    }
  };

  const handleAssignStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffFirstName.trim() || !newStaffEmail.trim()) return;
    const res = assignStaff({
      firstName: newStaffFirstName,
      lastName: newStaffLastName,
      email: newStaffEmail,
      phone: newStaffPhone,
      role: newStaffRole,
      department: newStaffDept,
      customId: newStaffCustomId.trim() || undefined
    });
    if (res.success) {
      setNewStaffFirstName('');
      setNewStaffLastName('');
      setNewStaffEmail('');
      setNewStaffCustomId('');
      setShowAddStaffModal(false);
    }
  };

  const handleCreateWork = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStaff = staffMembers.find((s) => s.id === workStaffId) || staffMembers[0];
    if (!targetStaff || !workTitle.trim()) return;
    const res = assignWorkToStaff({
      staffId: targetStaff.id,
      title: workTitle,
      description: workDesc || workTitle,
      category: workCategory,
      orderId: workOrderId || undefined,
      location: workLocation,
      notes: workNotes
    });
    if (res.success) {
      setWorkTitle('');
      setWorkDesc('');
      setWorkNotes('');
      setShowAssignWorkModal(false);
    }
  };

  const getStockStatus = (count: number) => {
    if (count <= 0) return { label: 'Out of Stock', color: 'text-red-700 bg-red-100', icon: XCircle };
    if (count <= 5) return { label: 'Critical', color: 'text-rose-700 bg-rose-100', icon: AlertTriangle };
    if (count <= 15) return { label: 'Low Stock', color: 'text-amber-800 bg-amber-100', icon: AlertTriangle };
    return { label: 'Healthy', color: 'text-emerald-800 bg-emerald-100', icon: CheckCircle };
  };

  const filteredInventory = products.filter(p =>
    p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  const filteredOrders = selectedOrderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === selectedOrderFilter);

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'removals' && !(log.action === 'MANAGER_REMOVED' || log.action === 'STAFF_REMOVED')) return false;
    if (auditFilter === 'additions' && !(log.action === 'MANAGER_ASSIGNED' || log.action === 'STAFF_ASSIGNED' || log.action === 'MEMBER_RESTORED')) return false;
    if (auditFilter === 'tasks' && !(log.action === 'TASK_ASSIGNED' || log.action === 'TASK_UPDATED')) return false;
    if (auditFilter === 'security' && !(log.action === 'SECURITY_LOGIN')) return false;

    if (auditSearch.trim()) {
      const q = auditSearch.toLowerCase();
      const match =
        log.title.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        (log.actorEmail && log.actorEmail.toLowerCase().includes(q)) ||
        (log.targetName && log.targetName.toLowerCase().includes(q)) ||
        (log.targetId && log.targetId.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    ...(isSuperAdmin ? [{ id: 'managers', label: `Managers (${managers.length})`, icon: UserCheck }] : []),
    { id: 'staff-team', label: `Team (${staffMembers.length})`, icon: Users },
    { id: 'work-dispatch', label: `Tasks (${staffWorks.length})`, icon: ClipboardList },
    { id: 'audit-log', label: `Audit (${auditLogs.length})`, icon: History },
    { id: 'inventory', label: `Inventory (${products.length})`, icon: Boxes },
    { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
    { id: 'add-product', label: 'Add Product', icon: Plus },
  ];

  return (
    <div className={`admin-console min-h-screen pb-16 admin-view-${activeTab}`}>
      
      {/* Top Admin Header Bar */}
      <header className="admin-console-header text-white px-4 sm:px-8 py-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('storefront')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </button>
            <div className="sm:border-l sm:border-white/15 sm:pl-4">
              <div className="text-[10px] uppercase tracking-[.16em] text-emerald-200 font-semibold mb-1">FreshMart / Operations</div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white flex flex-wrap items-center gap-2">
                <span>Store operations</span>
                {isSuperAdmin ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wider">
                    Super Admin (Mohamed Ukkas)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-stone-950 uppercase tracking-wider">
                    Store Manager ({currentUser?.firstName})
                  </span>
                )}
              </h1>
              <div className="text-xs text-stone-300 mt-1">
                {isSuperAdmin 
                  ? 'System Owner: Assign & manage Store Managers, fulfillment pipeline, and store catalog' 
                  : 'Fulfillment Lead: Assign & supervise staff, dispatch orders, and monitor inventory'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/15 text-emerald-200 flex items-center justify-center font-bold text-sm">
              {(currentUser?.firstName || 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-stone-200">
                {currentUser?.firstName} {currentUser?.lastName}
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                {currentUser?.email}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="admin-main max-w-[1440px] mx-auto px-4 sm:px-8 pt-5 sm:pt-7 space-y-6 sm:space-y-7">
        
        {/* Navigation Tabs */}
        <div className="admin-console-nav flex items-center gap-1.5 px-1 py-2 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`admin-nav-tab flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                  ? 'is-active bg-emerald-800 text-white shadow-sm'
                    : 'bg-transparent border border-transparent text-stone-600 hover:bg-white hover:border-stone-200 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="admin-overview space-y-7">
            <div className="admin-page-intro flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[.12em] text-emerald-800">Store overview</div>
                <h2 className="font-display text-2xl sm:text-[30px] font-bold tracking-tight text-stone-900 mt-1">Good to see you, {currentUser?.firstName || 'there'}.</h2>
                <p className="text-sm text-stone-500 mt-1">A clear snapshot of sales, orders, and stock.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 pb-1"><span className="inline-block w-2 h-2 rounded-full bg-emerald-600" /> Live store snapshot <span className="text-stone-300">·</span> All recorded orders</div>
            </div>
            {/* Top Metric Cards */}
            <div className="admin-metrics grid grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="admin-metric-card bg-white rounded-xl border border-stone-200/90 p-5">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <span>Recorded Revenue</span><span className="admin-metric-icon bg-emerald-50 text-emerald-800"><DollarSign className="h-4 w-4" /></span>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-2">
                  ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-800 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> From recorded orders
                </div>
              </div>

              <div className="admin-metric-card bg-white rounded-xl border border-stone-200/90 p-5">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <span>Total Orders</span><span className="admin-metric-icon bg-blue-50 text-blue-800"><Package className="h-4 w-4" /></span>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-2">
                  {orders.length}
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  {activeOrdersCount} currently in progress
                </div>
              </div>

              <div className="admin-metric-card bg-white rounded-xl border border-stone-200/90 p-5">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <span>Low Stock SKUs</span><span className="admin-metric-icon bg-amber-50 text-amber-800"><AlertTriangle className="h-4 w-4" /></span>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-800 mt-2">
                  {lowStockCount}
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  Products with 10 units or fewer
                </div>
              </div>

              <div className="admin-metric-card bg-white rounded-xl border border-stone-200/90 p-5">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold text-stone-600 uppercase tracking-wider">
                  <span>Catalog Items</span><span className="admin-metric-icon bg-violet-50 text-violet-800"><Boxes className="h-4 w-4" /></span>
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-2">
                  {products.length}
                </div>
                <div className="text-xs text-stone-600 mt-1">
                  {totalStockUnits.toLocaleString('en-IN')} units across all products
                </div>
              </div>
            </div>
            <div className="admin-insight-strip grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><span className="admin-insight-icon"><TrendingUp className="h-4 w-4" /></span><span className="admin-insight-copy"><small>Average order value</small><strong>₹{averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></span><span className="admin-insight-note">per order</span></div>
              <div><span className="admin-insight-icon admin-insight-amber"><CheckCircle2 className="h-4 w-4" /></span><span className="admin-insight-copy"><small>Fulfillment rate</small><strong>{fulfillmentRate}%</strong></span><span className="admin-insight-note">{deliveredOrdersCount} delivered</span></div>
              <div><span className="admin-insight-icon admin-insight-blue"><Layers className="h-4 w-4" /></span><span className="admin-insight-copy"><small>Catalog health</small><strong>{stockHealth}%</strong></span><span className="admin-insight-note">{lowStockCount} need attention</span></div>
            </div>

            {isSuperAdmin && (
              <section className="admin-quick-actions rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Team management</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-stone-900">Manage store access</h3>
                    <p className="mt-1 text-sm text-stone-600">Assign managers and fulfillment staff, then review your team roster.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowAssignMemberModal(true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900">
                      <UserPlus className="h-4 w-4" /> Assign a member
                    </button>
                    <button onClick={() => setActiveTab('managers')} className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Managers ({managers.length})</button>
                    <button onClick={() => setActiveTab('staff-team')} className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Staff ({staffMembers.length})</button>
                  </div>
                </div>
              </section>
            )}

            {/* Category Performance & Recent Orders Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Recorded order revenue chart */}
              <section className="admin-chart-panel lg:col-span-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="admin-chart-mark"><TrendingUp className="h-4 w-4" /></span>
                      <h3 className="font-display font-bold text-base text-stone-900">Recorded revenue trend</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-stone-500">Order totals in the order they were recorded</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">Recorded revenue</div>
                    <div className="mt-0.5 text-sm font-bold text-emerald-950">₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>

                <div className="admin-chart-wrap mt-5">
                  {revenueTrendPoints.length > 0 ? (
                    <svg className="admin-revenue-chart" viewBox="0 0 760 250" role="img" aria-label={`Revenue from ${revenueTrendOrders.length} recorded orders`}>
                      <defs>
                        <linearGradient id="adminRevenueFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#16834a" stopOpacity=".22" />
                          <stop offset="100%" stopColor="#16834a" stopOpacity=".01" />
                        </linearGradient>
                        <linearGradient id="adminRevenueStroke" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#13834a" />
                          <stop offset="100%" stopColor="#49b477" />
                        </linearGradient>
                      </defs>
                      {[42, 95, 148, 202].map((y) => <line key={y} x1="20" x2="740" y1={y} y2={y} className="admin-chart-gridline" />)}
                      <path d={revenueTrendArea} fill="url(#adminRevenueFill)" className="admin-chart-area" />
                      <path d={revenueTrendLine} fill="none" stroke="url(#adminRevenueStroke)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="admin-chart-line" />
                      {revenueTrendPoints.map(({ order, x, y }, index) => (
                        <g key={order.id} className="admin-chart-point" style={{ animationDelay: `${260 + index * 90}ms` }}>
                          <circle cx={x} cy={y} r="11" fill="#16834a" opacity=".09" />
                          <circle cx={x} cy={y} r="4.5" fill="#fff" stroke="#16834a" strokeWidth="2.5" />
                          <title>{`${order.createdAt}: ₹${order.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}</title>
                        </g>
                      ))}
                      {revenueTrendPoints.map(({ order, x }) => (
                        <text key={`${order.id}-label`} x={x} y="232" textAnchor="middle" className="admin-chart-label">
                          {order.createdAt.split(',')[0].slice(0, 12)}
                        </text>
                      ))}
                    </svg>
                  ) : (
                    <div className="admin-chart-empty">
                      <TrendingUp className="h-7 w-7 text-emerald-700/60" />
                      <p className="mt-2 text-sm font-semibold text-stone-700">Your revenue chart will appear here</p>
                      <p className="mt-1 text-xs text-stone-500">Recorded order totals will build the trend.</p>
                    </div>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-stone-400">
                  <span>{revenueTrendOrders.length ? `${revenueTrendOrders.length} latest orders shown` : 'No order history'}</span>
                  <span>INR · recorded order totals</span>
                </div>
              </section>
              
              {/* Revenue by department */}
              <section className="admin-panel lg:col-span-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-base text-stone-900">Revenue by department</h3>
                    <p className="mt-1 text-xs text-stone-500">Based on recorded order line items</p>
                  </div>
                  <span className="rounded-lg bg-stone-100 px-2.5 py-1.5 text-xs font-semibold text-stone-600">{orders.length} orders</span>
                </div>
                {categoryRevenueTotal > 0 ? (
                  <div className="space-y-4">
                    {categoryPerformance.slice(0, 6).map((category, index) => {
                      const share = Math.round((category.revenue / categoryRevenueTotal) * 100);
                      const colors = ['bg-emerald-600', 'bg-blue-600', 'bg-amber-500', 'bg-violet-500', 'bg-cyan-600', 'bg-rose-500', 'bg-stone-500'];
                      return (
                        <div key={category.id} className="space-y-1.5">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="min-w-0 truncate font-medium text-stone-700">{category.name}</span>
                            <span className="shrink-0 font-semibold text-stone-900">₹{category.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} <span className="font-normal text-stone-500">{share}%</span></span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                            <div className={`${colors[index % colors.length]} h-full rounded-full transition-[width] duration-500`} style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-stone-700">No sales data yet</p>
                    <p className="mt-1 text-xs text-stone-500">Department performance will appear after orders are recorded.</p>
                  </div>
                )}
              </section>

              {/* Live Order Dispatch Queue */}
              <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-stone-900">
                    Live Dispatch Queue
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                  >
                    View all orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">No orders to dispatch yet.</div>
                  ) : orders.filter((ord) => !['delivered', 'cancelled'].includes(ord.status)).slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-stone-900">
                          #{ord.id} · {ord.customerName}
                        </div>
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          {ord.slot} · {ord.items.length} items
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={() => setTrackingOrder(ord)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-medium hover:bg-stone-100"
                        >
                          Inspect
                        </button>
                      </div>
                    </div>
                  ))}
                  {orders.length > 0 && orders.filter((ord) => !['delivered', 'cancelled'].includes(ord.status)).length === 0 && <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-6 text-center text-sm text-emerald-800">All orders are delivered. Your dispatch queue is clear.</div>}
                </div>
              </div>

              {/* Recent Audit & Team Activity */}
              <div className="lg:col-span-12 bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                      <History className="w-4 h-4" />
                    </span>
                    <h3 className="font-display font-bold text-base text-stone-900">
                      Recent activity
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('audit-log')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all {auditLogs.length} events →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {auditLogs.slice(0, 3).map((log) => {
                    const isRemoval = log.action === 'MANAGER_REMOVED' || log.action === 'STAFF_REMOVED';
                    const isAddition = log.action === 'MANAGER_ASSIGNED' || log.action === 'STAFF_ASSIGNED' || log.action === 'MEMBER_RESTORED';
                    
                    return (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/90 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isRemoval
                                ? 'bg-red-100 text-red-800'
                                : isAddition
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">{log.timestamp}</span>
                        </div>
                        <div className="font-bold text-stone-900">{log.title}</div>
                        <p className="text-[11px] text-stone-600 line-clamp-2">{log.details}</p>
                        <div className="text-[10px] text-stone-500 pt-1 border-t border-stone-200/60 flex items-center justify-between">
                          <span>By: {log.actor}</span>
                          {log.targetName && <span>{log.targetName}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: STORE MANAGERS (SUPER ADMIN MOHAMED UKKAS ONLY) */}
        {activeTab === 'managers' && isSuperAdmin && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-xl text-stone-900">
                    Store Managers Directory
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    Admin Gated
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                  Super Admin authority: Only <strong>Mohamed Ukkas</strong> (mohamedukkas.ai@gmail.com) can assign Store Managers or revoke manager access.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewMgrCustomId(getNextManagerId());
                  setShowAddManagerModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Store Manager by Email</span>
              </button>
            </div>

            {/* Manager Directory Informational Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                  <span className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                    Store Manager Accounts ({managers.length})
                  </span>
                </div>
                <span className="text-[11px] text-amber-900 font-medium">
                  📧 Added by email · Managers log in using their registered email or Google account.
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-stone-600">
                {managers.map((mgr) => (
                  <div 
                    key={mgr.id} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-amber-200 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center">
                      {mgr.firstName[0]}
                    </span>
                    <span className="text-stone-800 font-bold">{mgr.firstName} {mgr.lastName}</span>
                    <span className="text-emerald-900 font-mono text-[11px]">({mgr.email})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Managers Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managers.map((mgr) => (
                <div
                  key={mgr.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center">
                        {mgr.firstName[0]}{mgr.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-stone-900 text-sm">
                            {mgr.firstName} {mgr.lastName}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            Store Manager
                          </span>
                        </div>
                        <div className="text-xs font-mono font-medium text-emerald-800 mt-0.5">
                          {mgr.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setItemToDelete({
                              type: 'manager',
                              id: mgr.id,
                              name: `${mgr.firstName} ${mgr.lastName}`,
                              email: mgr.email
                            });
                          }}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer"
                          title="Remove Store Manager"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-200/80">
                    <div>
                      <span className="text-stone-400 block font-medium">Department</span>
                      <span className="font-semibold text-stone-700">{mgr.department}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Assigned By</span>
                      <span className="font-semibold text-emerald-800">{mgr.assignedByName}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Direct Phone</span>
                      <span className="font-semibold text-stone-700">{mgr.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Assigned Date</span>
                      <span className="font-semibold text-stone-700">{mgr.assignedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: FULFILLMENT STAFF TEAM */}
        {activeTab === 'staff-team' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-xl text-stone-900">
                    Fulfillment Staff Team
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                    Store Manager Managed
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                  Store Managers assign and manage store staff across <strong>Picker & Packer</strong>, <strong>Shelf Stocker</strong>, and <strong>Express Courier</strong> roles. Staff can only access their approved tasks.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewStaffCustomId(getNextStaffId());
                  setShowAddStaffModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Staff Member by Email</span>
              </button>
            </div>

            {/* Fulfillment Staff Informational Banner */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/90 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-800" />
                  <span className="font-bold text-xs text-blue-950 uppercase tracking-wider">
                    Fulfillment Staff Team ({staffMembers.length})
                  </span>
                </div>
                <span className="text-[11px] text-blue-900 font-medium">
                  📧 Added by email · Store Managers assign tasks directly to staff members.
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs text-stone-600">
                {staffMembers.map((staff) => (
                  <div 
                    key={staff.id} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-blue-200 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-800 text-white font-bold text-[10px] flex items-center justify-center">
                      {staff.firstName[0]}
                    </span>
                    <span className="text-stone-800 font-bold">{staff.firstName} {staff.lastName}</span>
                    <span className="text-blue-900 font-mono text-[11px]">({staff.email})</span>
                    <span className="text-[10px] text-stone-500 font-medium">· {staff.role.replace('STAFF_', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Staff Member</th>
                    <th className="py-3 px-3">Assigned Role</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Assigned By</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {staffMembers.map((staff) => {
                    const roleLabel = 
                      staff.role === 'STAFF_PACKER' ? 'Order Picker & Packer' :
                      staff.role === 'STAFF_STOCKER' ? 'Shelf & Stock Specialist' :
                      staff.role === 'STAFF_DISPATCH' ? 'Express Courier' : 'Staff Associate';

                    const roleBadgeColor =
                      staff.role === 'STAFF_PACKER' ? 'bg-emerald-100 text-emerald-900 border-emerald-200' :
                      staff.role === 'STAFF_STOCKER' ? 'bg-blue-100 text-blue-900 border-blue-200' :
                      'bg-amber-100 text-amber-900 border-amber-200';

                    return (
                      <tr key={staff.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center">
                              {staff.firstName[0]}{staff.lastName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900">{staff.firstName} {staff.lastName}</span>
                              </div>
                              <span className="text-[11px] text-blue-900 font-mono font-medium">{staff.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleBadgeColor}`}>
                            {roleLabel}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-medium text-stone-700">
                          {staff.department}
                        </td>

                        <td className="py-3.5 px-3 text-stone-600">
                          <span className="font-medium text-stone-800">{staff.assignedByName}</span>
                          <span className="text-[10px] text-stone-400 block">{staff.assignedAt}</span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setWorkStaffId(staff.id);
                                setShowAssignWorkModal(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                              title="Assign task to this staff member"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Assign Task</span>
                            </button>
                            {(isSuperAdmin || isStoreManager) && (
                              <button
                                type="button"
                                onClick={() => {
                                  setItemToDelete({
                                    type: 'staff',
                                    id: staff.id,
                                    name: `${staff.firstName} ${staff.lastName}`,
                                    email: staff.email
                                  });
                                }}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-stone-200 transition-colors cursor-pointer"
                                title="Remove Staff Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: STAFF WORKS & DISPATCH PIPELINE */}
        {activeTab === 'work-dispatch' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <h3 className="font-display font-extrabold text-xl text-stone-900">
                  Staff Task Dispatch & Works Oversight
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                  Store Managers assign tasks to specific staff members. Staff members log in to execute duties, and all completed works are recorded below.
                </p>
              </div>

              <button
                onClick={() => setShowAssignWorkModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Assign Task to Staff</span>
              </button>
            </div>

            {/* Work Items Table */}
            <div className="space-y-3">
              {staffWorks.map((work) => {
                const isDone = work.status === 'completed';
                const isInProgress = work.status === 'in_progress';

                return (
                  <div
                    key={work.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone 
                        ? 'border-stone-200 bg-stone-50/40' 
                        : isInProgress
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-emerald-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pb-2 border-b border-stone-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                            : isInProgress
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {work.status.replace('_', ' ')}
                        </span>

                        <span className="font-bold text-stone-900">
                          {work.title}
                        </span>

                        {work.orderId && (
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[11px]">
                            Order #{work.orderId}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                        <span>Assigned to: <strong className="text-stone-800">{work.staffName}</strong></span>
                        {work.completedAt && (
                          <span className="text-emerald-800 font-medium">Done: {work.completedAt}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mt-2">
                      {work.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 text-[11px] text-stone-500">
                      <div className="flex items-center gap-3">
                        <span>Assigned by Manager: <strong>{work.assignedByManagerName}</strong></span>
                        <span>Time: {work.assignedAt}</span>
                        {work.location && <span>Location: {work.location}</span>}
                      </div>

                      {work.notes && (
                        <div className="text-stone-700 font-medium">
                          Note: {work.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: AUDIT LOG & COMPLIANCE */}
        {activeTab === 'audit-log' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    <History className="w-5 h-5" />
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-stone-900">
                    Store Operations & Hierarchy Audit Log
                  </h3>
                </div>
                <p className="text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
                  Real-time tamper-evident event stream capturing manager appointments, member revocations, task dispatches, and access activity.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAuditSubTab('timeline')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      auditSubTab === 'timeline'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Activity Ledger ({filteredAuditLogs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditSubTab('archive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      auditSubTab === 'archive'
                        ? 'bg-white text-red-700 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Removed Members ({deletedMembers.length})</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `freshmart-audit-log-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    showToast('Audit log exported successfully.');
                  }}
                  className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export audit logs as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                {isSuperAdmin && auditLogs.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAuditLogs}
                    className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-red-50 hover:text-red-700 text-stone-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Clear audit log history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Total Events Logged
                </span>
                <span className="text-2xl font-display font-extrabold text-stone-900 mt-1 block">
                  {auditLogs.length}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">Permanent log entries</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Active Team
                </span>
                <span className="text-2xl font-display font-extrabold text-emerald-950 mt-1 block">
                  {managers.length + staffMembers.length}
                </span>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">
                  {managers.length} Managers · {staffMembers.length} Staff
                </span>
              </div>

              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/80">
                <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wider block">
                  Removed Personnel
                </span>
                <span className="text-2xl font-display font-extrabold text-red-950 mt-1 block">
                  {deletedMembers.length}
                </span>
                <span className="text-[10px] text-red-700 mt-0.5 block">Restorable via archive</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
                  Tasks Dispatched
                </span>
                <span className="text-2xl font-display font-extrabold text-blue-950 mt-1 block">
                  {staffWorks.length}
                </span>
                <span className="text-[10px] text-blue-700 mt-0.5 block">Fulfillment duties</span>
              </div>
            </div>

            {auditSubTab === 'timeline' ? (
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search audit trail by actor, target name, email, or keyword..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-emerald-700 text-stone-900"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Actions' },
                      { id: 'removals', label: 'Removals' },
                      { id: 'additions', label: 'Additions' },
                      { id: 'tasks', label: 'Tasks' },
                      { id: 'security', label: 'Security' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAuditFilter(f.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          auditFilter === f.id
                            ? 'bg-stone-900 text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audit Entries List */}
                {filteredAuditLogs.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                    <History className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-600">No matching audit logs found</p>
                    <p className="text-xs text-stone-400 mt-1">Try adjusting your search query or filter</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAuditLogs.map((log) => {
                      const isRemoval = log.action === 'MANAGER_REMOVED' || log.action === 'STAFF_REMOVED';
                      const isAddition = log.action === 'MANAGER_ASSIGNED' || log.action === 'STAFF_ASSIGNED' || log.action === 'MEMBER_RESTORED';
                      const isTask = log.action === 'TASK_ASSIGNED' || log.action === 'TASK_UPDATED';

                      const badgeStyle = isRemoval
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : isAddition
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : isTask
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-indigo-100 text-indigo-800 border-indigo-200';

                      const iconBg = isRemoval
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : isAddition
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isTask
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200';

                      const canRestore = isRemoval && log.targetId && deletedMembers.some(d => d.id === log.targetId || d.email.toLowerCase() === log.targetId?.toLowerCase());

                      return (
                        <div
                          key={log.id}
                          className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${iconBg}`}>
                              {isRemoval ? (
                                <UserX className="w-5 h-5" />
                              ) : isAddition ? (
                                <UserCheck className="w-5 h-5" />
                              ) : isTask ? (
                                <ClipboardList className="w-5 h-5" />
                              ) : (
                                <ShieldCheck className="w-5 h-5" />
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle}`}>
                                  {log.action.replace('_', ' ')}
                                </span>
                                <h4 className="font-display font-bold text-stone-900 text-sm">
                                  {log.title}
                                </h4>
                                <span className="text-stone-400 text-xs flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{log.timestamp}</span>
                                </span>
                              </div>

                              <p className="text-xs text-stone-600 leading-relaxed">
                                {log.details}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-stone-500">
                                <span>Actor: <strong className="text-stone-700">{log.actor}</strong></span>
                                {log.targetName && (
                                  <span>Target: <strong className="text-stone-700">{log.targetName}</strong></span>
                                )}
                                {log.targetRole && (
                                  <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                                    {log.targetRole}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {canRestore && log.targetId && (
                            <button
                              type="button"
                              onClick={() => restoreMember(log.targetId!)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors flex items-center gap-1 self-start sm:self-center shrink-0 cursor-pointer"
                              title="Restore member to active directory"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore Member</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Sub-tab 2: Removed Members Archive */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-base text-stone-900">
                      Removed Personnel Archive
                    </h4>
                    <p className="text-xs text-stone-500">
                      Store Managers and staff members that have been removed from active duty. You can restore any member with 1 click.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-800">
                    {deletedMembers.length} in Archive
                  </span>
                </div>

                {deletedMembers.length === 0 ? (
                  <div className="p-12 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
                    <UserCheck className="w-10 h-10 text-emerald-600/50 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-stone-800">No removed personnel</p>
                    <p className="text-xs text-stone-500 mt-1">
                      All appointed Store Managers and staff members are currently active and authorized.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deletedMembers.map((record) => (
                      <div
                        key={record.id}
                        className="p-5 rounded-2xl border border-red-200 bg-red-50/20 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-extrabold text-sm flex items-center justify-center">
                              {record.firstName[0]}{record.lastName[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-display font-bold text-stone-900 text-sm">
                                  {record.firstName} {record.lastName}
                                </h5>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                                  {record.type === 'manager' ? 'Store Manager' : 'Staff Member'}
                                </span>
                              </div>
                              <div className="text-xs font-mono text-stone-600 mt-0.5">
                                {record.email}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => restoreMember(record.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                            title="Restore member to active service"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-red-100">
                          <div>
                            <span className="text-stone-400 block font-medium">Department</span>
                            <span className="font-semibold text-stone-800">{record.department}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block font-medium">Removed Date</span>
                            <span className="font-semibold text-stone-800">{record.deletedAt}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-stone-400 block font-medium">Removed By</span>
                            <span className="font-semibold text-stone-800">{record.deletedBy}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Stock Level Monitor & Fast Restock
                </h3>
                <p className="text-xs text-stone-600">
                  Update inventory counts in real time. Items dropping below 5 trigger warehouse packing alerts.
                </p>
              </div>

              {/* Search SKUs */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter by SKU or item..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-3">Product & SKU</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price / MRP</th>
                    <th className="py-3 px-3">Units in Stock</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInventory.map((prod) => {
                    const st = getStockStatus(prod.stockCount);
                    const StatusIcon = st.icon;

                    return (
                      <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-9 h-9 rounded-lg object-cover bg-stone-100"
                            />
                            <div>
                              <div className="font-bold text-stone-900">{prod.name}</div>
                              <div className="text-[11px] text-stone-600 font-mono">
                                {prod.sku} · {prod.brand}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-stone-700 font-medium">
                          {prod.category}
                        </td>

                        <td className="py-3 px-3 font-semibold text-stone-900">
                          ₹{prod.price.toFixed(2)}
                          <span className="text-stone-600 line-through ml-1 text-[11px]">
                            ₹{prod.mrp.toFixed(2)}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-bold text-stone-900 text-sm">
                          {prod.stockCount}
                        </td>

                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1.5 font-medium text-xs text-stone-800">
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{st.label}</span>
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              inputMode="numeric"
                              aria-label={`Quantity to add for ${prod.name}`}
                              placeholder="Qty"
                              value={restockAmounts[prod.id] ?? ''}
                              onChange={(event) => setRestockAmounts((prev) => ({ ...prev, [prod.id]: event.target.value }))}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  const quantity = Number(restockAmounts[prod.id]);
                                  if (Number.isSafeInteger(quantity) && quantity > 0) {
                                    restockProduct(prod.id, quantity);
                                    setRestockAmounts((prev) => ({ ...prev, [prod.id]: '' }));
                                  }
                                }
                              }}
                              className="w-20 rounded-lg border border-stone-300 px-2 py-1.5 text-sm text-stone-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                            <button
                              onClick={() => {
                                const quantity = Number(restockAmounts[prod.id]);
                                if (Number.isSafeInteger(quantity) && quantity > 0) {
                                  restockProduct(prod.id, quantity);
                                  setRestockAmounts((prev) => ({ ...prev, [prod.id]: '' }));
                                }
                              }}
                              disabled={!Number.isSafeInteger(Number(restockAmounts[prod.id])) || Number(restockAmounts[prod.id]) <= 0}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS PIPELINE */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 grocery-card-shadow space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Supermarket Customer Orders Pipeline
                </h3>
                <p className="text-xs text-stone-600">
                  Advance order status as grocery packers pick items and delivery drivers dispatch.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                {(['all', 'placed', 'confirmed', 'packing', 'out_for_delivery', 'delivered'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedOrderFilter(s as any)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      selectedOrderFilter === s ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pb-3 border-b border-stone-200">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        #{ord.id}
                      </span>
                      <span className="text-stone-300 mx-2">·</span>
                      <span className="font-semibold text-stone-800">{ord.customerName}</span>
                      <span className="text-stone-300 mx-2">·</span>
                      <span className="text-stone-600">{ord.customerPhone}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-stone-950 text-sm">
                        ₹{ord.total.toFixed(2)}
                      </span>

                      {/* Status select dropdown for Admin */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-bold outline-none cursor-pointer focus:border-emerald-700"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packing">Being Packed</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Details & Items Preview */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-stone-200 text-xs shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="text-stone-800 font-medium truncate max-w-[120px]">
                            {item.name}
                          </span>
                          <span className="text-stone-600 font-bold">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-stone-600 shrink-0">
                      Slot: <strong>{ord.slot}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADD PRODUCT FORM */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 grocery-card-shadow max-w-3xl mx-auto space-y-6">
            <div>
              <h3 className="font-display font-extrabold text-xl text-stone-900">
                Add New Supermarket Item
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Enter grocery details, pricing, packaging size, and starting warehouse inventory units.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-stone-700">Product Name</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Organic Black Seedless Grapes"
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700">Brand / Farm Origin</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="e.g. Sun Valley Orchards"
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-700">Category</label>
                  <select
                    value={newProdCat}
                    onChange={(e) => setNewProdCat(e.target.value as any)}
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700">Unit / Net Weight</label>
                  <input
                    type="text"
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    placeholder="e.g. 500g punnet or 1L bottle"
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700">SKU Code</label>
                  <input
                    type="text"
                    value={newProdSku}
                    onChange={(e) => setNewProdSku(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 font-mono outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-stone-700">Selling Price (?)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700">Original MRP (?)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdMrp}
                    onChange={(e) => setNewProdMrp(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700">Starting Stock Units</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">Image URL</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">Description & Freshness Notes</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Describe harvest origin, taste profile, and culinary suggestions..."
                  className="w-full mt-1.5 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:border-emerald-700"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs"
                >
                  Save to Supermarket Catalog
                </button>
              </div>
            </form>
          </div>
        )}

        {/* UNIFIED MODAL: ASSIGN TEAM MEMBER BY EMAIL (SUPER ADMIN MOHAMED UKKAS) */}
        {showAssignMemberModal && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-4">
              <button
                onClick={() => setShowAssignMemberModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
                  👑' Super Admin Assignment Hub
                </span>
                <h3 className="font-display font-black text-xl text-stone-900">
                  Assign Team Member by Email
                </h3>
                <p className="text-xs text-stone-500">
                  Super Admin authority (Mohamed Ukkas): Assign Store Managers or Staff members by their email. They will automatically be authorized to sign in with their email.
                </p>
              </div>

              <form onSubmit={handleAssignMemberUnified} className="space-y-3.5 text-xs pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Select Member Role <span className="text-emerald-800 font-bold">*</span>
                  </label>
                  <select
                    value={assignRole}
                    onChange={(e) => {
                      const r = e.target.value as 'STORE_MANAGER' | StaffRole;
                      setAssignRole(r);
                      if (r === 'STORE_MANAGER') setAssignDept('Store Operations & Logistics');
                      else if (r === 'STAFF_PACKER') setAssignDept('Order Fulfillment & Packing');
                      else if (r === 'STAFF_STOCKER') setAssignDept('Shelf & Inventory Replenishment');
                      else if (r === 'STAFF_DISPATCH') setAssignDept('Fleet & Express Courier');
                    }}
                    className="w-full px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-semibold"
                  >
                    <option value="STORE_MANAGER">👑" Store Manager (Full Operations & Staff Oversight)</option>
                    <option value="STAFF_PACKER">📧 Order Picker & Packer (Packing Station & Bagging)</option>
                    <option value="STAFF_STOCKER">🏬 Shelf & Stock Specialist (Warehouse & Replenishment)</option>
                    <option value="STAFF_DISPATCH">🛒 Express Dispatch Courier (Doorstep Courier Delivery)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Email Address / Gmail <span className="text-emerald-800 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. colleague@example.com"
                    value={assignEmail}
                    onChange={(e) => setAssignEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    The member will use this email address to log in to FreshMart.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">First Name <span className="text-emerald-800 font-bold">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex"
                      value={assignFirstName}
                      onChange={(e) => setAssignFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rivera"
                      value={assignLastName}
                      onChange={(e) => setAssignLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={assignDept}
                      onChange={(e) => setAssignDept(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91 90000 00000"
                      value={assignPhone}
                      onChange={(e) => setAssignPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] space-y-1">
                  <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Instant Authorization</span>
                  </div>
                  <div className="text-stone-600 leading-relaxed">
                    Once submitted, <strong>{assignEmail || 'this email'}</strong> will immediately have access to FreshMart with the <strong>{assignRole === 'STORE_MANAGER' ? 'Store Manager' : 'Fulfillment Staff'}</strong> role.
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignMemberModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                  >
                    Assign Member by Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 1: ASSIGN STORE MANAGER (ADMIN ONLY) */}
        {showAddManagerModal && isSuperAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-4">
              <button
                onClick={() => setShowAddManagerModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase tracking-wider">
                  Super Admin Console (Mohamed Ukkas)
                </span>
                <h3 className="font-display font-black text-xl text-stone-900">
                  Add Store Manager by Email
                </h3>
                <p className="text-xs text-stone-500">
                  Only the Super Admin (Mohamed Ukkas) can assign Store Managers. The manager will log in with their email.
                </p>
              </div>

              <form onSubmit={handleAssignManager} className="space-y-3 text-xs pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Manager Email Address <span className="text-emerald-800 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. manager.rachel@gmail.com"
                    value={newMgrEmail}
                    onChange={(e) => setNewMgrEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Manager will log in using this email address (via Google OAuth or with email & password).
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rachel"
                      value={newMgrFirstName}
                      onChange={(e) => setNewMgrFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Green"
                      value={newMgrLastName}
                      onChange={(e) => setNewMgrLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Assigned Department</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Produce & Dairy Logistics"
                      value={newMgrDept}
                      onChange={(e) => setNewMgrDept(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Direct Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 90000 00000"
                      value={newMgrPhone}
                      onChange={(e) => setNewMgrPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                    <span>Manager Role Privileges</span>
                  </div>
                  <div className="text-stone-600 leading-relaxed">
                    Once added, this manager can log in with <strong>{newMgrEmail || 'their email'}</strong> to add fulfillment staff by email and assign tasks to staff.
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddManagerModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                  >
                    Add Store Manager
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ASSIGN STAFF MEMBER (STORE MANAGER) */}
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-4">
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wider">
                  Store Operations Team
                </span>
                <h3 className="font-display font-black text-xl text-stone-900">
                  Add Staff Member by Email
                </h3>
                <p className="text-xs text-stone-500">
                  Store Managers add staff by their email. Staff members log in with their email to view approved tasks in their dedicated workspace.
                </p>
              </div>

              <form onSubmit={handleAssignStaff} className="space-y-3 text-xs pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Staff Member Email Address <span className="text-blue-800 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. packer.leo@gmail.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-mono text-xs"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Staff member will log in using this email address.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Leo"
                      value={newStaffFirstName}
                      onChange={(e) => setNewStaffFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Martinez"
                      value={newStaffLastName}
                      onChange={(e) => setNewStaffLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Specialization Role</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => {
                        const r = e.target.value as StaffRole;
                        setNewStaffRole(r);
                        if (r === 'STAFF_PACKER') setNewStaffDept('Order Fulfillment & Packing');
                        else if (r === 'STAFF_STOCKER') setNewStaffDept('Shelf & Inventory Replenishment');
                        else if (r === 'STAFF_DISPATCH') setNewStaffDept('Fleet & Express Courier');
                      }}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-semibold"
                    >
                      <option value="STAFF_PACKER">Order Picker & Packer</option>
                      <option value="STAFF_STOCKER">Shelf & Inventory Stocker</option>
                      <option value="STAFF_DISPATCH">Express Dispatch Courier</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={newStaffDept}
                      onChange={(e) => setNewStaffDept(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Direct Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 90000 00000"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-[11px] space-y-1">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-800" />
                    <span>Staff Workspace Access</span>
                  </div>
                  <div className="text-stone-600 leading-relaxed">
                    Once added, this staff member can log in with <strong>{newStaffEmail || 'their email'}</strong>. The manager can assign duties, and the staff member can execute and mark tasks done.
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStaffModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
                  >
                    Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: ASSIGN TASK TO STAFF (STORE MANAGER) */}
        {showAssignWorkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-4">
              <button
                onClick={() => setShowAssignWorkModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase tracking-wider">
                  Manager Duty Assignment
                </span>
                <h3 className="font-display font-black text-xl text-stone-900">
                  Assign Approved Work Task
                </h3>
                <p className="text-xs text-stone-500">
                  This work item will be immediately approved and delivered to the selected staff member's active queue.
                </p>
              </div>

              <form onSubmit={handleCreateWork} className="space-y-3 text-xs pt-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Select Staff Member</label>
                  <select
                    value={workStaffId}
                    onChange={(e) => setWorkStaffId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-semibold"
                    required
                  >
                    {staffMembers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.role.replace('STAFF_', '')}) · {s.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pick & Pack Order #FM10294"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Category</label>
                    <select
                      value={workCategory}
                      onChange={(e) => setWorkCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                    >
                      <option value="packing">Packing</option>
                      <option value="stocking">Shelf Stocking</option>
                      <option value="delivery">Express Delivery</option>
                      <option value="inspection">Freshness Audit</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Order # (If applicable)</label>
                    <input
                      type="text"
                      placeholder="e.g. FM10291"
                      value={workOrderId}
                      onChange={(e) => setWorkOrderId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Location / Packing Station / Route</label>
                  <input
                    type="text"
                    placeholder="e.g. Packing Bench 3 or Aisle 2"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Task Instructions & Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe specific items, temperature liners, fragile handling, or customer notes..."
                    value={workDesc}
                    onChange={(e) => setWorkDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Manager Note / Priority</label>
                  <input
                    type="text"
                    placeholder="e.g. Rush dispatch before 11:30 AM"
                    value={workNotes}
                    onChange={(e) => setWorkNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-700 text-stone-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignWorkModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-xs"
                  >
                    Assign Task to Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* IN-APP MEMBER REMOVAL CONFIRMATION MODAL (Reliable in Iframe/Sandbox) */}
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-stone-900">
                    Confirm Member Removal
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Revoking permissions for {itemToDelete.type === 'manager' ? 'Store Manager' : 'Fulfillment Staff'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">Member Name:</span>
                  <span className="text-xs font-bold text-stone-900">{itemToDelete.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">Account / Gmail:</span>
                  <span className="text-xs font-mono font-semibold text-emerald-800">{itemToDelete.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 font-medium">System Role:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                    {itemToDelete.type === 'manager' ? 'Store Manager' : 'Fulfillment Staff'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/80 border border-amber-200 p-3 rounded-xl text-amber-900">
                ⚠️ <strong>Note:</strong> Removing this user will revoke their access immediately. A permanent audit entry will be recorded in the <strong>Audit Log</strong>, and this member can be restored at any time.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (itemToDelete.type === 'manager') {
                      deleteManager(itemToDelete.id);
                    } else {
                      deleteStaff(itemToDelete.id);
                    }
                    setItemToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Removal</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
