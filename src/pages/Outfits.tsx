
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Eye, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOutfits } from '@/hooks/useOutfits';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';
import FashionAvatar from '@/components/Fashion/FashionAvatar';

const OutfitsPage = () => {
  const navigate = useNavigate();
  const { outfits, loading } = useOutfits();
  const { getFirstName } = useUserProfile();
  const [showAvatar, setShowAvatar] = React.useState(false);

  React.useEffect(() => {
    // Show avatar when outfits are loaded and user has outfits
    if (!loading && outfits.length > 0) {
      setShowAvatar(true);
    }
  }, [loading, outfits.length]);
  
  const savedOutfits = outfits.filter(outfit => outfit.is_favorite);
  const recentOutfits = outfits.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6 pb-6 animate-fade-in">
        <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
          <div className="text-center text-white space-y-3">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-pink-200 animate-pulse" />
              <h1 className="text-3xl font-bold">{getFirstName()}'s Outfits</h1>
              <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
            </div>
            <p className="text-purple-100 text-lg font-medium">Your Style Combinations</p>
          </div>
        </div>
        <div className="px-4">
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const OutfitCard = ({ outfit }: { outfit: any }) => (
    <Card 
      className="group cursor-pointer hover:shadow-card transition-all duration-300 bg-gradient-card border-0 hover:scale-105"
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
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Hero Header */}
      <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
        <div className="text-center text-white space-y-3">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-pink-200 animate-pulse" />
            <h1 className="text-3xl font-bold">{getFirstName()}'s Outfits</h1>
            <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
          </div>
          <p className="text-purple-100 text-lg font-medium">Your Style Combinations</p>
          <p className="text-purple-200 text-sm max-w-xs mx-auto">
            {outfits.length} amazing outfits created with style ✨
          </p>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-8 right-6 w-3 h-3 bg-pink-300/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-4 left-8 w-2 h-2 bg-yellow-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="px-4 space-y-6">
        <Tabs defaultValue="all">
          <TabsList className="w-full bg-gradient-card border-0 shadow-sm h-auto p-1">
            <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg transition-all duration-300">
              All ({outfits.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg transition-all duration-300">
              Saved ({savedOutfits.length})
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-1 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg transition-all duration-300">
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6 space-y-4">
            {outfits.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  Ready to create your first outfit?
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Combine your wardrobe items into stunning outfits
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {outfits.map((outfit, index) => (
                  <div 
                    key={outfit.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OutfitCard outfit={outfit} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6 space-y-4">
            {savedOutfits.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  No saved outfits yet
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Mark your favorite outfits with a heart
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedOutfits.map((outfit, index) => (
                  <div 
                    key={outfit.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OutfitCard outfit={outfit} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6 space-y-4">
            {recentOutfits.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  No recent outfits to show
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Create some outfits to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOutfits.map((outfit, index) => (
                  <div 
                    key={outfit.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <OutfitCard outfit={outfit} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 px-4">
        <Button 
          onClick={() => navigate('/outfits/create')}
          className="w-full max-w-xs bg-gradient-primary hover:shadow-elegant transition-all duration-300 border-0 shadow-lg"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Create New Outfit
        </Button>
      </div>
      
      {showAvatar && (
        <FashionAvatar
          message={`Your ${outfits.length} outfits are looking fire! 🔥✨`}
          isVisible={showAvatar}
          onClose={() => setShowAvatar(false)}
          autoHide={true}
          duration={3000}
        />
      )}
    </div>
  );
};

export default OutfitsPage;
