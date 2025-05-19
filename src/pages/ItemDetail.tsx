
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock item data (will be fetched from Supabase later)
const DEMO_ITEM = {
  id: '1',
  name: 'White T-shirt',
  category: 'Tops',
  color: '#FFFFFF',
  image: '/placeholder.svg',
  notes: 'Cotton material, great for casual wear',
  dateAdded: '2023-05-10',
  timesWorn: 12,
  lastWorn: '2023-06-15'
};

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In reality, this would fetch the item by ID from the database
  const item = DEMO_ITEM;

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Item Details</h1>
        <Button variant="ghost" size="icon">
          <Edit className="h-5 w-5" />
        </Button>
      </div>

      <div className="aspect-square w-full overflow-hidden bg-muted rounded-md">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold">{item.name}</h2>
        <div className="flex items-center space-x-2 mt-1">
          <Badge>{item.category}</Badge>
          <div 
            className="w-4 h-4 rounded-full border" 
            style={{ backgroundColor: item.color }}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
          <p>{item.notes}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date Added</h3>
            <p>{item.dateAdded}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Times Worn</h3>
            <p>{item.timesWorn}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Last Worn</h3>
          <p>{item.lastWorn}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Used in Outfits</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Summer Casual', 'Work Basics', 'Weekend'].map((outfit) => (
            <div 
              key={outfit} 
              className="p-2 text-center border rounded-md text-xs hover:bg-accent cursor-pointer"
              onClick={() => navigate(`/outfits/detail/1`)}
            >
              {outfit}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 p-4 flex justify-center">
        <Button variant="destructive" className="w-full max-w-md flex items-center">
          <Trash className="h-4 w-4 mr-2" />
          Remove from Wardrobe
        </Button>
      </div>
    </div>
  );
};

export default ItemDetailPage;
