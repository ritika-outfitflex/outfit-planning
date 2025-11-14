import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WardrobeGap {
  category: string;
  color?: string;
  style?: string;
}

interface ProductSearchRequest {
  gaps: WardrobeGap[];
  userId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gaps, userId }: ProductSearchRequest = await req.json();
    console.log('Product search request:', { gaps, userId });

    // In production, this would integrate with affiliate networks like:
    // - Commission Junction
    // - ShareASale  
    // - Amazon Associates Product Advertising API
    // - Rakuten Advertising
    
    // For now, we'll use Unsplash API for product images and create affiliate-ready links
    const UNSPLASH_ACCESS_KEY = Deno.env.get('UNSPLASH_ACCESS_KEY');
    
    const products = await Promise.all(
      gaps.map(async (gap, index) => {
        try {
          // Search for product images based on gap category
          let imageUrl = `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400`; // Default
          
          if (UNSPLASH_ACCESS_KEY) {
            const searchTerm = `${gap.color || ''} ${gap.category} fashion`.trim();
            const unsplashResponse = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1`,
              {
                headers: {
                  'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
              }
            );
            
            if (unsplashResponse.ok) {
              const unsplashData = await unsplashResponse.json();
              if (unsplashData.results && unsplashData.results.length > 0) {
                imageUrl = unsplashData.results[0].urls.regular;
              }
            }
          }

          // Generate product recommendations with affiliate tracking
          const productName = generateProductName(gap);
          const price = generatePrice(gap.category);
          const matchScore = 85 + Math.floor(Math.random() * 15); // 85-100%
          
          // Create affiliate link (in production, use real affiliate network)
          // Format: https://affiliate-network.com/click?id=YOUR_ID&url=PRODUCT_URL
          const affiliateLink = `https://example-affiliate.com/redirect?ref=outfitflex&product=${encodeURIComponent(productName)}&category=${gap.category}`;
          
          return {
            id: `product-${index}-${Date.now()}`,
            name: productName,
            category: gap.category,
            color: gap.color || 'Varies',
            price: price,
            image: imageUrl,
            reason: generateReason(gap),
            matchScore: matchScore,
            shopUrl: affiliateLink,
            affiliateNetwork: 'Example Network',
            commission: '5-10%' // Typical affiliate commission
          };
        } catch (error) {
          console.error(`Error fetching product for gap ${index}:`, error);
          return null;
        }
      })
    );

    const validProducts = products.filter(p => p !== null);
    
    console.log(`Generated ${validProducts.length} product recommendations`);

    return new Response(
      JSON.stringify({ 
        products: validProducts,
        totalResults: validProducts.length,
        affiliateDisclosure: 'OutfitFlex may earn a commission from purchases made through these links.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in product search:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateProductName(gap: WardrobeGap): string {
  const adjectives = ['Classic', 'Modern', 'Elegant', 'Casual', 'Designer', 'Premium', 'Stylish'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  const categoryNames: Record<string, string[]> = {
    'Tops': ['Blouse', 'Shirt', 'Sweater', 'Top'],
    'Bottoms': ['Pants', 'Jeans', 'Trousers', 'Skirt'],
    'Dresses': ['Dress', 'Maxi Dress', 'Mini Dress', 'Midi Dress'],
    'Shoes': ['Sneakers', 'Boots', 'Heels', 'Flats'],
    'Accessories': ['Bag', 'Belt', 'Scarf', 'Hat', 'Watch'],
    'Outerwear': ['Jacket', 'Coat', 'Blazer', 'Cardigan']
  };
  
  const items = categoryNames[gap.category] || ['Item'];
  const item = items[Math.floor(Math.random() * items.length)];
  
  return gap.color 
    ? `${adjective} ${gap.color} ${item}`
    : `${adjective} ${item}`;
}

function generatePrice(category: string): string {
  const priceRanges: Record<string, [number, number]> = {
    'Tops': [29.99, 89.99],
    'Bottoms': [39.99, 129.99],
    'Dresses': [49.99, 199.99],
    'Shoes': [59.99, 179.99],
    'Accessories': [19.99, 149.99],
    'Outerwear': [79.99, 299.99]
  };
  
  const [min, max] = priceRanges[category] || [29.99, 99.99];
  const price = min + Math.random() * (max - min);
  
  return `$${price.toFixed(2)}`;
}

function generateReason(gap: WardrobeGap): string {
  const reasons = [
    `Perfect ${gap.category.toLowerCase()} to complete your wardrobe`,
    `Fill the gap in your ${gap.category.toLowerCase()} collection`,
    `Versatile piece that matches your existing items`,
    `Essential ${gap.category.toLowerCase()} for a complete wardrobe`,
    `Complements your current style perfectly`
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}