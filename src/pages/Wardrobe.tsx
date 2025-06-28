
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import ClothingItem from '@/components/Wardrobe/ClothingItem';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useClothingItems } from '@/hooks/useClothingItems';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

const WardrobePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { items, loading } = useClothingItems();
  
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-4 pb-6">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold mb-4">Your Wardrobe</h1>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-4">Your Wardrobe</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-transparent h-auto p-0 w-auto">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-outfit-primary data-[state=active]:text-white rounded-full"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {items.length === 0 
                    ? "No items in your wardrobe yet. Add your first item!"
                    : "No items match your search criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 px-4">
                {filteredItems.map(item => (
                  <div key={item.id} onClick={() => navigate(`/wardrobe/item/${item.id}`)}>
                    <ClothingItem 
                      id={item.id}
                      name={item.name}
                      category={item.category}
                      color={item.color}
                      image={item.image_url || '/placeholder.svg'}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-center pt-2">
        <Button onClick={() => navigate('/wardrobe/add')}>+ Add New Item</Button>
      </div>
    </div>
  );
};

export default WardrobePage;
