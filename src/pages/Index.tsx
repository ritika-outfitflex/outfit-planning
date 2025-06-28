
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClothingItems } from '@/hooks/useClothingItems';
import AIFashionAssistant from '@/components/AIFashionAssistant';
import { Sparkles, Shirt, Eye } from 'lucide-react';

const IndexPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items } = useClothingItems();

  const recentItems = items.slice(0, 6);
  const totalOutfits = Math.floor(items.length / 3); // Mock calculation

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground text-sm">
            {user?.email}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/wardrobe/add')}
        >
          + Add Item
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-4">
        <Card>
          <CardContent className="p-3 text-center">
            <Shirt className="h-6 w-6 mx-auto mb-1 text-outfit-primary" />
            <h4 className="text-lg font-semibold">{items.length}</h4>
            <p className="text-xs text-muted-foreground">Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Eye className="h-6 w-6 mx-auto mb-1 text-outfit-primary" />
            <h4 className="text-lg font-semibold">{totalOutfits}</h4>
            <p className="text-xs text-muted-foreground">Outfits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Sparkles className="h-6 w-6 mx-auto mb-1 text-outfit-primary" />
            <h4 className="text-lg font-semibold">AI</h4>
            <p className="text-xs text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Fashion Assistant */}
      <div className="px-4">
        <AIFashionAssistant />
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
      
      {/* Recent Items */}
      {recentItems.length > 0 && (
        <div className="px-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium">Recent Items</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => navigate('/wardrobe')}
            >
              See All
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {recentItems.map((item) => (
              <div 
                key={item.id}
                className="aspect-square bg-muted rounded-md overflow-hidden cursor-pointer"
                onClick={() => navigate(`/wardrobe/item/${item.id}`)}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Shirt className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
