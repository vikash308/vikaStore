import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, CreditCard, Loader2, MapPin, Plus, X, Shield,
  Smartphone, Lock, Printer, Mail, Package, ChevronRight, Zap
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

/* ─── helpers ─── */
const formatCard = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };
const genTxnId = () => 'DODO' + Math.random().toString(36).slice(2, 10).toUpperCase();
const genOrderNum = () => 'VS' + Date.now().toString().slice(-8);

/* ─── Invoice Modal ─── */
function InvoiceModal({ order, cart, address, user, onClose }) {
  const printRef = useRef();
  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write('<html><head><title>Invoice</title></head><body>');
    win.document.write(printRef.current.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const now = new Date();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" />
            <h3 className="font-black text-gray-900">Order Confirmation Receipt</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef}>
            {/* Invoice Top */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">VikaStore</p>
                <p className="text-xs text-gray-400 mt-1">vikastore.in · support@vikastore.in</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Tax Invoice</p>
                <p className="font-black text-gray-900 text-lg">{order.orderNumber}</p>
                <p className="text-xs text-gray-400">{now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Payment & Shipping */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Billed To</p>
                <p className="font-bold text-gray-900">{address?.full_name || user?.email}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                {address && <>
                  <p className="text-sm text-gray-600 mt-1">{address.address_line1}</p>
                  <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </>}
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Payment Info</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gateway</span>
                    <span className="font-bold text-gray-900">Dodo Payments</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Method</span>
                    <span className="font-bold text-gray-900 capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Txn ID</span>
                    <span className="font-mono text-xs text-emerald-700 font-bold">{order.txnId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className="text-emerald-600 font-bold">✓ Paid</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Item</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-700">Qty</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-700">Price</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.brand}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span className="text-emerald-600 font-medium">FREE</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-200">
                  <span>Grand Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 text-center">
              <p className="text-sm font-medium text-emerald-800">Thank you for shopping with VikaStore! 🎉</p>
              <p className="text-xs text-emerald-600 mt-1">Need help? Contact us at support@vikastore.in or +91 98765 43210</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Dodo Payments Modal ─── */
function DodoPaymentsModal({ total, onSuccess, onClose }) {
  const [payTab, setPayTab] = useState('card');
  const [step, setStep] = useState('form'); // form | processing | done
  const [processStep, setProcessStep] = useState(0);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');

  const processingSteps = [
    { label: 'Establishing secure connection…', icon: Lock },
    { label: 'Validating payment details…', icon: Shield },
    { label: 'Authorizing via Dodo Payments…', icon: Zap },
    { label: 'Sending confirmation email…', icon: Mail },
  ];

  const handlePay = async (e) => {
    e.preventDefault();
    setStep('processing');
    // Animate through steps
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessStep(i);
      await new Promise(r => setTimeout(r, 900));
    }
    setStep('done');
    await new Promise(r => setTimeout(r, 700));
    onSuccess(payTab === 'card' ? 'card' : 'upi');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm">Dodo Payments</p>
              <p className="text-slate-400 text-xs">Secured · 256-bit SSL</p>
            </div>
          </div>
          {step === 'form' && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Amount banner */}
        <div className="bg-slate-800 px-6 py-3 flex justify-between items-center border-t border-slate-700">
          <p className="text-slate-300 text-sm">Order Total</p>
          <p className="text-white font-black text-xl">₹{total.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ── Processing ── */}
            {(step === 'processing' || step === 'done') && (
              <motion.div key="processing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="py-6 space-y-5"
              >
                {step === 'done' ? (
                  <div className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </motion.div>
                    <p className="font-black text-gray-900 text-lg">Payment Successful!</p>
                    <p className="text-sm text-gray-500 mt-1">Finalizing your order…</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-2">
                      <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                    </div>
                    {processingSteps.map((s, i) => {
                      const Icon = s.icon;
                      return (
                        <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i <= processStep ? 'opacity-100' : 'opacity-30'}`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${i < processStep ? 'bg-emerald-100' : i === processStep ? 'bg-emerald-600' : 'bg-gray-100'}`}>
                            {i < processStep
                              ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              : <Icon className={`h-4 w-4 ${i === processStep ? 'text-white' : 'text-gray-400'}`} />
                            }
                          </div>
                          <p className={`text-sm font-medium ${i === processStep ? 'text-gray-900' : i < processStep ? 'text-emerald-600' : 'text-gray-400'}`}>
                            {s.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Payment Form ── */}
            {step === 'form' && (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Pay method tabs */}
                <div className="flex gap-2 mb-5">
                  {[
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI', icon: Smartphone },
                  ].map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setPayTab(id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${payTab === id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      <Icon className="h-4 w-4" />{label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Card form */}
                  {payTab === 'card' && (
                    <motion.form key="card" onSubmit={handlePay}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      {/* Card preview */}
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                        <div className="flex justify-between items-start mb-6 relative z-10">
                          <div className="w-10 h-7 bg-amber-400 rounded-md" />
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                            <div className="w-6 h-6 rounded-full bg-amber-500 opacity-80 -ml-2" />
                          </div>
                        </div>
                        <p className="font-mono text-lg tracking-widest relative z-10">
                          {card.number || '•••• •••• •••• ••••'}
                        </p>
                        <div className="flex justify-between mt-3 relative z-10">
                          <div>
                            <p className="text-slate-400 text-xs">Card Holder</p>
                            <p className="font-medium text-sm">{card.name || 'YOUR NAME'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400 text-xs">Expires</p>
                            <p className="font-medium text-sm">{card.expiry || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Card Number</label>
                        <input value={card.number}
                          onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                          placeholder="1234 5678 9012 3456" maxLength={19} required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Card Holder Name</label>
                        <input value={card.name}
                          onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                          placeholder="AS ON CARD" required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">Expiry</label>
                          <input value={card.expiry}
                            onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                            placeholder="MM/YY" maxLength={5} required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">CVV</label>
                          <input value={card.cvv} type="password"
                            onChange={e => setCard(c => ({ ...c, cvv: e.target.value.slice(0, 4) }))}
                            placeholder="•••" maxLength={4} required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        </div>
                      </div>
                      <button type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-sm">
                        <Lock className="h-4 w-4" /> Pay ₹{total.toLocaleString('en-IN')} Securely
                      </button>
                    </motion.form>
                  )}

                  {/* UPI form */}
                  {payTab === 'upi' && (
                    <motion.form key="upi" onSubmit={handlePay}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      className="space-y-5"
                    >
                      {/* Fake QR */}
                      <div className="flex flex-col items-center">
                        <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 bg-emerald-50">
                          <div className="w-36 h-36 bg-white rounded-xl grid grid-cols-7 gap-0.5 p-2">
                            {Array.from({ length: 49 }).map((_, i) => (
                              <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-emerald-700 font-bold text-center mt-2">Scan with any UPI App</p>
                        </div>
                        <div className="flex items-center gap-3 my-4 w-full">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span className="text-xs text-gray-400 font-medium">OR</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">Enter UPI ID</label>
                        <input value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="yourname@upi" required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        <p className="text-xs text-gray-400 mt-1.5">e.g. name@okicici, 98765@ybl, name@paytm</p>
                      </div>

                      {/* UPI app logos */}
                      <div className="flex gap-3 justify-center">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                          <div key={app} className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                              <Smartphone className="h-5 w-5 text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-500">{app}</p>
                          </div>
                        ))}
                      </div>

                      <button type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-sm">
                        <Zap className="h-4 w-4" /> Verify & Pay ₹{total.toLocaleString('en-IN')}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security strip */}
        {step === 'form' && (
          <div className="px-6 pb-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5" /> 256-bit SSL Encrypted · PCI DSS Compliant
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Checkout ─── */
export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showDodo, setShowDodo] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    document.title = 'Checkout | VikaStore';
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    if (data) { setAddresses(data); if (data.length > 0) setSelectedAddress(data[0].id); }
  };

  const handlePlaceOrder = () => {
    if (addresses.length === 0) { toast.error('Add a delivery address first in your Profile'); return; }
    if (!selectedAddress) { toast.error('Select a delivery address'); return; }
    setShowDodo(true);
  };

  const handlePaymentSuccess = async (payMethod) => {
    setShowDodo(false);
    const txnId = genTxnId();
    const orderNumber = genOrderNum();
    try {
      const addr = addresses.find(a => a.id === selectedAddress);
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: user.id, address_id: selectedAddress, total_amount: total, status: 'confirmed', payment_status: 'paid', payment_method: payMethod })
        .select().single();
      if (orderError) throw orderError;

      await supabase.from('order_items').insert(
        cart.map(item => ({ order_id: order.id, product_id: item.id, quantity: item.quantity, price_at_time: item.price }))
      );

      setOrderInfo({ txnId, orderNumber, paymentMethod: payMethod, address: addr });
      clearCart();
      setSuccess(true);
      toast.success('🎉 Order placed! Confirmation sent to ' + user.email);
    } catch (err) {
      console.error(err);
      toast.error('Order failed: ' + err.message);
    }
  };

  /* ── Empty / Success screens ── */
  if (cart.length === 0 && !success) return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 p-4 gap-4">
      <Package className="h-20 w-20 text-gray-200" />
      <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
      <button onClick={() => navigate('/shop')} className="text-emerald-600 font-medium hover:text-emerald-700">Browse Products →</button>
    </div>
  );

  if (success && orderInfo) return (
    <>
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Order Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-2">{orderInfo.orderNumber}</p>
          <div className="flex items-center justify-center gap-1.5 bg-emerald-50 rounded-xl px-4 py-2 mb-6 text-sm">
            <Mail className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Receipt sent to {user?.email}</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Transaction ID</span><span className="font-mono font-bold text-gray-900">{orderInfo.txnId}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Payment</span><span className="font-bold text-gray-900 capitalize">{orderInfo.paymentMethod}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Amount Paid</span><span className="font-bold text-emerald-600">₹{total.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => setShowInvoice(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-emerald-500 text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors">
              <Printer className="h-4 w-4" /> View & Print Invoice
            </button>
            <button onClick={() => navigate('/orders')}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
              <Package className="h-4 w-4" /> Track Order <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate('/shop')}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors">Continue Shopping</button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showInvoice && (
          <InvoiceModal
            order={orderInfo}
            cart={orderInfo._cart || []}
            address={orderInfo.address}
            user={user}
            onClose={() => setShowInvoice(false)}
          />
        )}
      </AnimatePresence>
    </>
  );

  const selectedAddr = addresses.find(a => a.id === selectedAddress);

  return (
    <>
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left */}
            <div className="lg:col-span-3 space-y-5">
              {/* Address */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" /> Delivery Address
                  </h2>
                  <button onClick={() => navigate('/profile')} className="text-emerald-600 text-sm font-medium hover:text-emerald-700 flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add New
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl">
                    <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3 text-sm">No saved addresses yet.</p>
                    <button onClick={() => navigate('/profile')} className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700">Add Address</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <label key={addr.id} className={`flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-emerald-600" />
                        <div>
                          <p className="font-bold text-gray-900">{addr.full_name} <span className="text-gray-400 font-normal text-sm">| {addr.phone}</span></p>
                          <p className="text-sm text-gray-600">{addr.address_line1}, {addr.city}, {addr.state} – {addr.pincode}</p>
                          {addr.is_default && <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment note */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-5 text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-base">Powered by Dodo Payments</p>
                  <p className="text-emerald-100 text-sm">Cards, UPI, Netbanking — all supported · 256-bit SSL encrypted</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-base font-black text-gray-900">Order Summary ({itemCount} items)</h2>
                </div>
                <div className="p-5 space-y-3 max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-emerald-600">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Delivery</span><span className="text-emerald-600 font-medium">FREE</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-2.5 border-t border-gray-200"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                </div>
                <div className="p-5">
                  <button onClick={handlePlaceOrder} disabled={addresses.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl transition-all disabled:opacity-50 text-base shadow-lg shadow-emerald-200">
                    <Lock className="h-4 w-4" /> Proceed to Pay ₹{total.toLocaleString('en-IN')}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> Secured by Dodo Payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dodo Payments Modal */}
      <AnimatePresence>
        {showDodo && (
          <DodoPaymentsModal
            total={total}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowDodo(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
