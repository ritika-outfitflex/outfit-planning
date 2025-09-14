
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export interface ClothingItemProps {
  id: string;
  name: string;
  category: string;
  color: string;
  hex_color: string;
  image: string;
}

const ClothingItem: React.FC<ClothingItemProps> = ({ name, category, color, hex_color, image }) => {
  return (
    <Card className="overflow-hidden h-full animate-fade-in card-3d depth-shadow">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-1">{name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">{category}</span>
            <div 
              className="w-4 h-4 rounded-full border border-border shadow-sm" 
              style={{ backgroundColor: hex_color || color }}
              aria-label={`Color: ${color}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClothingItem;
