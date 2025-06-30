
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  color: string;
  hex_color: string;
  size?: string;
  material?: string;
  seasons?: string[];
  occasions?: string[];
  image_url?: string;
  notes?: string;
  purchase_date?: string;
  times_worn: number;
  last_worn?: string;
  is_favorite: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useClothingItems = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItems = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('clothing_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clothing items:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const addItem = async (item: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at' | 'times_worn'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('clothing_items')
      .insert([{ ...item, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding clothing item:', error);
      throw error;
    }

    setItems(prev => [data, ...prev]);
    return data;
  };

  const updateItem = async (id: string, updates: Partial<ClothingItem>) => {
    const { data, error } = await supabase
      .from('clothing_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating clothing item:', error);
      throw error;
    }

    setItems(prev => prev.map(item => item.id === id ? data : item));
    return data;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting clothing item:', error);
      throw error;
    }

    setItems(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
};
