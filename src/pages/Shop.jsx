import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Furniture', 'Accessories'];
const SORT_OPTIONS = [
  { label: 'Relevance', value: 'created_at-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating-desc' },
  { label: 'Most Reviewed', value: 'review_count-desc' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('created_at-desc');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    document.title = activeCategory === 'All' 
      ? "Shop Catalog | VikaStore" 
      : `${activeCategory} Collection | VikaStore`;
    fetchProducts();
  }, [activeCategory, sort, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [field, order] = sort.split('-');
      let query = supabase.from('products').select('*')
        .gte('price', priceRange[0])
        .lte('price', priceRange[1])
        .order(field, { ascending: order === 'asc' });

      if (activeCategory !== 'All') query = query.eq('category', activeCategory);

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {activeCategory === 'All' ? 'All Products' : activeCategory}
              </h1>
              <p className="text-gray-500 text-sm">{filtered.length} products found</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white"
                />
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-gray-400" /></button>}
              </div>
              {/* Sort */}
              <div className="relative">
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {/* Filter Toggle */}
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0 space-y-6`}>
            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-black text-gray-900 mb-4">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${activeCategory === cat ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-black text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-3">
                <input type="range" min={0} max={100000} step={500}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-emerald-600" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹0</span>
                  <span className="font-bold text-emerald-600">up to ₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {[10000, 25000, 50000, 100000].map(p => (
                  <button key={p} onClick={() => setPriceRange([0, p])}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${priceRange[1] === p ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    ₹{p >= 1000 ? `${p/1000}k` : p}
                  </button>
                ))}
              </div>
            </div>

            {/* On Sale */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-black text-gray-900 mb-4">Offers</h3>
              <Link to="/shop?sale=true" className="w-full flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                <span className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0"></span>
                Show Only Sale Items ⚡
              </Link>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-4 space-y-3"><div className="h-3 bg-gray-200 rounded w-1/3"></div><div className="h-4 bg-gray-200 rounded"></div><div className="h-6 bg-gray-200 rounded w-1/2"></div></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-2">Try changing your filters.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All'); setPriceRange([0, 100000]); }}
                  className="mt-6 text-emerald-600 font-medium hover:text-emerald-700">Clear all filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
