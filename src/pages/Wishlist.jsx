import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { user } = useAuthStore();
  const { items, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => { if (user) fetchWishlist(user.id); }, [user]);

  const handleMoveToCart = (product) => {
    addToCart(product);
    toast.success('Moved to cart!');
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId, user.id);
    toast('Removed from wishlist');
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl"><Heart className="h-8 w-8 fill-red-500" /></div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
            <p className="text-gray-500">{items.length} saved items</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2 mb-6">Save products you love and come back to them later.</p>
            <Link to="/shop" className="bg-emerald-600 text-white font-medium py-3 px-8 rounded-xl hover:bg-emerald-700 transition-colors">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <Link to={`/product/${product.id}`}>
                  <div className="h-52 overflow-hidden bg-gray-50">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="p-5">
                  <p className="text-xs text-orange-500 font-bold uppercase mb-1">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-black text-gray-900">₹{product.price?.toLocaleString('en-IN')}</p>
                      {product.original_price && (
                        <p className="text-xs text-gray-400 line-through">₹{product.original_price?.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleMoveToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </button>
                    <button onClick={() => handleRemove(product.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 border border-gray-200 rounded-xl transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
