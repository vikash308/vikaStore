import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Plus, Trash2, Edit3, CheckCircle2, Package, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updatePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ full_name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false });

  useEffect(() => {
    if (user) { fetchProfile(); fetchAddresses(); }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).limit(1);
    if (data && data.length > 0) {
      setProfile({ full_name: data[0].full_name || '', phone: data[0].phone || '', role: data[0].role || 'customer' });
    }
  };

  const requestSeller = async () => {
    setSavingProfile(true);
    const { error } = await supabase.from('profiles').update({ role: 'pending_seller' }).eq('id', user.id);
    if (error) toast.error('Failed to request seller status');
    else { toast.success('Seller request sent to Admin!'); fetchProfile(); }
    setSavingProfile(false);
  };

  const fetchAddresses = async () => {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    if (data) setAddresses(data);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await supabase.from('profiles').upsert({ id: user.id, ...profile });
    if (error) toast.error('Failed to save'); else toast.success('Profile updated!');
    setSavingProfile(false);
  };

  const addAddress = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('addresses').insert({ ...newAddress, user_id: user.id });
    if (error) { toast.error('Failed to add address'); return; }
    toast.success('Address added!');
    setShowAddressForm(false);
    setNewAddress({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false });
    fetchAddresses();
  };

  const deleteAddress = async (id) => {
    await supabase.from('addresses').delete().eq('id', id);
    toast('Address removed');
    fetchAddresses();
  };

  const setDefaultAddress = async (id) => {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    fetchAddresses();
    toast.success('Default address updated!');
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">My Account</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 gap-6">
          {[{ id: 'profile', label: 'Profile', icon: User }, { id: 'addresses', label: 'Addresses', icon: MapPin }, { id: 'orders', label: 'Orders', icon: Package }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 font-bold transition-colors text-base ${activeTab === tab.id ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-black">
                {(profile.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{profile.full_name || 'Update your name'}</h2>
                <p className="text-gray-500">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Verified Account</span>
                  {profile.role === 'seller' && <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">Seller</span>}
                  {profile.role === 'admin' && <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">Admin</span>}
                </div>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input value={user?.email || ''} readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
                </div>
              </div>
              <button type="submit" disabled={savingProfile}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50">
                {savingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                Save Changes
              </button>
            </form>

            {/* Become a Seller Section */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-2">Become a Seller</h3>
              {profile.role === 'customer' && (
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">Want to sell your products?</p>
                    <p className="text-sm text-gray-500 mt-1">Request a seller account and start managing your own inventory.</p>
                  </div>
                  <button onClick={requestSeller} disabled={savingProfile}
                    className="flex-shrink-0 bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap">
                    Request Approval
                  </button>
                </div>
              )}
              {profile.role === 'pending_seller' && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-center gap-3 text-amber-800">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <div>
                    <p className="font-bold">Request Pending</p>
                    <p className="text-sm text-amber-700/80">Your request to become a seller is under review by the admin.</p>
                  </div>
                </div>
              )}
              {profile.role === 'seller' && (
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-emerald-900">You are an approved Seller!</p>
                    <p className="text-sm text-emerald-700/80">Head over to your Seller Dashboard to add products.</p>
                  </div>
                  <Link to="/seller" className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap">
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {addresses.map(addr => (
              <div key={addr.id} className={`bg-white rounded-2xl border p-6 shadow-sm ${addr.is_default ? 'border-emerald-400' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    {addr.is_default && <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full mb-2"><CheckCircle2 className="h-3 w-3" /> Default</span>}
                    <p className="font-bold text-gray-900">{addr.full_name} <span className="text-gray-500 font-normal">| {addr.phone}</span></p>
                    <p className="text-gray-600 mt-1">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</p>
                    <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                  <div className="flex gap-2">
                    {!addr.is_default && (
                      <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-emerald-600 font-medium hover:text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg">Set Default</button>
                    )}
                    <button onClick={() => deleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Address Form */}
            {showAddressForm ? (
              <form onSubmit={addAddress} className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm space-y-4">
                <h3 className="font-black text-gray-900 text-lg mb-2">Add New Address</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'full_name', placeholder: 'Recipient name' },
                    { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
                    { label: 'Address Line 1', key: 'address_line1', placeholder: 'House no, Street...' },
                    { label: 'Address Line 2 (Optional)', key: 'address_line2', placeholder: 'Area, Landmark...' },
                    { label: 'City', key: 'city', placeholder: 'Mumbai' },
                    { label: 'State', key: 'state', placeholder: 'Maharashtra' },
                    { label: 'Pincode', key: 'pincode', placeholder: '400001' },
                  ].map(field => (
                    <div key={field.key} className={field.key === 'address_line1' || field.key === 'address_line2' ? 'sm:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input required={field.key !== 'address_line2'} value={newAddress[field.key]} onChange={e => setNewAddress(a => ({ ...a, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm" />
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={newAddress.is_default} onChange={e => setNewAddress(a => ({ ...a, is_default: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600 rounded" />
                  <span className="text-sm text-gray-700">Set as default address</span>
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">Save Address</button>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="text-gray-600 font-medium py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowAddressForm(true)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors font-medium">
                <Plus className="h-5 w-5" /> Add New Address
              </button>
            )}
          </div>
        )}

        {/* Orders Tab (redirect to Orders page) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">View Your Orders</h2>
            <p className="text-gray-500 mb-6">See all your past orders and track their status.</p>
            <Link to="/orders" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-colors">Go to Order History</Link>
          </div>
        )}
      </div>
    </div>
  );
}
