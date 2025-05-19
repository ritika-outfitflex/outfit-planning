
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import ClothingItem, { ClothingItemProps } from '@/components/Wardrobe/ClothingItem';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Demo data
const DEMO_ITEMS: ClothingItemProps[] = [
  {
    id: '1',
    name: 'White T-shirt',
    category: 'Tops',
    color: '#FFFFFF',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Blue Jeans',
    category: 'Bottoms',
    color: '#3B5998',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Black Dress',
    category: 'Dresses',
    color: '#000000',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Sneakers',
    category: 'Shoes',
    color: '#FF5733',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Silver Necklace',
    category: 'Accessories',
    color: '#C0C0C0',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Denim Jacket',
    category: 'Tops',
    color: '#6699CC',
    image: '/placeholder.svg'
  }
];

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

const WardrobePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  
  const filteredItems = activeCategory === 'All' 
    ? DEMO_ITEMS 
    : DEMO_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-4 pb-6">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-4">Your Wardrobe</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..." 
            className="pl-9"
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
            <div className="grid grid-cols-2 gap-4 px-4">
              {filteredItems.map(item => (
                <div key={item.id} onClick={() => navigate(`/wardrobe/item/${item.id}`)}>
                  <ClothingItem {...item} />
                </div>
              ))}
            </div>
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
