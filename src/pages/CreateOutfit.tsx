
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Demo items data (will come from Supabase later)
const DEMO_ITEMS = [
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

const CreateOutfitPage = () => {
  const navigate = useNavigate();
  const [outfitName, setOutfitName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const handleAddItem = (itemId: string) => {
    if (!selectedItems.includes(itemId)) {
      setSelectedItems([...selectedItems, itemId]);
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(id => id !== itemId));
  };

  const handleSave = () => {
    // Will connect to backend later
    console.log({
      name: outfitName,
      items: selectedItems
    });
    
    // Navigate back to the outfits screen after "saving"
    navigate('/outfits');
  };
  
  const selectedItemsData = DEMO_ITEMS.filter(item => selectedItems.includes(item.id));
  
  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Create Outfit</h1>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="outfitName">Outfit Name</Label>
          <Input
            id="outfitName"
            placeholder="E.g., Summer Casual"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Selected Items ({selectedItems.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedItemsData.map(item => (
              <div 
                key={item.id} 
                className="relative"
              >
                <div className="w-20 h-20 overflow-hidden rounded-md">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {selectedItems.length === 0 && (
              <p className="text-sm text-muted-foreground p-2">
                Add items to create your outfit
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="Tops">
        <TabsList className="w-full overflow-x-auto">
          {['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'].map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'].map(category => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid grid-cols-3 gap-4">
              {DEMO_ITEMS
                .filter(item => category === 'All' || item.category === category)
                .map(item => (
                  <div 
                    key={item.id} 
                    className={`border rounded-md overflow-hidden ${selectedItems.includes(item.id) ? 'border-outfit-primary border-2' : ''}`}
                    onClick={() => handleAddItem(item.id)}
                  >
                    <div className="aspect-square w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-xs truncate">
                      {item.name}
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="fixed bottom-20 inset-x-0 p-4 flex justify-center">
        <Button 
          className="w-full max-w-md" 
          disabled={!outfitName || selectedItems.length === 0}
          onClick={handleSave}
        >
          Save Outfit
        </Button>
      </div>
    </div>
  );
};

export default CreateOutfitPage;
