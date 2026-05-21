import { ShoppingCart, Search, User, Menu, LogOut, Package, Heart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { cart, openCart } = useCartStore();
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.email?.includes('admin');

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    setSearch(query);
    if (query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const { data } = await supabase.from('products').select('id, name, price, category, image')
      .ilike('name', `%${query}%`).limit(5);
    setSuggestions(data || []);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (id) => {
    setSearch(''); setSuggestions([]); setShowSuggestions(false);
    navigate(`/product/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/shop?q=${search}`); setShowSuggestions(false); }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">VikaStore</span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden sm:flex flex-1 max-w-xl mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-full bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                placeholder="Search products, brands..."
                type="search"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setSuggestions([]); }} className="absolute inset-y-0 right-3 flex items-center">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {suggestions.map(item => (
                  <button key={item.id} onClick={() => handleSuggestionClick(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category} • ₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1">
            {isAdmin && (
              <Link to="/admin" className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2 text-sm font-bold rounded-xl hover:bg-emerald-50">
                Admin
              </Link>
            )}

            {user && (
              <>
                <Link to="/wishlist" className="relative text-gray-500 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50" title="Wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link to="/orders" className="relative text-gray-500 hover:text-emerald-600 transition-colors p-2 rounded-xl hover:bg-emerald-50" title="Orders">
                  <Package className="h-5 w-5" />
                </Link>
                <Link to="/profile" className="relative text-gray-500 hover:text-emerald-600 transition-colors p-2 rounded-xl hover:bg-emerald-50" title="Profile">
                  <User className="h-5 w-5" />
                </Link>
              </>
            )}

            {!user && (
              <Link to="/auth" className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}

            <button onClick={openCart} className="relative text-gray-500 hover:text-emerald-600 transition-colors p-2 rounded-xl hover:bg-emerald-50" title="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-black text-white bg-orange-500 rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {user && (
              <button onClick={signOut} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50" title="Sign Out">
                <LogOut className="h-5 w-5" />
              </button>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden text-gray-500 p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-4 space-y-2">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="search" value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </form>
            {[{ to: '/', label: 'Home' }, { to: '/shop', label: 'Shop' }, { to: '/wishlist', label: 'Wishlist' }, { to: '/orders', label: 'Orders' }, { to: '/profile', label: 'Profile' }].map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl">{l.label}</Link>
            ))}
            {!user && <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-center">Sign In</Link>}
            {user && <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-xl">Sign Out</button>}
          </div>
        )}
      </div>
    </nav>
  );
}
