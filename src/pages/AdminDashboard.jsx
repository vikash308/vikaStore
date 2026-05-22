import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PackagePlus, LayoutDashboard, Settings, LogOut, 
  DollarSign, Users, ShoppingBag, Plus, Trash2, Edit3, X, Check, Eye
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dashboard Stats
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Products Management
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image: '',
    category: 'Electronics',
    brand: 'VikaStore',
    stock: 100,
    is_featured: false,
    is_on_sale: false
  });

  // Orders Management
  const [allOrders, setAllOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Users Management
  const [allUsers, setAllUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchProducts();
    fetchAllOrders();
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const uniqueCustomers = new Set(orders.map(o => o.user_id)).size;

      setStats({
        revenue: totalRevenue,
        orders: orders.length,
        customers: uniqueCustomers
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          addresses(full_name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAllOrders(data || []);
    } catch (error) {
      console.error('Error fetching all orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Product Actions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        stock: Number(formData.stock),
        seller_id: user.id
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select();

      if (error) throw error;

      toast.success('Product added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to add product');
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price || '',
      image: product.image,
      category: product.category,
      brand: product.brand || 'VikaStore',
      stock: product.stock || 100,
      is_featured: product.is_featured || false,
      is_on_sale: product.is_on_sale || false
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        stock: Number(formData.stock)
      };

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success('Product updated successfully!');
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Product deleted successfully');
      fetchProducts();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      fetchAllOrders();
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleUserRoleUpdate = async (userId, newRole) => {
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      if (error) throw error;
      toast.success(`User role updated to ${newRole}`);
      fetchAllUsers();
    } catch (error) {
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setFormData({ ...formData, image: data.publicUrl });
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      image: '',
      category: 'Electronics',
      brand: 'VikaStore',
      stock: 100,
      is_featured: false,
      is_on_sale: false
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shrink-0">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500 truncate w-36">{user?.email || 'admin@store.com'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PackagePlus className="h-5 w-5" />
            <span>Manage Products</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="h-5 w-5" />
            <span>Manage Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Orders</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-64px)]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-2xl font-black text-gray-900">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Total Revenue</h3>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="h-5 w-5" /></div>
                </div>
                <p className="text-3xl font-black text-gray-900">₹{stats.revenue.toLocaleString('en-IN')}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Total Orders</h3>
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><ShoppingBag className="h-5 w-5" /></div>
                </div>
                <p className="text-3xl font-black text-gray-900">{stats.orders}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Customers</h3>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="h-5 w-5" /></div>
                </div>
                <p className="text-3xl font-black text-gray-900">{stats.customers}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-400"></div>
              </div>
            </div>

            {/* Custom SVG Sales Chart */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 mb-6">Sales Performance (Weekly)</h3>
              <div className="h-48 w-full flex items-end justify-between px-4 pt-4 border-b border-l border-gray-100 relative">
                {/* Simulated Chart Bars */}
                {[
                  { day: 'Mon', sales: 12000, height: '30%' },
                  { day: 'Tue', sales: 24000, height: '55%' },
                  { day: 'Wed', sales: 18000, height: '42%' },
                  { day: 'Thu', sales: 35000, height: '80%' },
                  { day: 'Fri', sales: 29000, height: '68%' },
                  { day: 'Sat', sales: 42000, height: '95%' },
                  { day: 'Sun', sales: 15000, height: '35%' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 group relative">
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                      ₹{item.sales.toLocaleString('en-IN')}
                    </span>
                    <div 
                      style={{ height: item.height }} 
                      className="w-8 sm:w-12 bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all duration-500 cursor-pointer shadow-md shadow-emerald-500/10"
                    ></div>
                    <span className="text-xs text-gray-500 mt-2 font-medium">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-black text-gray-900 mb-6">Recent Orders</h3>
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-medium">
                  No orders found. Once users checkout, orders will appear here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3 text-right">Amount</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="text-sm">
                          <td className="py-4 font-mono font-bold text-gray-700">#{order.id.split('-')[0]}</td>
                          <td className="py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="py-4 text-right font-bold text-emerald-600">₹{order.total_amount.toLocaleString('en-IN')}</td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 2: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Manage Products</h1>
                <p className="text-gray-500 text-sm">{products.length} products available</p>
              </div>
              <button 
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer"
              >
                <Plus className="h-5 w-5" /> Add New Product
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md bg-white rounded-xl border border-gray-200">
              <input 
                type="text" 
                placeholder="Search products by name, brand, category..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Products Table */}
            {productsLoading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-500 mt-4 font-medium">Loading catalog...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-bold text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try matching another query or add new products.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <th className="p-4">Product Info</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-center">Stock</th>
                        <th className="p-4 text-center">Features</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50" />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-gray-900 truncate">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.brand || 'VikaStore'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">{p.category}</span>
                          </td>
                          <td className="p-4 text-right">
                            <p className="font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</p>
                            {p.original_price && <p className="text-xs text-gray-400 line-through">₹{p.original_price.toLocaleString('en-IN')}</p>}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`font-bold text-sm ${p.stock <= 10 ? 'text-red-600' : 'text-gray-700'}`}>{p.stock}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-1.5">
                              {p.is_featured && <span className="bg-purple-100 text-purple-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">Featured</span>}
                              {p.is_on_sale && <span className="bg-red-100 text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded">Sale</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleEditProductClick(p)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Orders Management</h1>
              <p className="text-gray-500 text-sm">Update status and track customer purchases</p>
            </div>

            {ordersLoading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-500 mt-4 font-medium">Fetching orders...</p>
              </div>
            ) : allOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-bold text-lg">No orders available</p>
                <p className="text-gray-400 text-sm mt-1">Pending payments or orders will display here once checkout completes.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4 text-center">Payment</th>
                        <th className="p-4 text-center">Shipping Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                          <td className="p-4 font-mono font-bold text-gray-700">#{order.id.split('-')[0]}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{order.addresses?.full_name || 'Anonymous User'}</p>
                            <p className="text-xs text-gray-400 font-mono select-all truncate w-32">{order.user_id}</p>
                          </td>
                          <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="p-4 text-right font-bold text-emerald-600">₹{order.total_amount.toLocaleString('en-IN')}</td>
                          <td className="p-4 text-center">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">{order.payment_status}</span>
                          </td>
                          <td className="p-4 text-center">
                            <select 
                              value={order.status} 
                              onChange={e => handleOrderStatusUpdate(order.id, e.target.value)}
                              className="appearance-none font-bold text-xs uppercase tracking-wider rounded-full px-3 py-1.5 text-center cursor-pointer border focus:outline-none transition-colors border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: USERS */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">User Management</h1>
              <p className="text-gray-500 text-sm">Manage user roles and approve seller requests</p>
            </div>

            {usersLoading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-500 mt-4 font-medium">Fetching users...</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <th className="p-4">User Details</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-center">Current Role</th>
                        <th className="p-4 text-center">Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allUsers.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{u.full_name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400 font-mono truncate w-32">{u.id}</p>
                          </td>
                          <td className="p-4 text-gray-500">{u.phone || 'N/A'}</td>
                          <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="p-4 text-center">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              u.role === 'admin' ? 'bg-red-100 text-red-700' :
                              u.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                              u.role === 'pending_seller' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role || 'customer'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <select 
                              value={u.role || 'customer'} 
                              onChange={e => handleUserRoleUpdate(u.id, e.target.value)}
                              className="appearance-none font-bold text-xs uppercase tracking-wider rounded-full px-3 py-1.5 text-center cursor-pointer border focus:outline-none transition-colors border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
                            >
                              <option value="customer">Customer</option>
                              <option value="pending_seller">Pending Seller</option>
                              <option value="seller">Seller</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* ADD / EDIT PRODUCT MODALS */}
      <AnimatePresence>
        {(showAddModal || editingProduct) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  {showAddModal ? 'Add New Product' : 'Edit Product'}
                </h3>
                <button 
                  onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={showAddModal ? handleAddProduct : handleUpdateProduct} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                    <input 
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Sony WH-1000XM5..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm cursor-pointer"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                    <input 
                      type="number" required min={0}
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="24999"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₹) (Optional)</label>
                    <input 
                      type="number" min={0}
                      value={formData.original_price}
                      onChange={e => setFormData({...formData, original_price: e.target.value})}
                      placeholder="32999"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                    <input 
                      type="text" required
                      value={formData.brand}
                      onChange={e => setFormData({...formData, brand: e.target.value})}
                      placeholder="Sony"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                    <input 
                      type="number" required min={0}
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      placeholder="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image (Device Upload)</label>
                  <div className="flex gap-4 items-center">
                    <input 
                      type="file" accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    {uploadingImage && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>}
                  </div>
                  {formData.image && (
                    <div className="mt-3 relative inline-block">
                      <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-xl border border-gray-200" />
                      <button type="button" onClick={() => setFormData({...formData, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"><X className="h-3 w-3"/></button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={4} required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide a detailed description of the product features, warranty, etc."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm resize-none"
                  />
                </div>

                <div className="flex gap-6 py-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.is_featured}
                      onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Featured Product</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formData.is_on_sale}
                      onChange={e => setFormData({...formData, is_on_sale: e.target.checked})}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as On Sale</span>
                  </label>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }}
                    className="text-gray-600 font-bold py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploadingImage || !formData.image}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-600/10 disabled:opacity-50"
                  >
                    {showAddModal ? 'Save Product' : 'Update Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

