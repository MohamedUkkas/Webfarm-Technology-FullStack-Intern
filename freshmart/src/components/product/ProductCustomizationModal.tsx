import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Plus, 
  Minus, 
  Scissors, 
  Scale, 
  Sparkles, 
  Leaf, 
  Clock, 
  Zap, 
  ShieldCheck, 
  Radio, 
  Users 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, WeightVariant, CutOption } from '../../types';

interface ProductCustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const { addToCart, showToast, selectedDarkStore } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<WeightVariant | undefined>(undefined);
  const [selectedCut, setSelectedCut] = useState<CutOption | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Initialize or reset selections whenever product changes
  useEffect(() => {
    if (product) {
      if (product.weightVariants && product.weightVariants.length > 0) {
        // Prefer popular variant or first variant
        const popular = product.weightVariants.find((v) => v.isPopular);
        setSelectedVariant(popular || product.weightVariants[0]);
      } else {
        setSelectedVariant(undefined);
      }

      if (product.cutOptions && product.cutOptions.length > 0) {
        setSelectedCut(product.cutOptions[0]);
      } else {
        setSelectedCut(undefined);
      }

      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Calculate price dynamically
  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const cutExtra = selectedCut?.extraPrice ?? 0;
  const unitPrice = basePrice + cutExtra;
  const totalPrice = unitPrice * quantity;

  // MRP and savings calculation
  const mrpBase = selectedVariant ? selectedVariant.mrp : product.mrp;
  const totalMrp = (mrpBase + cutExtra) * quantity;
  const savings = totalMrp > totalPrice ? totalMrp - totalPrice : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedCut);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
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
          className="inline-block w-full max-w-xl text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 my-4"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
            <div className="flex items-center gap-3">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    Smart Customization
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{product.brand}</span>
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 leading-tight mt-0.5">
                  {product.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* KPN Fresh Real-Time Harvest & Freshness Scorecard */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/40 to-amber-50/40 border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{product.harvestTime || 'Harvested Today at 5:15 AM · Farm Direct'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-600">
                  <span className="font-semibold text-emerald-800">
                    Freshness Score: {product.freshnessScore || 98}% Hydro-Crisp
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-stone-700">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>In-Stock at {selectedDarkStore.name.slice(0, 22)}...</span>
                  </span>
                </div>
              </div>

              {product.recentOrdersCount && (
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-xl">
                  <Users className="w-3 h-3 text-amber-700" />
                  <span>{product.recentOrdersCount} ordered today</span>
                </div>
              )}
            </div>

            {/* Step 1: Weight / Pack Size Variants */}
            {product.weightVariants && product.weightVariants.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-800" />
                    <span>1. Select Weight / Pack Size</span>
                  </label>
                  <span className="text-[11px] text-stone-500">Pick preferred quantity</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.weightVariants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const discount = variant.mrp > variant.price 
                      ? Math.round(((variant.mrp - variant.price) / variant.mrp) * 100) 
                      : 0;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-700 ring-2 ring-emerald-700/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {variant.isPopular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-md bg-amber-500 text-stone-950 font-bold text-[9px] uppercase tracking-wider shadow-2xs">
                            Popular
                          </span>
                        )}
                        <div className="text-xs font-bold text-stone-900 line-clamp-1">
                          {variant.label}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="font-display font-extrabold text-sm text-stone-950">
                            ₹{variant.price.toFixed(2)}
                          </span>
                          {variant.mrp > variant.price && (
                            <span className="text-[11px] text-stone-400 line-through">
                              ₹{variant.mrp.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {discount > 0 && (
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            Save {discount}%
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Smart Kitchen Cuts & Preparation (Zepto Signature) */}
            {product.cutOptions && product.cutOptions.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-emerald-800" />
                    <span>2. Select Kitchen Cut & Customization</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Prepped Fresh in Dark Store
                  </span>
                </div>

                <div className="space-y-2">
                  {product.cutOptions.map((cut) => {
                    const isSelected = selectedCut?.type === cut.type && selectedCut?.label === cut.label;
                    return (
                      <button
                        key={`${cut.type}-${cut.label}`}
                        type="button"
                        onClick={() => setSelectedCut(cut)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-700 ring-2 ring-emerald-700/20 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {cut.type === 'whole' ? '🏬' : cut.type === 'diced' ? '📧' : cut.type === 'sliced' ? 'Y×' : '✨'}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-stone-900">
                              {cut.label}
                            </div>
                            {cut.description && (
                              <div className="text-[11px] text-stone-500 mt-0.5">
                                {cut.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {cut.extraPrice && cut.extraPrice > 0 ? (
                            <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded-lg">
                              +₹{cut.extraPrice.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                              Free Prep
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Selection Summary */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/60 p-3.5 rounded-2xl">
              <div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Quantity
                </div>
                <div className="text-xs font-bold text-stone-900 mt-0.5">
                  {selectedVariant ? selectedVariant.label : product.unit}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="min-w-6 text-center font-extrabold text-sm text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Footer Total & Add to Basket CTA */}
          <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/90 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-stone-500 font-medium">Total:</span>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-stone-950">
                  ₹{totalPrice.toFixed(2)}
                </span>
                {savings > 0 && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    Save ₹{savings.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-stone-500 truncate max-w-[200px] sm:max-w-none">
                {[selectedVariant?.label, selectedCut?.label].filter(Boolean).join(' · ')}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-800 hover:bg-emerald-900 text-white hover:shadow-lg'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Basket</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Basket · ₹{totalPrice.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
