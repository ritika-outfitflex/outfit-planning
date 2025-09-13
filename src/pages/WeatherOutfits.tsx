import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudSun, Save, RefreshCw, ArrowLeft, MapPin, Thermometer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOutfitSuggestions } from '@/hooks/useOutfitSuggestions';
import { useToast } from '@/hooks/use-toast';
import { getRandomMessage } from '@/utils/loadingMessages';
import FashionAvatar from '@/components/Fashion/FashionAvatar';

interface WeatherData {
  temperature: number;
  description: string;
  condition: string;
  location: string;
}

const WeatherOutfitsPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');
  
  const navigate = useNavigate();
  const { suggestions, loading: suggestionsLoading, generateSuggestions, saveOutfit } = useOutfitSuggestions();
  const { toast } = useToast();

  const getWeatherCondition = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return 'rainy';
    if (desc.includes('cloud')) return 'cloudy';
    if (desc.includes('clear') || desc.includes('sun')) return 'sunny';
    if (desc.includes('snow')) return 'cold';
    return 'cloudy';
  };

  const getTemperatureCategory = (temp: number): string => {
    if (temp < 10) return 'cold';
    if (temp > 25) return 'hot';
    return 'mild';
  };

  const fetchWeatherData = async () => {
    setLoadingWeather(true);
    try {
      // Get user location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Call our Supabase edge function for weather
      const response = await fetch('https://kicpepyarfiorraejwqh.functions.supabase.co/functions/v1/weather-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude })
      });
      
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        throw new Error('Weather API failed');
      }
    } catch (error) {
      // Fallback to mock data
      setWeatherData({
        temperature: 22,
        description: 'partly cloudy',
        condition: 'cloudy',
        location: 'Current Location'
      });
      toast({
        title: "Using demo weather",
        description: "Unable to fetch real weather data. Using sample data for demonstration.",
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleGenerateWeatherSuggestions = async () => {
    if (!weatherData) return;
    
    setLoading(true);
    setLoadingMessage(getRandomMessage('weather'));
    const currentSeason = getCurrentSeason();
    
    await generateSuggestions({
      weather: weatherData.condition,
      season: currentSeason,
      occasion: 'casual' // Default to casual for weather-based suggestions
    });
    setLoading(false);
  };

  const getCurrentSeason = (): string => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) return 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) return 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) return 'fall';
    else return 'winter';
  };

  const handleSaveOutfit = async (suggestion: any) => {
    try {
      await saveOutfit(suggestion);
      setAvatarMessage("Yass! That outfit is now in your collection, bestie! 💖✨");
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
          Weather Outfits
        </h1>
        <div className="w-10" />
      </div>

      {/* Weather Card */}
      <Card className="border-0 shadow-elegant backdrop-blur-sm bg-white/80 interactive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5 text-outfit-primary" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingWeather ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <RefreshCw className="h-6 w-6 animate-spin text-outfit-primary" />
              <p className="text-sm text-outfit-primary animate-pulse">{getRandomMessage('general')}</p>
            </div>
          ) : weatherData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{weatherData.location}</span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {weatherData.condition}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-outfit-accent" />
                  <span className="text-2xl font-bold text-outfit-primary">
                    {weatherData.temperature}°C
                  </span>
                </div>
                <span className="text-muted-foreground capitalize">
                  {weatherData.description}
                </span>
              </div>

              <Button 
                onClick={handleGenerateWeatherSuggestions} 
                className="w-full interactive-card"
                disabled={loading || suggestionsLoading}
              >
                {loading || suggestionsLoading ? (
                  <div className="flex flex-col items-center space-y-1">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-xs">{loadingMessage}</span>
                  </div>
                ) : (
                  <>
                    <CloudSun className="h-4 w-4 mr-2" />
                    Get Weather-Based Outfits
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Button onClick={fetchWeatherData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Weather Fetch
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-outfit-primary to-outfit-secondary bg-clip-text text-transparent">
            Weather-Perfect Outfits
          </h2>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="border-0 shadow-elegant backdrop-blur-sm bg-white/80 interactive-card animate-fade-in">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-outfit-dark">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                  </div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-outfit-primary to-outfit-secondary text-white border-0">
                    {suggestion.match_score} match
                  </Badge>
                </div>

                <div className="space-y-3 mb-3">
                  <h4 className="text-sm font-medium">Perfect for this weather:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {suggestion.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-center">
                        <div className="aspect-square bg-gradient-to-br from-outfit-primary/5 to-outfit-secondary/5 rounded-xl overflow-hidden mb-1 border border-outfit-primary/10">
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
                        <Badge variant="outline" className="text-xs border-outfit-primary/20">
                          {item.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {suggestion.footwear && (
                    <div className="mt-3">
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">Recommended Footwear:</h5>
                      <Badge variant="secondary" className="text-xs">{suggestion.footwear}</Badge>
                    </div>
                  )}
                  
                  {suggestion.accessories && (
                    <div className="mt-2">
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">Weather Accessories:</h5>
                      <p className="text-xs text-muted-foreground">{suggestion.accessories}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>{suggestion.items.length} items</span>
                  <Badge variant="outline" className="border-outfit-primary/20">
                    {weatherData?.condition} ready
                  </Badge>
                </div>

                <Button 
                  onClick={() => handleSaveOutfit(suggestion)}
                  variant="outline"
                  className="w-full border-outfit-primary/20 hover:bg-gradient-to-r hover:from-outfit-primary hover:to-outfit-secondary hover:text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Weather Outfit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !suggestionsLoading && suggestions.length === 0 && weatherData && (
        <Card className="border-0 shadow-elegant backdrop-blur-sm bg-white/80">
          <CardContent className="p-8 text-center">
            <CloudSun className="h-12 w-12 mx-auto mb-4 text-outfit-primary" />
            <h3 className="font-medium mb-2 text-outfit-dark">Ready for weather-perfect outfits?</h3>
            <p className="text-sm text-muted-foreground">
              Click "Get Weather-Based Outfits" to receive personalized suggestions based on current weather conditions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherOutfitsPage;