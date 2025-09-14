
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from 'lucide-react';

export interface OutfitProps {
  id: string;
  name: string;
  items: Array<{
    id: string;
    image: string;
  }>;
  saved?: boolean;
}

const OutfitCard: React.FC<OutfitProps> = ({ name, items, saved = false }) => {
  return (
    <Card className="overflow-hidden animate-slide-up card-3d depth-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{name}</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 transition-transform">
            <Bookmark 
              className={`h-5 w-5 transition-colors ${saved ? 'fill-outfit-primary text-outfit-primary' : ''}`} 
            />
            <span className="sr-only">Save outfit</span>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {items.slice(0, 4).map((item, index) => (
            <div 
              key={item.id} 
              className="aspect-square bg-muted rounded-md overflow-hidden transform hover:scale-105 transition-transform duration-200"
            >
              <img
                src={item.image}
                alt={`Item ${index + 1} in outfit ${name}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <span className="text-xs text-muted-foreground">{items.length} items</span>
        <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">View</Button>
      </CardFooter>
    </Card>
  );
};

export default OutfitCard;
