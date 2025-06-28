
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOutfits } from '@/hooks/useOutfits';
import { Skeleton } from '@/components/ui/skeleton';

const OutfitsPage = () => {
  const navigate = useNavigate();
  const { outfits, loading } = useOutfits();
  
  const savedOutfits = outfits.filter(outfit => outfit.is_favorite);
  const recentOutfits = outfits.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-4 pb-6">
        <div className="px-4 pt-6">
          <h1 className="text-2xl font-bold mb-4">Your Outfits</h1>
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const OutfitCard = ({ outfit }: { outfit: any }) => (
    <Card 
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={() => navigate(`/outfits/detail/${outfit.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold">{outfit.name}</h3>
            {outfit.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {outfit.description}
              </p>
            )}
          </div>
          {outfit.is_favorite && (
            <Heart className="h-4 w-4 fill-red-500 text-red-500 ml-2" />
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{outfit.items?.length || 0} items</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {outfit.times_worn}
            </span>
          </div>
          <span>{new Date(outfit.created_at).toLocaleDateString()}</span>
        </div>

        {outfit.items && outfit.items.length > 0 && (
          <div className="flex -space-x-2 mt-3">
            {outfit.items.slice(0, 4).map((item: any, index: number) => (
              <div
                key={item.id}
                className="w-8 h-8 rounded-full border-2 border-white bg-muted overflow-hidden"
                style={{ zIndex: 10 - index }}
              >
                {item.clothing_item?.image_url ? (
                  <img
                    src={item.clothing_item.image_url}
                    alt={item.clothing_item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ backgroundColor: item.clothing_item?.color || '#ccc' }}
                  />
                )}
              </div>
            ))}
            {outfit.items.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center text-xs font-medium">
                +{outfit.items.length - 4}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 pb-6">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-4">Your Outfits</h1>
        
        <Tabs defaultValue="all">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All ({outfits.length})</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved ({savedOutfits.length})</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4 px-0">
            <div className="space-y-4 px-4">
              {outfits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No outfits created yet. Create your first outfit!
                  </p>
                </div>
              ) : (
                outfits.map(outfit => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-4 space-y-4 px-0">
            <div className="space-y-4 px-4">
              {savedOutfits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No saved outfits yet. Mark outfits as favorites!
                  </p>
                </div>
              ) : (
                savedOutfits.map(outfit => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4 space-y-4 px-0">
            <div className="space-y-4 px-4">
              {recentOutfits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No recent outfits to show.
                  </p>
                </div>
              ) : (
                recentOutfits.map(outfit => (
                  <OutfitCard key={outfit.id} outfit={outfit} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-center pt-2">
        <Button onClick={() => navigate('/outfits/create')}>+ Create New Outfit</Button>
      </div>
    </div>
  );
};

export default OutfitsPage;
