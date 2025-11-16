
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, LogOut, Sparkles, Heart, Star, Palette, Calendar, Target, User, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EditProfileDialog from './EditProfileDialog';
import MultiSelect from '@/components/MultiSelect';

interface StylePreferences {
  favorite_colors: string[];
  favorite_styles: string[];
  occasions: string[];
  body_type: string;
  style_goals: string;
}

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { items } = useClothingItems();
  const { outfits } = useOutfits();
  const { profile, getDisplayName, getFirstName } = useUserProfile();
  const { toast } = useToast();
  
  const [stylePrefs, setStylePrefs] = useState<StylePreferences>({
    favorite_colors: [],
    favorite_styles: [],
    occasions: [],
    body_type: '',
    style_goals: ''
  });
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadStylePreferences();
    }
  }, [user]);

  const loadStylePreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('style_preferences')
        .eq('id', user?.id)
        .single();

      if (data?.style_preferences && typeof data.style_preferences === 'object') {
        const prefs = data.style_preferences as Record<string, any>;
        setStylePrefs({
          favorite_colors: Array.isArray(prefs.favorite_colors) ? prefs.favorite_colors : [],
          favorite_styles: Array.isArray(prefs.favorite_styles) ? prefs.favorite_styles : [],
          occasions: Array.isArray(prefs.occasions) ? prefs.occasions : [],
          body_type: typeof prefs.body_type === 'string' ? prefs.body_type : '',
          style_goals: typeof prefs.style_goals === 'string' ? prefs.style_goals : ''
        });
      }
    } catch (error) {
      console.error('Error loading style preferences:', error);
    }
  };

  const saveStylePreferences = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ style_preferences: stylePrefs as any })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your style preferences have been updated successfully.",
      });
      setIsEditingPrefs(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const favoriteItems = items.filter(item => item.is_favorite).length;

  const colorOptions = [
    'Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown', 
    'Red', 'Pink', 'Purple', 'Blue', 'Green', 'Yellow', 'Orange'
  ];

  const styleOptions = [
    'Casual', 'Formal', 'Business', 'Sporty', 'Bohemian',
    'Minimalist', 'Vintage', 'Streetwear', 'Elegant', 'Trendy'
  ];

  const occasionOptions = [
    'Work', 'Casual Outings', 'Date Night', 'Gym/Sports',
    'Parties', 'Formal Events', 'Travel', 'Home/Relaxing'
  ];

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Hero Header */}
      <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
        <div className="text-center text-white space-y-3">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
            <h1 className="text-3xl font-bold">Hey {getFirstName()}!</h1>
            <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
          </div>
          <p className="text-purple-100 text-lg font-medium">Your Style Profile</p>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-8 right-6 w-3 h-3 bg-pink-300/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-4 left-8 w-2 h-2 bg-yellow-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="px-4 space-y-6">
        {/* Profile Card */}
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                <AvatarImage src={profile?.avatar_url || ""} alt="User" />
                <AvatarFallback className="bg-gradient-primary text-white text-lg font-bold">
                  {getDisplayName().split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-xl text-foreground">{getDisplayName()}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-2">
                <span className="text-xs bg-gradient-primary text-white px-2 py-1 rounded-full">
                  Style Enthusiast
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse" />
            Your Fashion Stats
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className="group hover:shadow-card transition-all duration-300 bg-gradient-card border-0 hover:scale-105">
              <CardContent className="p-4 text-center space-y-2">
                <h4 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{items.length}</h4>
                <p className="text-xs text-muted-foreground font-medium">Fashion Items</p>
                <div className="h-1 w-full bg-gradient-primary rounded-full opacity-30" />
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-card transition-all duration-300 bg-gradient-card border-0 hover:scale-105">
              <CardContent className="p-4 text-center space-y-2">
                <h4 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{outfits.length}</h4>
                <p className="text-xs text-muted-foreground font-medium">Style Combos</p>
                <div className="h-1 w-full bg-gradient-secondary rounded-full opacity-30" />
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-card transition-all duration-300 bg-gradient-card border-0 hover:scale-105">
              <CardContent className="p-4 text-center space-y-2">
                <h4 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{favoriteItems}</h4>
                <p className="text-xs text-muted-foreground font-medium">Favorites</p>
                <div className="h-1 w-full bg-gradient-accent rounded-full opacity-30" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Style Preferences Section */}
        <Card className="bg-gradient-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Style Preferences
              </span>
              {!isEditingPrefs && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPrefs(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingPrefs ? (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Favorite Colors
                  </Label>
                  <MultiSelect
                    options={colorOptions}
                    selected={stylePrefs.favorite_colors}
                    onChange={(colors) => setStylePrefs({ ...stylePrefs, favorite_colors: colors })}
                    placeholder="Select your favorite colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Preferred Styles
                  </Label>
                  <MultiSelect
                    options={styleOptions}
                    selected={stylePrefs.favorite_styles}
                    onChange={(styles) => setStylePrefs({ ...stylePrefs, favorite_styles: styles })}
                    placeholder="Select your style preferences"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Common Occasions
                  </Label>
                  <MultiSelect
                    options={occasionOptions}
                    selected={stylePrefs.occasions}
                    onChange={(occasions) => setStylePrefs({ ...stylePrefs, occasions })}
                    placeholder="Select occasions you dress for"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Body Type
                  </Label>
                  <Input
                    placeholder="e.g., Petite, Athletic, Curvy..."
                    value={stylePrefs.body_type}
                    onChange={(e) => setStylePrefs({ ...stylePrefs, body_type: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Style Goals
                  </Label>
                  <Textarea
                    placeholder="What are your fashion goals? e.g., Build a capsule wardrobe, dress more professionally..."
                    value={stylePrefs.style_goals}
                    onChange={(e) => setStylePrefs({ ...stylePrefs, style_goals: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={saveStylePreferences} 
                    disabled={loading}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingPrefs(false);
                      loadStylePreferences();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {stylePrefs.favorite_colors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Favorite Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {stylePrefs.favorite_colors.map(color => (
                        <span key={color} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {stylePrefs.favorite_styles.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Style Preferences</p>
                    <div className="flex flex-wrap gap-2">
                      {stylePrefs.favorite_styles.map(style => (
                        <span key={style} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-full">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {stylePrefs.occasions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Common Occasions</p>
                    <div className="flex flex-wrap gap-2">
                      {stylePrefs.occasions.map(occasion => (
                        <span key={occasion} className="text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-full">
                          {occasion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {stylePrefs.body_type && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Body Type</p>
                    <p className="text-sm">{stylePrefs.body_type}</p>
                  </div>
                )}
                {stylePrefs.style_goals && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Style Goals</p>
                    <p className="text-sm">{stylePrefs.style_goals}</p>
                  </div>
                )}
                {!stylePrefs.favorite_colors.length && !stylePrefs.favorite_styles.length && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Add your style preferences to get more personalized outfit suggestions
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <EditProfileDialog>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </EditProfileDialog>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
