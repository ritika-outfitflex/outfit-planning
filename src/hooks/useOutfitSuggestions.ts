
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ClothingItem } from './useClothingItems';

export interface OutfitSuggestion {
  id: string;
  name: string;
  description: string;
  items: ClothingItem[];
  occasion: string;
  weather?: string;
  confidence: number;
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
      // Fetch user's clothing items
      const { data: items, error } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (!items || items.length === 0) {
        setSuggestions([]);
        return;
      }

      // Generate outfit suggestions based on simple logic
      const generatedSuggestions = generateOutfitCombinations(items, preferences);
      setSuggestions(generatedSuggestions);

      // Store suggestions in database
      for (const suggestion of generatedSuggestions) {
        await supabase
          .from('ai_suggestions')
          .insert({
            user_id: user.id,
            suggestion_type: 'outfit',
            input_data: preferences,
            suggestion_data: {
              name: suggestion.name,
              description: suggestion.description,
              items: suggestion.items.map(item => item.id),
              occasion: suggestion.occasion,
              weather: suggestion.weather,
              confidence: suggestion.confidence,
              reasoning: suggestion.reasoning
            }
          });
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOutfitCombinations = (items: ClothingItem[], preferences: any): OutfitSuggestion[] => {
    const suggestions: OutfitSuggestion[] = [];
    
    // Categorize items
    const tops = items.filter(item => item.category === 'Tops');
    const bottoms = items.filter(item => item.category === 'Bottoms');
    const dresses = items.filter(item => item.category === 'Dresses');
    const shoes = items.filter(item => item.category === 'Shoes');
    const outerwear = items.filter(item => item.category === 'Outerwear');
    const accessories = items.filter(item => item.category === 'Accessories');

    // Generate dress-based outfits
    dresses.forEach((dress, index) => {
      if (index >= 2) return; // Limit to 2 dress outfits
      
      const outfitItems = [dress];
      const availableShoes = shoes.filter(shoe => 
        isOccasionMatch(shoe, preferences.occasion) &&
        isSeasonMatch(shoe, preferences.season)
      );
      if (availableShoes.length > 0) {
        outfitItems.push(availableShoes[0]);
      }

      // Add accessories if available
      const suitableAccessories = accessories.filter(acc => 
        isOccasionMatch(acc, preferences.occasion)
      );
      if (suitableAccessories.length > 0) {
        outfitItems.push(suitableAccessories[0]);
      }

      suggestions.push({
        id: `dress-${index}`,
        name: `${dress.name} Look`,
        description: `Elegant outfit featuring your ${dress.name.toLowerCase()}`,
        items: outfitItems,
        occasion: preferences.occasion || 'casual',
        weather: preferences.weather,
        confidence: 85,
        reasoning: `Selected ${dress.name} as the main piece, paired with matching accessories for a complete look.`
      });
    });

    // Generate top + bottom combinations
    let combinationIndex = 0;
    for (let i = 0; i < Math.min(tops.length, 3); i++) {
      for (let j = 0; j < Math.min(bottoms.length, 2); j++) {
        if (combinationIndex >= 3) break; // Limit combinations
        
        const top = tops[i];
        const bottom = bottoms[j];
        
        // Check if colors work well together
        if (!colorsMatch(top.color, bottom.color)) continue;
        
        // Check occasion and season compatibility
        if (!isOccasionMatch(top, preferences.occasion) || 
            !isOccasionMatch(bottom, preferences.occasion)) continue;

        const outfitItems = [top, bottom];
        
        // Add shoes
        const suitableShoes = shoes.filter(shoe => 
          isOccasionMatch(shoe, preferences.occasion) &&
          colorsMatch(shoe.color, top.color) || colorsMatch(shoe.color, bottom.color)
        );
        if (suitableShoes.length > 0) {
          outfitItems.push(suitableShoes[0]);
        }

        // Add outerwear if weather suggests it
        if (preferences.weather === 'cold' || preferences.season === 'winter') {
          const suitableOuterwear = outerwear.filter(item => 
            isSeasonMatch(item, preferences.season)
          );
          if (suitableOuterwear.length > 0) {
            outfitItems.push(suitableOuterwear[0]);
          }
        }

        suggestions.push({
          id: `combo-${combinationIndex}`,
          name: `${top.name} & ${bottom.name}`,
          description: `Stylish combination of ${top.name.toLowerCase()} with ${bottom.name.toLowerCase()}`,
          items: outfitItems,
          occasion: preferences.occasion || 'casual',
          weather: preferences.weather,
          confidence: calculateConfidence(outfitItems, preferences),
          reasoning: `Paired ${top.name} with ${bottom.name} based on color coordination and occasion suitability.`
        });

        combinationIndex++;
      }
    }

    // Sort by confidence score
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  };

  const colorsMatch = (color1: string, color2: string): boolean => {
    const neutralColors = ['black', 'white', 'gray', 'grey', 'beige', 'navy', 'cream'];
    const color1Lower = color1.toLowerCase();
    const color2Lower = color2.toLowerCase();
    
    // Neutrals go with everything
    if (neutralColors.some(neutral => color1Lower.includes(neutral)) ||
        neutralColors.some(neutral => color2Lower.includes(neutral))) {
      return true;
    }
    
    // Same color family
    if (color1Lower === color2Lower) return true;
    
    // Basic color matching rules
    const colorPairs = [
      ['blue', 'white'], ['blue', 'denim'], ['black', 'white'],
      ['red', 'black'], ['pink', 'gray'], ['green', 'brown']
    ];
    
    return colorPairs.some(pair => 
      (color1Lower.includes(pair[0]) && color2Lower.includes(pair[1])) ||
      (color1Lower.includes(pair[1]) && color2Lower.includes(pair[0]))
    );
  };

  const isOccasionMatch = (item: ClothingItem, occasion?: string): boolean => {
    if (!occasion || !item.occasion) return true;
    return item.occasion === occasion || item.occasion === 'casual';
  };

  const isSeasonMatch = (item: ClothingItem, season?: string): boolean => {
    if (!season || !item.season) return true;
    return item.season === season || item.season === 'all-season';
  };

  const calculateConfidence = (items: ClothingItem[], preferences: any): number => {
    let score = 70; // Base score
    
    // Bonus for occasion match
    if (preferences.occasion && items.some(item => item.occasion === preferences.occasion)) {
      score += 10;
    }
    
    // Bonus for season match
    if (preferences.season && items.some(item => item.season === preferences.season)) {
      score += 10;
    }
    
    // Bonus for having shoes
    if (items.some(item => item.category === 'Shoes')) {
      score += 5;
    }
    
    return Math.min(score, 95);
  };

  const saveOutfit = async (suggestion: OutfitSuggestion) => {
    if (!user) return;

    try {
      const { data: outfit, error: outfitError } = await supabase
        .from('outfits')
        .insert({
          user_id: user.id,
          name: suggestion.name,
          description: suggestion.description,
          occasion: suggestion.occasion,
          weather: suggestion.weather
        })
        .select()
        .single();

      if (outfitError) throw outfitError;

      // Add outfit items
      const outfitItems = suggestion.items.map(item => ({
        outfit_id: outfit.id,
        clothing_item_id: item.id
      }));

      const { error: itemsError } = await supabase
        .from('outfit_items')
        .insert(outfitItems);

      if (itemsError) throw itemsError;

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
