
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OutfitCard, { OutfitProps } from '@/components/Outfits/OutfitCard';

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
  },
  {
    id: '3',
    name: 'Weekend Brunch',
    items: [
      { id: '301', image: '/placeholder.svg' },
      { id: '302', image: '/placeholder.svg' },
      { id: '303', image: '/placeholder.svg' },
    ],
    saved: true
  },
  {
    id: '4',
    name: 'Night Out',
    items: [
      { id: '401', image: '/placeholder.svg' },
      { id: '402', image: '/placeholder.svg' },
      { id: '403', image: '/placeholder.svg' },
      { id: '404', image: '/placeholder.svg' },
    ]
  }
];

const OutfitsPage = () => {
  return (
    <div className="space-y-4 pb-6">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-4">Your Outfits</h1>
        
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4 px-0">
            <div className="grid gap-4 px-4">
              {DEMO_OUTFITS.map(outfit => (
                <OutfitCard key={outfit.id} {...outfit} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-4 space-y-4 px-0">
            <div className="grid gap-4 px-4">
              {DEMO_OUTFITS.filter(outfit => outfit.saved).map(outfit => (
                <OutfitCard key={outfit.id} {...outfit} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4 space-y-4 px-0">
            <div className="grid gap-4 px-4">
              {DEMO_OUTFITS.slice(0, 2).map(outfit => (
                <OutfitCard key={outfit.id} {...outfit} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-center pt-2">
        <Button>+ Create New Outfit</Button>
      </div>
    </div>
  );
};

export default OutfitsPage;
