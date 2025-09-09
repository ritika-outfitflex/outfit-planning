
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shirt, Heart, Star } from 'lucide-react';
import ClothingItem from '@/components/Wardrobe/ClothingItem';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

const WardrobePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { items, loading } = useClothingItems();
  const { getFirstName } = useUserProfile();
  
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6 pb-6 animate-fade-in">
        <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
          <div className="text-center text-white space-y-3">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
              <h1 className="text-3xl font-bold">{getFirstName()}'s Wardrobe</h1>
              <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
            </div>
            <p className="text-purple-100 text-lg font-medium">Your Fashion Collection</p>
          </div>
        </div>
        <div className="px-4">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Hero Header */}
      <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
        <div className="text-center text-white space-y-3">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
            <h1 className="text-3xl font-bold">{getFirstName()}'s Wardrobe</h1>
            <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
          </div>
          <p className="text-purple-100 text-lg font-medium">Your Fashion Collection</p>
          <p className="text-purple-200 text-sm max-w-xs mx-auto">
            {items.length} beautiful items in your collection ✨
          </p>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-8 right-6 w-3 h-3 bg-pink-300/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-4 left-8 w-2 h-2 bg-yellow-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="px-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search your fashion items..." 
            className="pl-9 border-primary/20 focus:border-primary transition-colors rounded-xl bg-gradient-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-gradient-card h-auto p-1 w-auto shadow-sm border-0">
              {categories.map((category, index) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg transition-all duration-300 data-[state=active]:shadow-md animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shirt className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  {items.length === 0 
                    ? "Your wardrobe is waiting for its first piece!"
                    : "No items match your search criteria."
                  }
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {items.length === 0 ? "Add your first fashion item to get started" : "Try adjusting your search or category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(`/wardrobe/item/${item.id}`)}
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-card rounded-xl overflow-hidden shadow-card group-hover:shadow-elegant transition-all duration-300">
                      <ClothingItem 
                        id={item.id}
                        name={item.name}
                        category={item.category}
                        color={item.color}
                        hex_color={item.hex_color}
                        image={item.image_url || '/placeholder.svg'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 px-4">
        <Button 
          onClick={() => navigate('/wardrobe/add')}
          className="w-full max-w-xs bg-gradient-primary hover:shadow-elegant transition-all duration-300 border-0 shadow-lg"
        >
          <Shirt className="h-4 w-4 mr-2" />
          Add New Fashion Item
        </Button>
      </div>
    </div>
  );
};

export default WardrobePage;
