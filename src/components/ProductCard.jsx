import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCartStore();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { user } = useAuthStore();

  const wishlisted = isWishlisted(product.id);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    if (wishlisted) {
      await removeFromWishlist(product.id, user.id);
      toast.success('Removed from wishlist');
    } else {
      await addToWishlist(product, user.id);
      toast.success('Added to wishlist!');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name.split(' ').slice(0,2).join(' ')} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              )}
              {product.is_featured && !discount && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-1">{product.category} • {product.brand}</p>
            <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">{product.name}</h3>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex items-center">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-3 w-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.review_count})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-extrabold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
                {product.original_price && (
                  <p className="text-xs text-gray-400 line-through">₹{product.original_price.toLocaleString('en-IN')}</p>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
