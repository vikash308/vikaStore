import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToCart } = useCartStore();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [userRating, setUserRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const wishlisted = isWishlisted(Number(id));
  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  useEffect(() => { fetchProductData(); }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const [{ data: prod }, { data: revs }] = await Promise.all([
        supabase.from('products').select('*, profiles(*)').eq('id', id).single(),
        supabase.from('reviews').select('*, profiles(full_name)').eq('product_id', id).order('created_at', { ascending: false }),
      ]);
      setProduct(prod);
      if (prod) document.title = `${prod.name} | VikaStore`;
      setReviews(revs || []);
      if (prod?.category) {
        const { data: rel } = await supabase.from('products').select('*').eq('category', prod.category).neq('id', id).limit(4);
        setRelated(rel || []);
      }
    } catch (e) {
      toast.error('Product not found'); navigate('/shop');
    } finally { setLoading(false); }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    toast.success(`${quantity}x added to cart!`);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    if (wishlisted) { await removeFromWishlist(product.id, user.id); toast('Removed from wishlist'); }
    else { await addToWishlist(product, user.id); toast.success('Added to wishlist!'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').upsert({
        product_id: product.id, user_id: user.id, rating: userRating, title: reviewTitle, body: reviewBody,
      });
      if (error) throw error;
      toast.success('Review submitted!');
      setReviewTitle(''); setReviewBody('');
      fetchProductData();
    } catch (e) { toast.error('Could not submit. You may have already reviewed this product.'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;
  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-emerald-600">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-emerald-600">Shop</Link><span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-emerald-600">{product.category}</Link><span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{product.category} • {product.brand}</span>
              <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mt-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{product.rating?.toFixed(1) || '0.0'}</span>
                </div>
                <span className="text-gray-500 text-sm">{product.review_count} reviews</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `✓ In Stock` : '✗ Out of Stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.original_price && <>
                  <span className="text-gray-400 line-through text-xl">₹{product.original_price.toLocaleString('en-IN')}</span>
                  <span className="bg-red-100 text-red-600 font-black text-sm px-2 py-1 rounded-lg">{discount}% OFF</span>
                </>}
              </div>
              {product.original_price && <p className="text-emerald-600 font-semibold text-sm mt-1">You save ₹{(product.original_price - product.price).toLocaleString('en-IN')}!</p>}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 hover:bg-gray-50"><Minus className="h-4 w-4" /></button>
                <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-2 hover:bg-gray-50"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition-all text-lg shadow-lg shadow-emerald-200">
                <ShoppingCart className="h-5 w-5" /> Add to Cart
              </button>
              <button onClick={handleWishlist}
                className={`p-4 rounded-2xl border-2 transition-all ${wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 bg-white text-gray-400 hover:border-red-300'}`}>
                <Heart className={`h-6 w-6 ${wishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[{ icon: Truck, label: 'Free Delivery', sub: 'Above ₹499' }, { icon: Shield, label: 'Secure Payment', sub: '100% Safe' }, { icon: RotateCcw, label: 'Easy Return', sub: '10-day policy' }].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 bg-white rounded-xl border border-gray-100">
                  <Icon className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 mb-8 gap-6">
            {['description', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setSelectedTab(tab)}
                className={`pb-3 font-bold capitalize text-lg transition-colors ${selectedTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}>
                {tab} {tab === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          {selectedTab === 'description' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[{ label: 'Brand', value: product.brand }, { label: 'Category', value: product.category }, { label: 'Stock', value: `${product.stock} units` }, { label: 'SKU', value: `VST-${product.id}` }].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="font-bold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Seller Info */}
              {product.profiles && (
                <div className="bg-white rounded-3xl border border-gray-100 p-8 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-2xl shrink-0">
                    {product.profiles.full_name ? product.profiles.full_name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Sold By</h3>
                    <p className="text-xl font-black text-gray-900">{product.profiles.full_name || 'Verified Seller'}</p>
                    <p className="text-gray-500 text-sm mt-0.5">Member since {new Date(product.profiles.created_at).getFullYear()}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">{review.profiles?.full_name || 'Anonymous User'}</p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {review.title && <p className="font-semibold text-gray-900 mb-1">{review.title}</p>}
                  <p className="text-gray-600">{review.body}</p>
                </div>
              ))}

              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h3 className="text-xl font-black text-gray-900 mb-6">Write a Review</h3>
                {!user ? (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl">
                    <p className="text-gray-600 mb-4">Please login to leave a review.</p>
                    <Link to="/auth" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium">Login to Review</Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                      <StarRating rating={userRating} size="lg" interactive onChange={setUserRating} />
                    </div>
                    <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} placeholder="Review title..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    <textarea value={reviewBody} onChange={e => setReviewBody(e.target.value)} rows={4} placeholder="Tell others what you think..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
                    <button type="submit" disabled={submittingReview} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
