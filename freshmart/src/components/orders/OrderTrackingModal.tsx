import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Star, 
  ShieldCheck, 
  Navigation, 
  Radio, 
  Store, 
  Home,
  Check
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';

export const OrderTrackingModal: React.FC = () => {
  const { trackingOrder, setTrackingOrder, orders } = useStore();

  // Keep trackingOrder strictly synchronized with the latest order state in the orders array
  const activeOrder = orders.find((o) => o.id === trackingOrder?.id) || trackingOrder;

  // Real-time ticking timer for live delivery seconds and heartbeat
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered' || activeOrder.status === 'cancelled') {
      return;
    }
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeOrder?.status]);

  if (!activeOrder) return null;

  const steps: { status: OrderStatus; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { 
      status: 'placed', 
      label: 'Order Placed', 
      desc: 'Received at FreshMart Regional Dispatch Hub',
      icon: Store 
    },
    { 
      status: 'confirmed', 
      label: 'Confirmed & Aisle Routing', 
      desc: 'Digital picking ticket generated & allocated to staff',
      icon: CheckCircle2 
    },
    { 
      status: 'packing', 
      label: 'Being Packed & Chilled', 
      desc: 'Fresh produce inspected; dairy placed in insulated cold-chain totes',
      icon: Package 
    },
    { 
      status: 'out_for_delivery', 
      label: 'Out for Delivery', 
      desc: 'Courier actively en route with temperature-controlled delivery',
      icon: Truck 
    },
    { 
      status: 'delivered', 
      label: 'Delivered to Doorstep', 
      desc: 'Handed over safely with digital confirmation',
      icon: Home 
    },
  ];

  const statusOrder: OrderStatus[] = ['placed', 'confirmed', 'packing', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(activeOrder.status);

  // Dynamic progress percentage for real-time progress bar
  const progressPercent = 
    activeOrder.status === 'placed' ? 20 :
    activeOrder.status === 'confirmed' ? 40 :
    activeOrder.status === 'packing' ? 65 :
    activeOrder.status === 'out_for_delivery' ? 88 :
    activeOrder.status === 'delivered' ? 100 : 0;

  const getStageHeader = () => {
    switch (activeOrder.status) {
      case 'placed':
        return {
          title: 'Order Placed & Queued',
          subtitle: 'Digital ticket sent to the fulfillment team.',
          badge: 'Processing at Hub'
        };
      case 'confirmed':
        return {
          title: 'Confirmed & Verified',
          subtitle: 'Items routed to designated aisle pickers.',
          badge: 'Aisle Assigned'
        };
      case 'packing':
        return {
          title: 'Being Packed in Insulated Totes',
          subtitle: 'Produce inspected for ripeness; chilled items bagged.',
          badge: 'Packing Station 3'
        };
      case 'out_for_delivery':
        return {
          title: 'Out for Delivery',
          subtitle: `${activeOrder.deliveryAgent?.name || 'Courier'} is en route to your doorstep.`,
          badge: 'Live GPS Active'
        };
      case 'delivered':
        return {
          title: 'Delivered to Your Doorstep',
          subtitle: 'Package handed over with digital confirmation.',
          badge: 'Delivered'
        };
      case 'cancelled':
        return {
          title: 'Order Cancelled',
          subtitle: activeOrder.cancellationReason || 'Order was cancelled.',
          badge: 'Cancelled'
        };
      default:
        return {
          title: 'Live Delivery Status',
          subtitle: 'Tracking your grocery journey in real-time.',
          badge: 'Live'
        };
    }
  };

  const stageInfo = getStageHeader();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setTrackingOrder(null)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="inline-block w-full max-w-2xl text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 my-4"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
                  <span>DEMO ORDER STATUS</span>
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  Status entered by the store
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 mt-1">
                Order #{activeOrder.id}
              </h2>
            </div>

            <button
              onClick={() => setTrackingOrder(null)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Live Real-time Status Card */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-white border border-emerald-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      {stageInfo.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-xl text-stone-900 mt-1">
                    {stageInfo.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {stageInfo.subtitle}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-white/80 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-emerald-100 sm:border-none">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Estimated Arrival
                  </div>
                  <div className="font-display font-extrabold text-lg text-emerald-900 mt-0.5">
                    {activeOrder.status === 'delivered' ? 'Delivered' : activeOrder.estimatedDeliveryTime || '20→"30 mins'}
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                    Slot: {activeOrder.slot}
                  </div>
                </div>
              </div>

              {/* Real-time Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                  <span>Hub Dispatch</span>
                  <span>{progressPercent}% Completed</span>
                  <span>Your Doorstep</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-700 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Drop-off Address Bar */}
              <div className="text-xs text-stone-600 flex items-center gap-2 pt-1 border-t border-emerald-100/70">
                <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="truncate">
                  Destination: <strong>{activeOrder.address.street}, {activeOrder.address.city} ({activeOrder.address.title})</strong>
                </span>
              </div>
            </div>

            {/* Live GPS Route Tracker Graphic */}
            <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <Navigation className="w-4 h-4 text-emerald-800" />
                  <span>Delivery route preview</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {activeOrder.deliveryAgent?.currentLocation || 'Market Dispatch Hub'}
                </span>
              </div>

              {/* Graphic Route Map Representation */}
              <div className="relative py-4 px-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between overflow-hidden">
                {/* Connecting road */}
                <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Hub Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shadow-sm">
                    <Store className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 mt-1">FreshMart Hub</span>
                </div>

                {/* Courier Moving Node */}
                <div 
                  className="relative z-10 flex flex-col items-center transition-all duration-1000"
                  style={{
                    transform: `translateX(${(progressPercent - 50) * 0.8}px)`
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs shadow-md ring-4 ring-amber-100">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 mt-1">
                    {activeOrder.status === 'out_for_delivery' ? 'On Route' : 'Fulfillment'}
                  </span>
                </div>

                {/* Destination Point */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-sm ${
                    activeOrder.status === 'delivered' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-700'
                  }`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-700 mt-1">Doorstep</span>
                </div>
              </div>
            </div>

            {/* Visual Timeline (Vertical Steps) */}
            <div className="space-y-5 pl-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Fulfillment Timeline
              </div>

              {steps.map((st, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isFuture = idx > currentIndex;
                const IconComponent = st.icon;

                return (
                  <div key={st.status} className="relative flex items-start gap-4">
                    {/* Connecting Line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-5 transition-colors duration-500 ${
                          idx < currentIndex ? 'bg-emerald-700' : 'bg-stone-200'
                        }`}
                      />
                    )}

                    {/* Step Icon Node */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isPassed
                          ? 'bg-emerald-800 text-white'
                          : isCurrent
                          ? 'bg-emerald-800 text-white ring-4 ring-emerald-100 animate-pulse'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Step Description */}
                    <div className="pt-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-sm font-bold flex items-center gap-2 ${
                            isCurrent
                              ? 'text-emerald-950 font-extrabold'
                              : isPassed
                              ? 'text-stone-900 font-semibold'
                              : 'text-stone-500'
                          }`}
                        >
                          <span>{st.label}</span>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                              <span>Live Now</span>
                            </span>
                          )}
                        </div>

                        {isPassed && (
                          <span className="text-[11px] text-emerald-800 font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5">{st.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Items in Order */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                Basket Items ({activeOrder.items.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-9 h-9 object-cover rounded-lg bg-stone-100"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-600">{item.unit} · Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-stone-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Total */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs text-stone-600">
              <div>
                <span>Paid via {activeOrder.paymentMethod}</span>
              </div>
              <div className="text-sm font-extrabold text-stone-900">
                Total: ₹{activeOrder.total.toFixed(2)}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
