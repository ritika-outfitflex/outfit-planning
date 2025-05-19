
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import OutfitCard, { OutfitProps } from '@/components/Outfits/OutfitCard';
import { useNavigate } from 'react-router-dom';

const DEMO_OUTFITS: OutfitProps[] = [
  {
    id: '1',
    name: 'Summer Casual',
    items: [
      { id: '101', image: '/placeholder.svg' },
      { id: '102', image: '/placeholder.svg' },
      { id: '103', image: '/placeholder.svg' },
      { id: '104', image: '/placeholder.svg' },
    ],
    saved: true
  },
  {
    id: '2',
    name: 'Office Look',
    items: [
      { id: '201', image: '/placeholder.svg' },
      { id: '202', image: '/placeholder.svg' },
      { id: '203', image: '/placeholder.svg' },
    ]
  }
];

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-6">
        <h1 className="text-2xl font-bold">OutfitFlex</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/wardrobe/add')}
        >
          + Add Item
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className="px-4">
        <Card className="bg-gradient-to-r from-outfit-primary to-outfit-secondary">
          <CardContent className="p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Create Your Next Look</h2>
            <p className="text-sm mb-4 opacity-90">Mix and match items from your wardrobe</p>
            <Button 
              variant="secondary" 
              className="bg-white text-outfit-secondary hover:bg-gray-100"
              onClick={() => navigate('/outfits/create')}
            >
              Create Outfit
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Categories */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-medium">Categories</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => navigate('/wardrobe')}
          >
            View All
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'].map((category) => (
            <div 
              key={category} 
              className="flex-shrink-0 px-4 py-2 bg-accent rounded-full text-sm cursor-pointer"
              onClick={() => navigate('/wardrobe')}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Outfits */}
      <div>
        <div className="flex justify-between items-center px-4 mb-2">
          <h2 className="font-medium">Recent Outfits</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => navigate('/outfits')}
          >
            See All
          </Button>
        </div>
        <div className="px-4 grid gap-4">
          {DEMO_OUTFITS.map(outfit => (
            <div key={outfit.id} onClick={() => navigate(`/outfits/detail/${outfit.id}`)}>
              <OutfitCard {...outfit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
