import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      fetchWishlist: async (userId) => {
        if (!userId) return;
        const { data, error } = await supabase
          .from('wishlists')
          .select('*, products(*)')
          .eq('user_id', userId);
        if (!error) set({ items: data.map(w => w.products) });
      },

      addToWishlist: async (product, userId) => {
        if (!userId) return false;
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: userId, product_id: product.id });
        if (!error) {
          set(state => ({ items: [...state.items.filter(i => i.id !== product.id), product] }));
          return true;
        }
        return false;
      },

      removeFromWishlist: async (productId, userId) => {
        if (!userId) return;
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
        set(state => ({ items: state.items.filter(i => i.id !== productId) }));
      },

      isWishlisted: (productId) => {
        return get().items.some(i => i.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'wishlist-store' }
  )
);
