
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOutfitSuggestions } from '@/hooks/useOutfitSuggestions';
import { useToast } from '@/hooks/use-toast';

const OutfitSuggestionsPage = () => {
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [season, setSeason] = useState('');
  const [style, setStyle] = useState('');
  
  const navigate = useNavigate();
  const { suggestions, loading, generateSuggestions, saveOutfit } = useOutfitSuggestions();
  const { toast } = useToast();

  // Auto-detect current season
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    let currentSeason = '';
    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'fall';
    else currentSeason = 'winter';
    
    setSeason(currentSeason);
  }, []);

  const handleGenerateSuggestions = async () => {
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
      toast({
        title: "Outfit saved!",
        description: "The suggested outfit has been added to your collection."
      });
    } catch (error) {
      toast({
        title: "Error saving outfit",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Outfit Suggestions</h1>
        <div className="w-10" />
      </div>

      <Card>
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
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
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
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{suggestion.name}</h3>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                  <Badge variant="secondary">{suggestion.confidence}% match</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  {suggestion.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="aspect-square bg-muted rounded-md overflow-hidden">
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
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{suggestion.items.length} items</span>
                  <Badge variant="outline">{suggestion.occasion}</Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  {suggestion.reasoning}
                </p>

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
