import React, { useEffect, useState } from 'react';
import { 
  X, 
  Check, 
  MapPin, 
  Clock, 
  CreditCard, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Banknote,
  Building
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DeliveryAddress, Order } from '../../types';
import { QrCode } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    couponDiscount,
    cartTotal,
    addresses,
    addAddress,
    placeOrder,
    setTrackingOrder,
    currentUser,
    isAuthenticated,
    openAuthModal
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || ''
  );
  const [checkoutError, setCheckoutError] = useState('');
  useEffect(() => {
    if (!addresses.some((address) => address.id === selectedAddressId)) setSelectedAddressId(addresses[0]?.id || '');
  }, [addresses, selectedAddressId]);
  const [selectedSlot, setSelectedSlot] = useState<string>('Today, 2:00 PM →" 4:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');

  // New Address form
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newTitle, setNewTitle] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newName, setNewName] = useState(
    currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Mohamed Ukkas'
  );
  const [newPhone, setNewPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [newStreet, setNewStreet] = useState('');
  const [newApartment, setNewApartment] = useState('');
  const [newCity, setNewCity] = useState('Chennai, Tamil Nadu');
  const [newPincode, setNewPincode] = useState('600017');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          onClick={() => setIsCheckoutOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />
        <div className="min-h-screen px-4 text-center flex items-center justify-center py-6">
          <div
            onClick={(e) => e.stopPropagation()}
            className="inline-block w-full max-w-md text-center bg-white rounded-3xl shadow-2xl border border-stone-200 p-8 relative z-10"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-2xl mb-4 font-bold">
              🛒'
            </div>
            <h3 className="font-display font-extrabold text-xl text-stone-900">
              Sign In to Complete Checkout
            </h3>
            <p className="text-xs text-stone-600 mt-2 mb-6">
              Please sign in so we can assign your delivery slot, save your receipt, and dispatch our local couriers.
            </p>
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                openAuthModal('checkout');
              }}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sign In / Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    addAddress({
      title: newTitle,
      recipientName: newName,
      phone: newPhone,
      street: newStreet,
      apartment: newApartment,
      city: newCity,
      pincode: newPincode,
      isDefault: false
    });
    setShowNewAddressForm(false);
    setNewStreet('');
    setNewApartment('');
  };

  const handleFinalizeOrder = () => {
    const chosenAddress = addresses.find(a => a.id === selectedAddressId);
    if (!chosenAddress) {
      setCheckoutError('Add and select a delivery address before placing the order.');
      setStep(1);
      return;
    }
    try {
      const order = placeOrder({ address: chosenAddress, slot: selectedSlot, paymentMethod });
      setCheckoutError('');
      setCompletedOrder(order);
      setStep(4);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Could not place your order.');
    }
  };

  const deliverySlots = [
    { day: 'Today', time: '2:00 PM →" 4:00 PM', fast: true },
    { day: 'Today', time: '4:00 PM →" 6:00 PM', fast: false },
    { day: 'Today', time: '6:00 PM →" 8:00 PM', fast: false },
    { day: 'Tomorrow', time: '7:00 AM →" 9:00 AM (Early Bird)', fast: false },
    { day: 'Tomorrow', time: '10:00 AM →" 12:00 PM', fast: false },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (step !== 4) setIsCheckoutOpen(false);
        }}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-6 sm:py-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="inline-block w-full max-w-2xl text-left bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all relative z-10 my-4"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                FreshMart Safe Checkout
              </div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 mt-0.5">
                {step === 4 ? 'Order Placed!' : 'Fast & Secure Checkout'}
              </h2>
            </div>

            {step !== 4 && (
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Progress Indicator */}
          {step !== 4 && (
            <div className="px-6 py-3 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-xs">
              {[
                { num: 1, label: '01 Address' },
                { num: 2, label: '02 Delivery Slot' },
                { num: 3, label: '03 Payment' },
              ].map((s) => (
                <button
                  key={s.num}
                  onClick={() => s.num < step && setStep(s.num as any)}
                  className={`flex items-center gap-1.5 font-semibold transition-colors ${
                    step === s.num
                      ? 'text-emerald-800'
                      : step > s.num
                      ? 'text-stone-900'
                      : 'text-stone-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step === s.num
                        ? 'bg-emerald-800 text-white'
                        : step > s.num
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step Contents */}
          <div className="p-6 sm:p-8">
            
            {/* STEP 1: Address Selection */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-stone-900">
                    Select Delivery Destination
                  </h3>
                  <button
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showNewAddressForm ? 'Cancel' : 'Add new address'}</span>
                  </button>
                </div>

                {/* New Address Form */}
                {showNewAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600">Label</label>
                        <select
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value as any)}
                          className="w-full mt-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600">Contact Name</label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600">Street Address</label>
                      <input
                        type="text"
                        placeholder="e.g. 100 Market Street"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600">Apt/Suite</label>
                        <input
                          type="text"
                          value={newApartment}
                          onChange={(e) => setNewApartment(e.target.value)}
                          placeholder="Apt 4B"
                          className="w-full mt-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600">City</label>
                        <input
                          type="text"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-stone-600">Zip Code</label>
                        <input
                          type="text"
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition-colors"
                    >
                      Save Address
                    </button>
                  </form>
                ) : (
                  /* Saved Address Cards */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-50/70 border-emerald-700 shadow-sm'
                              : 'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                              {addr.title}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-stone-800">{addr.recipientName}</div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            {addr.street} {addr.apartment && `, ${addr.apartment}`}
                          </div>
                          <div className="text-xs text-stone-600">
                            {addr.city} {addr.pincode}
                          </div>
                          <div className="text-[11px] text-stone-700 mt-1 font-mono">{addr.phone}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => selectedAddressId && addresses.some((address) => address.id === selectedAddressId) ? setStep(2) : setCheckoutError('Add and select a delivery address before continuing.')}
                    disabled={!selectedAddressId || !addresses.some((address) => address.id === selectedAddressId)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-900 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Continue to Delivery Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Slot Selection */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-stone-900">
                      Choose Your Preferred Delivery Slot
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Temperature-controlled vans ensure dairy and produce remain at peak freshness.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {deliverySlots.map((slot) => {
                    const slotText = `${slot.day}, ${slot.time}`;
                    const isSelected = selectedSlot === slotText;

                    return (
                      <div
                        key={slotText}
                        onClick={() => setSelectedSlot(slotText)}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-700 shadow-sm'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700'}`}>
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-stone-900">
                              {slot.time}
                            </div>
                            <div className="text-xs text-stone-600">
                              {slot.day} Dispatch
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {slot.fast && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              Fastest
                            </span>
                          )}
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-300'}`}>
                            {isSelected && <span className="text-xs">✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-white font-semibold text-xs sm:text-sm hover:bg-emerald-900 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-display font-bold text-base text-stone-900">
                    Select Payment Method
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Demo checkout only. Payments are not processed by this preview.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Card', label: 'Credit / Debit', icon: CreditCard },
                    { id: 'Net Banking', label: 'Net Banking', icon: Building },
                    { id: 'Cash on Delivery', label: 'Cash / Card on Drop', icon: Banknote },
                  ].map((m) => {
                    const isSelected = paymentMethod === m.id;
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-700 text-emerald-900 font-bold shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-emerald-800" />
                        <span className="text-xs leading-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {paymentMethod !== 'Cash on Delivery' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    Online payment is unavailable in this demo. No card or payment details will be collected.
                  </div>
                )}
                {checkoutError && <div role="alert" className="p-3 rounded-xl bg-red-50 text-red-700 text-xs">{checkoutError}</div>}
                {/* Order Summary Box */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Groceries Total ({cart.length} items)</span>
                    <span className="font-medium text-stone-900">₹{cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charges</span>
                    <span className="font-medium text-stone-900">{deliveryFee === 0 ? 'FREE' : `?${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Coupon Savings</span>
                      <span>−₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-extrabold text-stone-950">
                    <span>Grand Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalizeOrder}
                    className="px-8 py-3.5 rounded-xl bg-emerald-800 text-white font-bold text-xs sm:text-sm hover:bg-emerald-900 shadow-sm transition-all cursor-pointer"
                  >
                    Place Order · ₹{cartTotal.toFixed(2)}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Order Confirmation Satisfying Screen */}
            {step === 4 && completedOrder && (
              <div className="text-center py-4 space-y-6">
                
                {/* Big Green Success Checkmark */}
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    ORDER CONFIRMED
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-950 mt-1">
                    #{completedOrder.id}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2">
                    Your fresh groceries are confirmed and sent to our station for picking and temperature-controlled bagging.
                  </p>
                </div>

                {/* Delivery Snapshot */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Expected Delivery:</span>
                    <span className="font-bold text-stone-900">{completedOrder.slot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Destination:</span>
                    <span className="font-semibold text-stone-900">{completedOrder.address.street}, {completedOrder.address.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Payment:</span>
                    <span className="font-semibold text-stone-900">{completedOrder.paymentMethod} · ₹{completedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setTrackingOrder(completedOrder);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Track order live
                  </button>
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-200 text-stone-800 hover:bg-stone-100 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Continue shopping
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
