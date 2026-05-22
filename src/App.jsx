import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';
import { useCartStore } from './store/cartStore';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';

// Extra Content Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import UpdatePassword from './pages/UpdatePassword';

// ProtectedRoute component
const ProtectedRoute = ({ children, requireAdmin = false, requireSeller = false }) => {
  const { user, loading } = useAuthStore();
  const [profileRole, setProfileRole] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
        .then(({ data }) => {
          setProfileRole(data?.role || 'customer');
          setProfileLoading(false);
        });
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  if (loading || profileLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;

  const isAdmin = profileRole === 'admin' || user?.user_metadata?.role === 'admin' || user?.email?.includes('admin');
  const isSeller = profileRole === 'seller' || isAdmin;

  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireSeller && !isSeller) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const { isCartOpen, closeCart } = useCartStore();

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Public Content & Legal Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Protected Routes */}
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

            {/* Seller & Admin Routes */}
            <Route path="/seller" element={<ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        <Toaster position="bottom-right" toastOptions={{ style: { borderRadius: '12px', fontWeight: '500' } }} />
      </div>
    </Router>
  );
}

export default App;
