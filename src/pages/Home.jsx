import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, RotateCcw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics', icon: '🔌', color: 'bg-blue-50 text-blue-700', href: '/shop?category=Electronics' },
  { name: 'Fashion', icon: '👗', color: 'bg-pink-50 text-pink-700', href: '/shop?category=Fashion' },
  { name: 'Furniture', icon: '🪑', color: 'bg-amber-50 text-amber-700', href: '/shop?category=Furniture' },
  { name: 'Accessories', icon: '⌚', color: 'bg-purple-50 text-purple-700', href: '/shop?category=Accessories' },
];

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹499' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected payments' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '10-day return policy' },
  { icon: Zap, title: 'Express Delivery', desc: 'Same day in select cities' },
];

// Countdown timer hook
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;
      setTimeLeft({
        hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
        minutes: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
        seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
}

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set deal end time to end of today
  const dealEnd = new Date();
  dealEnd.setHours(23, 59, 59, 0);
  const { hours, minutes, seconds } = useCountdown(dealEnd);

  useEffect(() => {
    document.title = "VikaStore - Premium E-Commerce Store";
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [{ data: feat }, { data: sale }] = await Promise.all([
        supabase.from('products').select('*').eq('is_featured', true).limit(8),
        supabase.from('products').select('*').eq('is_on_sale', true).limit(4),
      ]);
      setFeatured(feat || []);
      setOnSale(sale || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/20 rounded-full translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center bg-orange-500/20 text-orange-300 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-orange-500/30">
                🔥 Up to 30% Off on Electronics
              </span>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                Discover Premium
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  Products.
                </span>
              </h1>
              <p className="text-emerald-200 text-lg mb-8 max-w-lg">
                Shop from 20+ top brands. Free delivery, easy returns, and secure payment on every order.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-lg"
                >
                  Shop Now <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/shop?category=Electronics"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-8 rounded-2xl transition-all border border-white/20 text-lg"
                >
                  Explore Deals
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-5xl mb-2">🎧</p>
                  <p className="font-bold text-lg">Sony WH-1000XM5</p>
                  <p className="text-emerald-300 text-sm">Noise Cancellation</p>
                  <p className="text-2xl font-black mt-2 text-orange-300">₹24,999</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-5xl mb-2">⌚</p>
                  <p className="font-bold text-lg">Apple Watch S9</p>
                  <p className="text-emerald-300 text-sm">Advanced Health</p>
                  <p className="text-2xl font-black mt-2 text-orange-300">₹41,900</p>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-5xl mb-2">💻</p>
                  <p className="font-bold text-lg">4K Monitor</p>
                  <p className="text-emerald-300 text-sm">LG 27UK850</p>
                  <p className="text-2xl font-black mt-2 text-orange-300">₹34,999</p>
                </div>
                <div className="bg-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
                  <p className="text-orange-300 font-bold text-sm mb-1">🔥 Today's Best Deal</p>
                  <p className="font-bold text-lg">Xiaomi Band 8</p>
                  <p className="text-emerald-300 text-sm">Fitness Tracker</p>
                  <p className="text-2xl font-black mt-2 text-orange-300">₹2,999</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl ${cat.color} hover:shadow-md transition-all border border-transparent hover:border-current/20 font-semibold`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      {onSale.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-orange-500 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-white flex items-center gap-2">⚡ Flash Deals</h2>
                <p className="text-red-100 mt-1">Limited time offers — grab before they expire!</p>
              </div>
              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
                <p className="text-white text-sm font-medium mr-2">Ends in:</p>
                {[hours, minutes, seconds].map((val, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="bg-white text-red-600 font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg">{val || '00'}</span>
                    {i < 2 && <span className="text-white font-black text-xl">:</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {onSale.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Trending This Week</h2>
            <p className="text-gray-500 mt-1">Our most popular picks handpicked for you.</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-800 rounded-3xl p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">New User? Get ₹500 Off!</h2>
            <p className="text-emerald-200 mb-6">Use code <span className="font-black text-orange-400">WELCOME500</span> on your first order above ₹999.</p>
            <Link to="/auth" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg">
              Claim Offer <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
