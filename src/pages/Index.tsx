import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shirt, Plus, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';

const Index = () => {
  const navigate = useNavigate();
  const { items } = useClothingItems();
  const { outfits } = useOutfits();

  const recentItems = items.slice(0, 4);
  const recentOutfits = outfits.slice(0, 3);

  return (
    <div className="space-y-6 pb-6">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to OutfitFlex</h1>
        <p className="text-muted-foreground">Organize your wardrobe and get AI-powered outfit suggestions</p>
      </div>

      <div className="px-4 space-y-4">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Get Daily Outfit Ideas</h2>
                <p className="text-purple-100 mb-4">AI-powered suggestions based on your wardrobe</p>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/outfits/suggestions')}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Suggestions
                </Button>
              </div>
              <Sparkles className="h-12 w-12 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shirt className="h-5 w-5" />
                Wardrobe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-sm text-muted-foreground">Items</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => navigate('/wardrobe')}
              >
                View All
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Outfits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{outfits.length}</p>
              <p className="text-sm text-muted-foreground">Created</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 w-full"
                onClick={() => navigate('/outfits')}
              >
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        {recentItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {recentItems.map(item => (
                  <div 
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/wardrobe/item/${item.id}`)}
                  >
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: item.hex_color || item.color }}
                          />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recentOutfits.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Outfits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOutfits.map(outfit => (
                  <div 
                    key={outfit.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => navigate(`/outfits/detail/${outfit.id}`)}
                  >
                    <div className="flex -space-x-2">
                      {outfit.items?.slice(0, 3).map((item, index) => (
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
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{outfit.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {outfit.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Button onClick={() => navigate('/wardrobe/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        <Button variant="outline" onClick={() => navigate('/outfits/suggestions')}>
          <Sparkles className="h-4 w-4 mr-2" />
          Get Suggestions
        </Button>
      </div>
    </div>
  );
};

export default Index;
