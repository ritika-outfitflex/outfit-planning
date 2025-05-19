
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Edit, Heart, Share, Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Demo outfit data (will be fetched from Supabase later)
const DEMO_OUTFIT = {
  id: '1',
  name: 'Summer Casual',
  saved: true,
  notes: 'Perfect for weekend brunches and casual outings',
  createdAt: '2023-05-15',
  timesWorn: 5,
  lastWorn: '2023-06-20',
  season: 'Summer',
  occasion: 'Casual',
  items: [
    { id: '101', name: 'White T-shirt', category: 'Tops', image: '/placeholder.svg' },
    { id: '102', name: 'Blue Jeans', category: 'Bottoms', image: '/placeholder.svg' },
    { id: '103', name: 'Sneakers', category: 'Shoes', image: '/placeholder.svg' },
    { id: '104', name: 'Silver Necklace', category: 'Accessories', image: '/placeholder.svg' },
  ]
};

const OutfitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In reality, this would fetch the outfit by ID from the database
  const outfit = DEMO_OUTFIT;
  
  const [isSaved, setIsSaved] = React.useState(outfit.saved);

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Outfit Details</h1>
        <Button variant="ghost" size="icon">
          <Edit className="h-5 w-5" />
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold">{outfit.name}</h2>
        <div className="flex items-center space-x-2 mt-1">
          <Badge>{outfit.season}</Badge>
          <Badge variant="outline">{outfit.occasion}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {outfit.items.map(item => (
          <div 
            key={item.id} 
            className="border rounded-md overflow-hidden"
            onClick={() => navigate(`/wardrobe/item/${item.id}`)}
          >
            <div className="aspect-square w-full overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-xs">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-muted-foreground">{item.category}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
          <p>{outfit.notes}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Date Created</h3>
            <p>{outfit.createdAt}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Times Worn</h3>
            <p>{outfit.timesWorn}</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Last Worn</h3>
          <p>{outfit.lastWorn}</p>
        </div>
      </div>

      <div className="fixed bottom-20 inset-x-0 p-4 flex justify-center gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setIsSaved(!isSaved)} 
        >
          <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-outfit-primary text-outfit-primary' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </Button>
        
        <Button variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-2" />
          Wear Today
        </Button>
        
        <Button variant="outline" className="flex-1">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default OutfitDetailPage;
