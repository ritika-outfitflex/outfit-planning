
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Outfit {
  id: string;
  name: string;
  description?: string;
  season?: string;
  occasion?: string;
  weather?: string;
  is_favorite: boolean;
  times_worn: number;
  last_worn?: string;
  created_at: string;
  updated_at: string;
  items?: OutfitItem[];
}

export interface OutfitItem {
  id: string;
  clothing_item_id: string;
  clothing_item?: {
    id: string;
    name: string;
    image_url?: string;
    color: string;
    category: string;
  };
}

export const useOutfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOutfits = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('outfits')
      .select(`
        *,
        outfit_items (
          id,
          clothing_item_id,
          clothing_items (
            id,
            name,
            image_url,
            color,
            category
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching outfits:', error);
    } else {
      const formattedOutfits = data?.map(outfit => ({
        ...outfit,
        items: outfit.outfit_items?.map(item => ({
          id: item.id,
          clothing_item_id: item.clothing_item_id,
          clothing_item: item.clothing_items
        }))
      })) || [];
      setOutfits(formattedOutfits);
    }
    setLoading(false);
  };

  const createOutfit = async (outfitData: {
    name: string;
    description?: string;
    season?: string;
    occasion?: string;
    weather?: string;
    itemIds: string[];
  }) => {
    if (!user) return;

    const { data: outfit, error: outfitError } = await supabase
      .from('outfits')
      .insert([{
        name: outfitData.name,
        description: outfitData.description,
        season: outfitData.season,
        occasion: outfitData.occasion,
        weather: outfitData.weather,
        user_id: user.id
      }])
      .select()
      .single();

    if (outfitError) {
      console.error('Error creating outfit:', outfitError);
      throw outfitError;
    }

    if (outfitData.itemIds.length > 0) {
      const { error: itemsError } = await supabase
        .from('outfit_items')
        .insert(
          outfitData.itemIds.map(itemId => ({
            outfit_id: outfit.id,
            clothing_item_id: itemId
          }))
        );

      if (itemsError) {
        console.error('Error adding items to outfit:', itemsError);
        throw itemsError;
      }
    }

    await fetchOutfits();
    return outfit;
  };

  const updateOutfit = async (id: string, updates: Partial<Outfit>) => {
    const { data, error } = await supabase
      .from('outfits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating outfit:', error);
      throw error;
    }

    setOutfits(prev => prev.map(outfit => outfit.id === id ? { ...outfit, ...data } : outfit));
    return data;
  };

  const deleteOutfit = async (id: string) => {
    const { error } = await supabase
      .from('outfits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting outfit:', error);
      throw error;
    }

    setOutfits(prev => prev.filter(outfit => outfit.id !== id));
  };

  const toggleFavorite = async (id: string) => {
    const outfit = outfits.find(o => o.id === id);
    if (!outfit) return;

    await updateOutfit(id, { is_favorite: !outfit.is_favorite });
  };

  useEffect(() => {
    fetchOutfits();
  }, [user]);

  return {
    outfits,
    loading,
    createOutfit,
    updateOutfit,
    deleteOutfit,
    toggleFavorite,
    refetch: fetchOutfits
  };
};
