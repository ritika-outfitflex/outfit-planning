import React, { useState, useEffect } from 'react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Sparkles, ExternalLink, TrendingUp, Search, Filter, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  affiliateNetwork?: string;
  commission?: string;
}

const Shop = () => {
  const { items, loading: itemsLoading } = useClothingItems();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');

  useEffect(() => {
    if (!itemsLoading && items.length > 0) {
      generateRecommendations();
    }
  }, [itemsLoading, items]);

  const generateRecommendations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Analyze wardrobe to find gaps
      const categories = items.map(item => item.category);
      const colors = items.map(item => item.color);
      
      const categoryCount: Record<string, number> = {};
      categories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });

      // Identify wardrobe gaps
      const allCategories = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'];
      const gaps = allCategories
        .filter(cat => !categories.includes(cat) || categoryCount[cat] < 3)
        .map(cat => ({
          category: cat,
          color: colors[Math.floor(Math.random() * colors.length)]
        }));

      // Call edge function to fetch real product recommendations
      const { data, error } = await supabase.functions.invoke('product-search', {
        body: {
          gaps: gaps.slice(0, 6), // Get top 6 recommendations
          userId: user.id
        }
      });

      if (error) throw error;

      if (data?.products) {
        setRecommendations(data.products);
      }
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

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(product => {
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesPrice = priceFilter === 'all' || (() => {
      const price = parseFloat(product.price.replace('$', ''));
      if (priceFilter === 'under50') return price < 50;
      if (priceFilter === '50to100') return price >= 50 && price < 100;
      if (priceFilter === '100to200') return price >= 100 && price < 200;
      if (priceFilter === 'over200') return price >= 200;
      return true;
    })();
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
        {/* Affiliate Disclosure */}
        <Alert className="border-primary/30 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Affiliate Disclosure:</strong> OutfitFlex may earn a commission from purchases made through these links at no extra cost to you.
          </AlertDescription>
        </Alert>

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

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tops">Tops</SelectItem>
                <SelectItem value="Bottoms">Bottoms</SelectItem>
                <SelectItem value="Dresses">Dresses</SelectItem>
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Outerwear">Outerwear</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under50">Under $50</SelectItem>
                <SelectItem value="50to100">$50 - $100</SelectItem>
                <SelectItem value="100to200">$100 - $200</SelectItem>
                <SelectItem value="over200">Over $200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredRecommendations.length} of {recommendations.length} products
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredRecommendations.map((product) => (
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
                    window.open(product.shopUrl, '_blank');
                    toast({
                      title: 'Opening Shop',
                      description: 'Redirecting to retailer...',
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