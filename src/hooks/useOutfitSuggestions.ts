
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClothingItem } from './useClothingItems';

export interface OutfitSuggestion {
  title: string;
  match_score: string;
  items: string[];
  occasion: string;
  reasoning: string;
}

export const useOutfitSuggestions = () => {
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const generateSuggestions = async (preferences: {
    occasion?: string;
    weather?: string;
    season?: string;
    style?: string;
  }) => {
    if (!user) return;

    setLoading(true);
    try {
      // Call AI fashion stylist edge function
      const { data, error } = await supabase.functions.invoke('fashion-stylist', {
        body: {
          filters: preferences,
          user_id: user.id
        }
      });

      if (error) throw error;

      setSuggestions(data.outfits || []);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };



  const saveOutfit = async (suggestion: OutfitSuggestion) => {
    if (!user) return;

    try {
      // Find clothing items by name from the suggestion
      const { data: items, error: itemsError } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id);

      if (itemsError) throw itemsError;

      // Match item names to actual clothing items
      const matchedItems = suggestion.items.map(itemName => 
        items?.find(item => item.name.toLowerCase() === itemName.toLowerCase())
      ).filter(Boolean);

      if (matchedItems.length === 0) {
        throw new Error('No matching items found');
      }

      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          name: suggestion.title,
          description: suggestion.reasoning,
          occasion: suggestion.occasion
        })
        .select()
        .single();

      if (outfitError) throw outfitError;

      // Add outfit items
      const outfitItems = matchedItems.map(item => ({
        outfit_id: outfit.id,
        clothing_item_id: item!.id
      }));

      const { error: linkError } = await supabase
        .from('outfit_items')
        .insert(outfitItems);

      if (linkError) throw linkError;

      return outfit;
    } catch (error) {
      console.error('Error saving outfit:', error);
      throw error;
    }
  };

  return {
    suggestions,
    loading,
    generateSuggestions,
    saveOutfit
  };
};
