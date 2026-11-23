"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

export type CartItem = {
  uid: string;
  size: any;
  quantity: number;
  id?: string; // Supabase record ID
};

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (uid: string, size: any, quantity: number) => Promise<void>;
  removeFromCart: (uid: string, size: any) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to get local cart
  const getLocalCart = (): CartItem[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  };

  // Helper to save local cart
  const saveLocalCart = (items: CartItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("cart", JSON.stringify(items));
    setCart([...items]);
    // Dispatch event for any legacy listeners
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Fetch from Supabase
  const fetchCloudCart = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, size, quantity, id')
        .eq('user_id', user.id);

      if (error) throw error;

      const formatted: CartItem[] = data.map(item => ({
        uid: item.product_id,
        size: item.size,
        quantity: item.quantity,
        id: item.id
      }));
      setCart(formatted);
    } catch (error) {
      console.error("Error fetching cloud cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Sync Local to Cloud
  const syncLocalToCloud = useCallback(async (localItems: CartItem[]) => {
    if (!user || localItems.length === 0) return;

    try {
      for (const item of localItems) {
        await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: item.uid,
            size: item.size,
            quantity: item.quantity
          }, {
            onConflict: 'user_id, product_id, size'
          });
      }
      localStorage.removeItem("cart");
      await fetchCloudCart();
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, [user, fetchCloudCart]);

  // Handle Auth Changes
  useEffect(() => {
    setLoading(true);
    if (user) {
      const local = getLocalCart();
      if (local.length > 0) {
        syncLocalToCloud(local);
      } else {
        fetchCloudCart();
      }
    } else {
      setCart(getLocalCart());
      setLoading(false);
    }
  }, [user, fetchCloudCart, syncLocalToCloud]);

  const addToCart = async (item: CartItem) => {
    if (user) {
      try {
        // Fetch existing first to manually increment quantity or use RPC/upsert
        // We'll use upsert with a small check if we want to add to existing qty
        const { data: existing } = await supabase
          .from('cart_items')
          .select('quantity')
          .match({ user_id: user.id, product_id: item.uid, size: item.size })
          .maybeSingle();

        const newQty = existing ? existing.quantity + item.quantity : item.quantity;

        const { error } = await supabase
          .from('cart_items')
          .upsert({
            user_id: user.id,
            product_id: item.uid,
            size: item.size,
            quantity: newQty
          }, {
            onConflict: 'user_id, product_id, size'
          });

        if (error) throw error;
        await fetchCloudCart();
        toast.success("Added to cart");
      } catch (error) {
        console.error(error);
        toast.error("Failed to add to cart");
      }
    } else {
      const current = getLocalCart();
      const existing = current.find(c => c.uid === item.uid && c.size === item.size);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        current.push(item);
      }
      saveLocalCart(current);
      toast.success("Added to cart");
    }
  };

  const updateQuantity = async (uid: string, size: any, quantity: number) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .match({ user_id: user.id, product_id: uid, size });

        if (error) throw error;
        await fetchCloudCart();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update quantity");
      }
    } else {
      const current = getLocalCart();
      const updated = current.map(c => 
        (c.uid === uid && c.size === size) ? { ...c, quantity } : c
      );
      saveLocalCart(updated);
    }
  };

  const removeFromCart = async (uid: string, size: any) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .match({ user_id: user.id, product_id: uid, size });

        if (error) throw error;
        await fetchCloudCart();
        toast.success("Removed from cart");
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove item");
      }
    } else {
      const current = getLocalCart();
      const filtered = current.filter(c => !(c.uid === uid && c.size === size));
      saveLocalCart(filtered);
      toast.success("Removed from cart");
    }
  };

  const clearCart = () => {
    setCart([]);
    if (typeof window !== "undefined") localStorage.removeItem("cart");
  };

  const refreshCart = async () => {
    if (user) await fetchCloudCart();
    else setCart(getLocalCart());
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
