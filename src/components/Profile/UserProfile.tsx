
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, LogOut, Sparkles, Heart, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import EditProfileDialog from './EditProfileDialog';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { items } = useClothingItems();
  const { outfits } = useOutfits();
  const { profile, getDisplayName, getFirstName } = useUserProfile();
  const { toast } = useToast();

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
                <div className="h-1 w-full bg-gradient-primary rounded-full opacity-30" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <EditProfileDialog>
            <Button className="w-full bg-gradient-primary hover:shadow-elegant transition-all duration-300 border-0 shadow-lg">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </EditProfileDialog>
          
          <Button 
            className="w-full border-2 border-primary/30 hover:bg-primary hover:text-white transition-all duration-300"
            variant="outline"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
