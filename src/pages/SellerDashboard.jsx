import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PackagePlus, LayoutDashboard, LogOut, 
  ShoppingBag, Plus, Trash2, Edit3, X, Store
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const { signOut, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  
  // Products Management
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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

      const { error } = await supabase.from('products').insert([payload]);
      if (error) throw error;

      toast.success('Product added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
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
      brand: product.brand || '',
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

      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', original_price: '', image: '',
      category: 'Electronics', brand: '', stock: 100, is_featured: false, is_on_sale: false
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shrink-0">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Store className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Seller Panel</h2>
            <p className="text-xs text-gray-500 truncate w-36">{user?.email}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PackagePlus className="h-5 w-5" />
            <span>My Inventory</span>
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
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900">My Inventory</h1>
                <p className="text-gray-500 text-sm">You have {products.length} products listed</p>
              </div>
              <button 
                onClick={() => { resetForm(); setShowAddModal(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer"
              >
                <Plus className="h-5 w-5" /> Add New Product
              </button>
            </div>

            <div className="relative max-w-md bg-white rounded-xl border border-gray-200">
              <input 
                type="text" placeholder="Search your products..."
                value={productSearch} onChange={e => setProductSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {productsLoading ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-gray-500 mt-4 font-medium">Loading inventory...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-bold text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Start selling by adding your first product!</p>
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
                              <p className="text-xs text-gray-400">{p.brand}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">{p.category}</span>
                          </td>
                          <td className="p-4 text-right">
                            <p className="font-bold text-gray-900">₹{p.price.toLocaleString('en-IN')}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`font-bold text-sm ${p.stock <= 10 ? 'text-red-600' : 'text-gray-700'}`}>{p.stock}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button onClick={() => handleEditProductClick(p)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100"><Edit3 className="h-4 w-4" /></button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"><Trash2 className="h-4 w-4" /></button>
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
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingProduct) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">{showAddModal ? 'Add New Product' : 'Edit Product'}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="h-5 w-5 text-gray-500" /></button>
              </div>

              <form onSubmit={showAddModal ? handleAddProduct : handleUpdateProduct} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm">
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" required min={0} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
                    <input type="number" required min={0} value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image (Device Upload)</label>
                  <div className="flex gap-4 items-center">
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
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
                  <textarea rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm resize-none" />
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingProduct(null); resetForm(); }} className="text-gray-600 font-bold py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={uploadingImage || !formData.image} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-600/10 disabled:opacity-50">
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
