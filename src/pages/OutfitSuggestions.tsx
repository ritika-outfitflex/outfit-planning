
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOutfitSuggestions } from '@/hooks/useOutfitSuggestions';
import { useToast } from '@/hooks/use-toast';
import { getRandomMessage } from '@/utils/loadingMessages';
import FashionAvatar from '@/components/Fashion/FashionAvatar';

const OutfitSuggestionsPage = () => {
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [season, setSeason] = useState('');
  const [style, setStyle] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');
  
  const navigate = useNavigate();
  const { suggestions, loading, generateSuggestions, saveOutfit } = useOutfitSuggestions();
  const { toast } = useToast();


  const handleGenerateSuggestions = async () => {
    setLoadingMessage(getRandomMessage('outfit'));
    await generateSuggestions({
      occasion: occasion || undefined,
      weather: weather || undefined,
      season: season || undefined,
      style: style || undefined
    });
  };

  const handleSaveOutfit = async (suggestion: any) => {
    try {
      await saveOutfit(suggestion);
      setAvatarMessage("Perfect choice, gorgeous! That outfit is absolutely divine! 👑✨");
      setShowAvatar(true);
      toast({
        title: "Outfit saved!",
        description: "Added to your collection 💅"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save outfit",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-outfit-primary/5 to-outfit-secondary/5 p-4 space-y-6 pb-20">
      <FashionAvatar 
        message={avatarMessage}
        isVisible={showAvatar}
        onClose={() => setShowAvatar(false)}
        autoHide={true}
        duration={3000}
      />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-outfit-primary to-outfit-secondary bg-clip-text text-transparent">
          Outfit Suggestions
        </h1>
        <div className="w-10" />
      </div>

      <Card className="border-0 shadow-elegant backdrop-blur-sm bg-white/80 interactive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Get AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Occasion</label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="workout">Workout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Weather</label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Season</label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="trendy">Trendy</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="bohemian">Bohemian</SelectItem>
                  <SelectItem value="edgy">Edgy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateSuggestions} 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex flex-col items-center space-y-1">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-xs">{loadingMessage}</span>
              </div>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Suggested Outfits</h2>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="border-0 shadow-elegant backdrop-blur-sm bg-white/80 interactive-card animate-fade-in">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                  </div>
                  <Badge variant="secondary">{suggestion.match_score} match</Badge>
                </div>

                <div className="space-y-3 mb-3">
                  <h4 className="text-sm font-medium">Items in this outfit:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestion.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-center">
                        <div className="aspect-square bg-muted rounded-md overflow-hidden mb-1">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {suggestion.footwear && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">Footwear:</h5>
                      <Badge variant="secondary" className="text-xs">{suggestion.footwear}</Badge>
                    </div>
                  )}
                  
                  {suggestion.accessories && (
                    <div className="mt-2">
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">Accessories:</h5>
                      <p className="text-xs text-muted-foreground">{suggestion.accessories}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{suggestion.items.length} items</span>
                  <Badge variant="outline">{suggestion.occasion}</Badge>
                </div>

                <Button 
                  onClick={() => handleSaveOutfit(suggestion)}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save This Outfit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Ready for suggestions?</h3>
            <p className="text-sm text-muted-foreground">
              Set your preferences above and click "Generate Suggestions" to get personalized outfit ideas based on your wardrobe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OutfitSuggestionsPage;
