import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ItemDetails {
  category: string;
  subcategory?: string;
  color: string;
  pattern?: string;
  material?: string;
  sleeveType?: string;
  pantStyle?: string;
  neckline?: string;
  fit?: string;
}

export const useItemNameGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateName = async (details: ItemDetails): Promise<string> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-item-name', {
        body: { details }
      });

      if (error) throw error;
      
      return data.name || buildFallbackName(details);
    } catch (error) {
      console.error('Error generating name:', error);
      return buildFallbackName(details);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildFallbackName = (details: ItemDetails): string => {
    const parts: string[] = [];
    
    // Add color
    if (details.color) parts.push(details.color);
    
    // Add pattern if not solid
    if (details.pattern && details.pattern !== 'solid') {
      parts.push(details.pattern);
    }
    
    // Add material
    if (details.material) parts.push(details.material);
    
    // Add specific attributes
    if (details.sleeveType) parts.push(details.sleeveType);
    if (details.pantStyle) parts.push(details.pantStyle);
    if (details.neckline) parts.push(details.neckline);
    if (details.fit) parts.push(details.fit);
    
    // Add subcategory or category
    parts.push(details.subcategory || details.category);
    
    return parts.join(' ');
  };

  return { generateName, isGenerating };
};