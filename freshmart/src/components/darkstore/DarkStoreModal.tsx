import React from 'react';
import { 
  X, 
  Zap, 
  MapPin, 
  Thermometer, 
  Bike, 
  PackageCheck, 
  Clock, 
  ShieldCheck, 
  Radio, 
  Check, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DarkStoreInfo } from '../../types';

interface DarkStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DarkStoreModal: React.FC<DarkStoreModalProps> = ({ isOpen, onClose }) => {
  const { darkStores, selectedDarkStore, setSelectedDarkStore, showToast } = useStore();

  if (!isOpen) return null;

  const handleSelectStore = (store: DarkStoreInfo) => {
    setSelectedDarkStore(store);
    showToast(`Switched fulfillment to ${store.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="inline-block w-full max-w-3xl text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 my-4"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-stone-950 shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                  <span>ZEPTO SIGNATURE HYPERLOCAL ENGINE</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-200">
                  Sub-10 Min Dispatch
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl mt-1 tracking-tight text-white">
                Dark Store & Micro-Fulfillment Network
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Real-time inventory, cold-chain temperature telemetry, and hyperlocal dispatch radius
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Active Selected Dark Store Telemetry Card */}
            <div className="bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-white border-2 border-emerald-600/30 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-700 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Currently Servicing Your Address
                    </span>
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-1">
                    {selectedDarkStore.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    <span>{selectedDarkStore.address}, {selectedDarkStore.city}</span>
                    <span className="text-stone-300">·</span>
                    <span className="font-bold text-stone-900">{selectedDarkStore.distanceKm} km away</span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-white/90 p-3 sm:p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Live Dispatch ETA
                  </div>
                  <div className="font-display font-black text-2xl text-emerald-950 mt-0.5 flex items-center sm:justify-end gap-1">
                    <Zap className="w-5 h-5 fill-amber-400 text-amber-500" />
                    <span>{selectedDarkStore.etaMinutes} MINS</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    Status: <strong className="text-emerald-800">{selectedDarkStore.status}</strong>
                  </div>
                </div>
              </div>

              {/* IoT Live Sensor Telemetry Strip */}
              <div className="mt-5 pt-4 border-t border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100/80">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Cold-Chain Temp</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm mt-1 flex items-baseline gap-1">
                    <span className="text-base text-cyan-700">{selectedDarkStore.temperatureCelsius}°C</span>
                    <span className="text-[10px] text-emerald-700 font-sans font-semibold">Chilled Safe</span>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100/80">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
                    <Bike className="w-3.5 h-3.5 text-amber-600" />
                    <span>Active Couriers</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm mt-1 flex items-baseline gap-1">
                    <span className="text-base text-stone-900">{selectedDarkStore.activeRidersCount}</span>
                    <span className="text-[10px] text-stone-500 font-sans">on road</span>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100/80">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Packing Queue</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm mt-1 flex items-baseline gap-1">
                    <span className="text-base text-stone-900">{selectedDarkStore.packingQueueCount}</span>
                    <span className="text-[10px] text-stone-500 font-sans">avg 1.8 mins</span>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100/80">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Inventory Fill</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm mt-1 flex items-baseline gap-1">
                    <span className="text-base text-emerald-800">98.6%</span>
                    <span className="text-[10px] text-stone-500 font-sans">in-stock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Store Network Switcher */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Nearby Micro-Fulfillment Hubs ({darkStores.length})
                </h4>
                <span className="text-[11px] text-stone-500">
                  Auto-routed to the closest dispatch pod
                </span>
              </div>

              <div className="space-y-3">
                {darkStores.map((store) => {
                  const isSelected = store.id === selectedDarkStore.id;
                  return (
                    <div
                      key={store.id}
                      onClick={() => handleSelectStore(store)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/60 border-emerald-600 ring-2 ring-emerald-600/20 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-100 text-stone-700'
                        }`}>
                          <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">{store.name}</span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-white">
                                Active Hub
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            {store.address} · <span className="font-semibold text-stone-800">{store.distanceKm} km away</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1 font-mono">
                            <span>❄️ {store.temperatureCelsius}°C</span>
                            <span>🛒 {store.activeRidersCount} Couriers</span>
                            <span>📧 {store.packingQueueCount} Queued</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-900">
                            ~{store.etaMinutes} mins
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {store.status}
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'bg-emerald-800 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Switch'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How Zepto & KPN Fresh Micro-Fulfillment Works (Educational Timeline) */}
            <div className="bg-stone-50 rounded-3xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  How Zepto Hyperlocal 10-Min Dispatch Operates
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-1">
                  <div className="text-emerald-800 font-black text-sm">01 · Instant Routing</div>
                  <div className="font-bold text-stone-900 text-xs">Aisle & Bin Picking (45s)</div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Orders trigger handheld barcode scanners. Staff pick from designated temperature-zoned aisles in under 45 seconds.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-1">
                  <div className="text-emerald-800 font-black text-sm">02 · Smart Prep & Cuts</div>
                  <div className="font-bold text-stone-900 text-xs">Custom Veggie & Meat Prep (90s)</div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Custom cut requests (diced, sliced, peeled) are prepped at the on-site sterile prep counter and vacuum-sealed immediately.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-1">
                  <div className="text-emerald-800 font-black text-sm">03 · E-Bike Sprint</div>
                  <div className="font-bold text-stone-900 text-xs">Cold-Tote Transit (7→"8m)</div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Riders bag into sub-4°C insulated totes and navigate hyper-local routes within a 2.5 km radius directly to your doorstep.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
            <div className="text-xs text-stone-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping inline-block" />
              <span>Real-time GPS routing active for <strong>{selectedDarkStore.city}</strong></span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
