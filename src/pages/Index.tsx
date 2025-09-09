import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shirt, Plus, Sparkles, TrendingUp, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';
import { useUserProfile } from '@/hooks/useUserProfile';
import WelcomeCharacter from '@/components/Fashion/WelcomeCharacter';

const Index = () => {
  const navigate = useNavigate();
  const { items } = useClothingItems();
  const { outfits } = useOutfits();
  const { getFirstName } = useUserProfile();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  const recentItems = items.slice(0, 4);
  const recentOutfits = outfits.slice(0, 3);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedOutfitFlex');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedOutfitFlex', 'true');
    } else {
      setShowWelcome(false);
    }
  }, []);

  return (
    <>
      {isFirstVisit && showWelcome && (
        <WelcomeCharacter onClose={() => setShowWelcome(false)} />
      )}
      
      <div className="space-y-6 pb-6 animate-fade-in">
        {/* Hero Header */}
        <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
          <div className="text-center text-white space-y-3">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
              <h1 className="text-3xl font-bold">OutfitFlex</h1>
              <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
            </div>
            <p className="text-purple-100 text-lg font-medium">Your Personal Style Companion</p>
            <p className="text-purple-200 text-sm max-w-xs mx-auto">
              Hey {getFirstName()}! Discover perfect outfits with AI-powered styling magic ✨
            </p>
          </div>
          
          {/* Floating decorative elements */}
          <div className="absolute top-4 left-4 w-4 h-4 bg-white/20 rounded-full animate-float" />
          <div className="absolute top-8 right-6 w-3 h-3 bg-pink-300/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 left-8 w-2 h-2 bg-yellow-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="px-4 space-y-6">
          {/* Main Action Card */}
          <Card className="relative overflow-hidden bg-gradient-primary text-white shadow-glow border-0 group hover:shadow-elegant transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold">Get Daily Outfit Ideas</h2>
                  <p className="text-purple-100 text-sm">AI-powered suggestions tailored just for you</p>
                  <Button 
                    onClick={() => navigate('/outfits/suggestions')}
                    className="bg-white/20 text-white border border-white/30 hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-lg backdrop-blur-sm"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Style Me Now
                  </Button>
                </div>
                <div className="relative">
                  <Sparkles className="h-16 w-16 opacity-60 group-hover:animate-pulse" />
                  <div className="absolute inset-0 bg-shimmer bg-[length:200%_100%] animate-shimmer opacity-30" />
                </div>
              </div>
              
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="group hover:shadow-card transition-all duration-300 bg-gradient-card border-0 hover:scale-105 cursor-pointer" onClick={() => navigate('/wardrobe')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Shirt className="h-5 w-5" />
                  </div>
                  Wardrobe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{items.length}</p>
                <p className="text-sm text-muted-foreground">Fashion Items</p>
                <div className="h-1 w-full bg-gradient-primary rounded-full opacity-30" />
              </CardContent>
            </Card>

            <Card className="group hover:shadow-card transition-all duration-300 bg-gradient-card border-0 hover:scale-105 cursor-pointer" onClick={() => navigate('/outfits')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-secondary">
                  <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  Outfits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{outfits.length}</p>
                <p className="text-sm text-muted-foreground">Style Combos</p>
                <div className="h-1 w-full bg-gradient-secondary rounded-full opacity-30" />
              </CardContent>
            </Card>
          </div>

          {recentItems.length > 0 && (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse" />
                  Recent Additions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {recentItems.map((item, index) => (
                    <div 
                      key={item.id}
                      className="group cursor-pointer hover:scale-105 transition-all duration-300"
                      onClick={() => navigate(`/wardrobe/item/${item.id}`)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow relative">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-secondary/10">
                            <div 
                              className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
                              style={{ backgroundColor: item.hex_color || item.color }}
                            />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {recentOutfits.length > 0 && (
            <Card className="bg-gradient-card border-0 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-secondary rounded-full animate-pulse" />
                  Latest Style Combos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOutfits.map((outfit, index) => (
                    <div 
                      key={outfit.id}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 cursor-pointer transition-all duration-300 hover:shadow-sm animate-slide-up"
                      onClick={() => navigate(`/outfits/detail/${outfit.id}`)}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex -space-x-3">
                        {outfit.items?.slice(0, 3).map((item, itemIndex) => (
                          <div
                            key={item.id}
                            className="w-10 h-10 rounded-full border-3 border-white bg-muted overflow-hidden shadow-md group-hover:scale-110 transition-transform"
                            style={{ 
                              zIndex: 10 - itemIndex,
                              animationDelay: `${itemIndex * 100}ms`
                            }}
                          >
                            {item.clothing_item?.image_url ? (
                              <img
                                src={item.clothing_item.image_url}
                                alt={item.clothing_item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div 
                                className="w-full h-full bg-gradient-primary/20"
                                style={{ backgroundColor: item.clothing_item?.color || '#e5e7eb' }}
                              />
                            )}
                          </div>
                        ))}
                        {(outfit.items?.length || 0) > 3 && (
                          <div className="w-10 h-10 rounded-full border-3 border-white bg-gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md">
                            +{(outfit.items?.length || 0) - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{outfit.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {outfit.items?.length || 0} pieces • Perfect match
                        </p>
                      </div>
                      <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 px-4 pt-4">
          <Button 
            onClick={() => navigate('/wardrobe/add')}
            className="flex-1 bg-gradient-primary hover:shadow-elegant transition-all duration-300 border-0 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/outfits/suggestions')}
            className="flex-1 border-2 border-primary/30 hover:bg-primary hover:text-white transition-all duration-300"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Style Me
          </Button>
        </div>
      </div>
    </>
  );
};

export default Index;
