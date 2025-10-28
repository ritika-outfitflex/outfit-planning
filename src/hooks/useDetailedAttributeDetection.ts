import { useState } from 'react';
import { pipeline } from '@huggingface/transformers';

interface DetailedAttributes {
  sleeveType?: string;
  pantStyle?: string;
  neckline?: string;
  fit?: string;
}

export const useDetailedAttributeDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const detectAttributes = async (
    imageFile: File,
    category: string,
    subcategory?: string
  ): Promise<DetailedAttributes> => {
    setIsProcessing(true);
    
    try {
      const classifier = await pipeline(
        'image-classification',
        'Xenova/vit-base-patch16-224'
      );

      const imageUrl = URL.createObjectURL(imageFile);
      const results = await classifier(imageUrl);
      
      URL.revokeObjectURL(imageUrl);

      const attributes: DetailedAttributes = {};

      // Detect sleeve types for tops
      if (category === 'Tops' || category === 'Dresses' || category === 'Outerwear') {
        attributes.sleeveType = detectSleeveType(results, subcategory);
      }

      // Detect pant styles for bottoms
      if (category === 'Bottoms') {
        attributes.pantStyle = detectPantStyle(results, subcategory);
      }

      // Detect neckline for tops and dresses
      if (category === 'Tops' || category === 'Dresses') {
        attributes.neckline = detectNeckline(results);
      }

      // Detect fit for most categories
      if (['Tops', 'Bottoms', 'Dresses', 'Outerwear'].includes(category)) {
        attributes.fit = detectFit(results);
      }

      return attributes;
    } catch (error) {
      console.error('Attribute detection error:', error);
      return {};
    } finally {
      setIsProcessing(false);
    }
  };

  const detectSleeveType = (results: any[], subcategory?: string): string => {
    const labels = results.map(r => r.label.toLowerCase());
    
    // Look for sleeve-related keywords
    if (labels.some(l => l.includes('tank') || l.includes('sleeveless'))) {
      return 'Sleeveless';
    }
    if (labels.some(l => l.includes('short sleeve') || subcategory?.toLowerCase().includes('t-shirt'))) {
      return 'Short Sleeve';
    }
    if (labels.some(l => l.includes('long sleeve') || l.includes('sweater'))) {
      return 'Long Sleeve';
    }
    if (labels.some(l => l.includes('three quarter') || l.includes('3/4'))) {
      return '3/4 Sleeve';
    }
    
    return 'Regular';
  };

  const detectPantStyle = (results: any[], subcategory?: string): string => {
    const labels = results.map(r => r.label.toLowerCase());
    const subLower = subcategory?.toLowerCase() || '';
    
    // Match with subcategory and image analysis
    if (subLower.includes('jean') || labels.some(l => l.includes('jean'))) {
      return 'Denim';
    }
    if (labels.some(l => l.includes('wide') || l.includes('palazzo'))) {
      return 'Wide Leg';
    }
    if (labels.some(l => l.includes('bell') || l.includes('flare'))) {
      return 'Bell Bottom';
    }
    if (labels.some(l => l.includes('straight'))) {
      return 'Straight Fit';
    }
    if (labels.some(l => l.includes('skinny') || l.includes('tight'))) {
      return 'Skinny';
    }
    if (labels.some(l => l.includes('boot'))) {
      return 'Bootcut';
    }
    if (subLower.includes('legging')) {
      return 'Leggings';
    }
    
    return 'Regular';
  };

  const detectNeckline = (results: any[]): string => {
    const labels = results.map(r => r.label.toLowerCase());
    
    if (labels.some(l => l.includes('v-neck') || l.includes('vneck'))) {
      return 'V-Neck';
    }
    if (labels.some(l => l.includes('crew') || l.includes('round'))) {
      return 'Crew Neck';
    }
    if (labels.some(l => l.includes('turtle'))) {
      return 'Turtleneck';
    }
    if (labels.some(l => l.includes('scoop'))) {
      return 'Scoop Neck';
    }
    if (labels.some(l => l.includes('collar') || l.includes('button'))) {
      return 'Collared';
    }
    if (labels.some(l => l.includes('off shoulder'))) {
      return 'Off-Shoulder';
    }
    
    return 'Regular';
  };

  const detectFit = (results: any[]): string => {
    const labels = results.map(r => r.label.toLowerCase());
    
    if (labels.some(l => l.includes('oversized') || l.includes('loose'))) {
      return 'Oversized';
    }
    if (labels.some(l => l.includes('slim') || l.includes('fitted'))) {
      return 'Slim Fit';
    }
    if (labels.some(l => l.includes('relaxed'))) {
      return 'Relaxed';
    }
    if (labels.some(l => l.includes('tight') || l.includes('body'))) {
      return 'Fitted';
    }
    
    return 'Regular';
  };

  return { detectAttributes, isProcessing };
};