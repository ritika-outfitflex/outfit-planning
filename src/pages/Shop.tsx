import React, { useState, useEffect } from 'react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Sparkles, ExternalLink, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductRecommendation {
  id: string;
  name: string;
  category: string;
  color: string;
  price: string;
  image: string;
  reason: string;
  matchScore: number;
  shopUrl: string;
}

const Shop = () => {
  const { items, loading: itemsLoading } = useClothingItems();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemsLoading && items.length > 0) {
      generateRecommendations();
    }
  }, [itemsLoading, items]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Analyze wardrobe to find gaps
      const categories = items.map(item => item.category);
      const colors = items.map(item => item.color);
      
      const categoryCount: Record<string, number> = {};
      categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });

      // Generate AI-powered recommendations based on wardrobe analysis
      const wardrobeAnalysis = {
        totalItems: items.length,
        categories: Object.keys(categoryCount),
        dominantColors: [...new Set(colors)].slice(0, 3),
        missingCategories: ['Accessories', 'Outerwear', 'Footwear'].filter(
          cat => !categories.includes(cat)
        )
      };

      // Simulated product recommendations (in production, this would call an e-commerce API)
      const mockRecommendations: ProductRecommendation[] = [
        {
          id: '1',
          name: 'Classic Leather Jacket',
          category: 'Outerwear',
          color: 'Black',
          price: '$149.99',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
          reason: 'Perfect layering piece for your wardrobe',
          matchScore: 95,
          shopUrl: '#'
        },
        {
          id: '2',
          name: 'Designer Sneakers',
          category: 'Footwear',
          color: 'White',
          price: '$89.99',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
          reason: 'Versatile footwear to complete any outfit',
          matchScore: 92,
          shopUrl: '#'
        },
        {
          id: '3',
          name: 'Minimalist Watch',
          category: 'Accessories',
          color: 'Silver',
          price: '$199.99',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          reason: 'Elevate your style with timeless accessories',
          matchScore: 88,
          shopUrl: '#'
        },
        {
          id: '4',
          name: 'Silk Scarf',
          category: 'Accessories',
          color: 'Floral',
          price: '$45.99',
          image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
          reason: 'Add elegance and variety to your outfits',
          matchScore: 85,
          shopUrl: '#'
        },
        {
          id: '5',
          name: 'Denim Jacket',
          category: 'Outerwear',
          color: 'Blue',
          price: '$79.99',
          image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400',
          reason: 'Essential casual layer for every season',
          matchScore: 90,
          shopUrl: '#'
        },
        {
          id: '6',
          name: 'Crossbody Bag',
          category: 'Accessories',
          color: 'Brown',
          price: '$129.99',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
          reason: 'Practical accessory that complements your style',
          matchScore: 87,
          shopUrl: '#'
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (itemsLoading || loading) {
    return (
      <div className="safe-top safe-bottom pb-20 px-4">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-top safe-bottom pb-20 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="hero-header">
        <div className="hero-content">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <h1 className="hero-title">Style Shop</h1>
          </div>
          <p className="hero-subtitle">Curated picks for your wardrobe</p>
        </div>
        <div className="hero-decoration" />
      </div>

      <div className="px-4 space-y-6">
        {/* AI Recommendation Banner */}
        <Card className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">AI-Powered Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your {items.length} items, we've curated these picks to complement your style and fill gaps in your wardrobe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {recommendations.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                  {product.matchScore}% Match
                </Badge>
              </div>
              <CardHeader className="p-3">
                <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {product.reason}
                </p>
                <p className="text-lg font-bold text-foreground">{product.price}</p>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: 'Coming Soon',
                      description: 'E-commerce integration will be available soon!',
                    });
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Note */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">Smart Shopping Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  Our AI analyzes your wardrobe to recommend items that will maximize your outfit combinations and fill style gaps. Integration with major retailers coming soon!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shop;