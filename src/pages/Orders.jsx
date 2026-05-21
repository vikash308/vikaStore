import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Printer, X, Mail, ExternalLink, ChevronRight, Truck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

/* ── Status config ── */
const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700',  icon: '🕐' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700',    icon: '✅' },
  shipped:   { label: 'Shipped',   color: 'bg-purple-100 text-purple-700', icon: '🚚' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: '📦' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', icon: '✓' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-600',       icon: '✗' },
};

/* ── Inline Invoice Modal ── */
function InvoiceModal({ order, user, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Invoice #${order.id.slice(0, 8)}</title>
      <style>body{font-family:sans-serif;padding:32px;color:#111}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #eee}th{background:#f9f9f9;font-weight:600}</style>
    </head><body>`);
    win.document.write(printRef.current.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  const subtotal = order.order_items.reduce((s, i) => s + i.price_at_time * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + tax;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-600" />
            <h3 className="font-black text-gray-900">Order Invoice</h3>
            <span className="text-xs text-gray-400 font-mono">#{order.id.slice(0, 8)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
              <Printer className="h-4 w-4" /> Print
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice body */}
        <div className="overflow-y-auto flex-1 p-6">
          <div ref={printRef}>
            {/* Top */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-2xl font-black text-emerald-600">VikaStore</p>
                <p className="text-xs text-gray-400 mt-1">vikastore.in · support@vikastore.in · +91 98765 43210</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Tax Invoice</p>
                <p className="font-mono font-black text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Customer</p>
                <p className="font-bold text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-400 mt-1">Customer ID: {user?.id?.slice(0, 8)}</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Payment</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Gateway</span><span className="font-bold">Dodo Payments</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-bold capitalize">{order.payment_method || 'card'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-emerald-600 font-bold">✓ Paid</span></div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-700">Product</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-700">Qty</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-700">Unit Price</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.order_items?.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1">{item.products?.name || 'Product'}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{Number(item.price_at_time).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">₹{(item.price_at_time * item.quantity).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span className="text-emerald-600 font-medium">FREE</span></div>
                <div className="flex justify-between text-gray-600"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-black text-gray-900 text-base pt-2 border-t border-gray-200">
                  <span>Grand Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 text-center">
              <p className="text-sm font-medium text-emerald-800">Thank you for shopping with VikaStore! 🎉</p>
              <p className="text-xs text-emerald-600 mt-1">Reach us at support@vikastore.in for any queries.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Orders page ── */
export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    document.title = 'My Orders | VikaStore';
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(quantity, price_at_time, products(name, image, brand))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Status timeline steps */
  const TIMELINE = ['confirmed', 'shipped', 'delivered'];

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
    </div>
  );

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
              <p className="text-gray-500 text-sm">Track and manage your purchases</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
              <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h2 className="text-xl font-black text-gray-900">No orders yet</h2>
              <p className="text-gray-500 mt-2 mb-6 text-sm">You haven't placed any orders yet.</p>
              <Link to="/shop" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order, idx) => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
                const timelineIdx = TIMELINE.indexOf(order.status);

                return (
                  <motion.div key={order.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-5 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold">Order ID</p>
                          <p className="font-mono font-bold text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold">Placed</p>
                          <p className="font-medium text-gray-900">
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase font-bold">Total</p>
                          <p className="font-black text-emerald-600">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                        <button
                          onClick={() => setInvoiceOrder(order)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 hover:border-emerald-300 hover:text-emerald-700 transition-all"
                        >
                          <Printer className="h-3.5 w-3.5" /> Invoice
                        </button>
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    {timelineIdx >= 0 && (
                      <div className="px-6 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-0">
                          {TIMELINE.map((step, i) => {
                            const done = i <= timelineIdx;
                            const icons = [CheckCircle2, Truck, Package];
                            const Icon = icons[i];
                            return (
                              <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className={`flex flex-col items-center gap-1 flex-shrink-0`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-emerald-600' : 'bg-gray-200'}`}>
                                    <Icon className={`h-4 w-4 ${done ? 'text-white' : 'text-gray-400'}`} />
                                  </div>
                                  <span className={`text-xs font-medium capitalize ${done ? 'text-emerald-600' : 'text-gray-400'}`}>{step}</span>
                                </div>
                                {i < TIMELINE.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < timelineIdx ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="p-6 divide-y divide-gray-50">
                      {order.order_items?.map((item, i) => (
                        <div key={i} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <img
                            src={item.products?.image || 'https://placehold.co/80x80'}
                            alt={item.products?.name}
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 line-clamp-1">{item.products?.name}</p>
                            <p className="text-xs text-gray-400">{item.products?.brand}</p>
                            <p className="text-sm text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-black text-emerald-600 flex-shrink-0">
                            ₹{(item.price_at_time * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoiceOrder && (
          <InvoiceModal order={invoiceOrder} user={user} onClose={() => setInvoiceOrder(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
