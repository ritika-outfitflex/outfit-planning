
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OutfitCalendarEntry {
  id: string;
  user_id: string;
  date: string;
  outfit_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  outfit?: {
    id: string;
    name: string;
    description?: string;
    items?: Array<{
      id: string;
      clothing_item_id: string;
      clothing_item?: {
        id: string;
        name: string;
        image_url?: string;
        color: string;
        hex_color: string;
        category: string;
      };
    }>;
  };
}

export const useOutfitCalendar = () => {
  const [entries, setEntries] = useState<OutfitCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('outfit_calendar')
      .select(`
        *,
        outfits (
          id,
          name,
          description,
          outfit_items (
            id,
            clothing_item_id,
            clothing_items (
              id,
              name,
              image_url,
              color,
              hex_color,
              category
            )
          )
        )
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching outfit calendar:', error);
    } else {
      const formattedEntries = data?.map(entry => ({
        ...entry,
        outfit: entry.outfits ? {
          ...entry.outfits,
          items: entry.outfits.outfit_items?.map(item => ({
            id: item.id,
            clothing_item_id: item.clothing_item_id,
            clothing_item: item.clothing_items
          }))
        } : undefined
      })) || [];
      setEntries(formattedEntries);
    }
    setLoading(false);
  };

  const addEntry = async (date: string, outfitId?: string, notes?: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('outfit_calendar')
      .upsert([{
        user_id: user.id,
        date,
        outfit_id: outfitId,
        notes
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding calendar entry:', error);
      throw error;
    }

    await fetchEntries();
    return data;
  };

  const updateEntry = async (id: string, updates: Partial<OutfitCalendarEntry>) => {
    const { data, error } = await supabase
      .from('outfit_calendar')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating calendar entry:', error);
      throw error;
    }

    await fetchEntries();
    return data;
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('outfit_calendar')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting calendar entry:', error);
      throw error;
    }

    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries
  };
};
