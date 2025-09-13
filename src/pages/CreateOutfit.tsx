
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check } from 'lucide-react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';
import { useToast } from '@/hooks/use-toast';
import { getRandomMessage } from '@/utils/loadingMessages';
import FashionAvatar from '@/components/Fashion/FashionAvatar';

const CreateOutfitPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [season, setSeason] = useState('');
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');
  
  const navigate = useNavigate();
  const { items } = useClothingItems();
  const { createOutfit } = useOutfits();
  const { toast } = useToast();

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const generateAIDescriptions = async (selectedItemsData: any[]) => {
    try {
      const response = await fetch('https://kicpepyarfiorraejwqh.functions.supabase.co/functions/v1/outfit-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedItemsData,
          occasion,
          weather,
          season
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.error('Error generating AI descriptions:', error);
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your outfit.",
        variant: "destructive"
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast({
        title: "Select items",
        description: "Please select at least one item for your outfit.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setLoadingMessage(getRandomMessage('outfit'));
    
    try {
      // Get selected items data for AI
      const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
      
      // Generate AI description and alternatives
      const aiResult = await generateAIDescriptions(selectedItemsData);
      
      // Create main outfit
      const mainDescription = description.trim() || aiResult?.mainDescription || undefined;
      await createOutfit({
        name: name.trim(),
        description: mainDescription,
        season: season || undefined,
        occasion: occasion || undefined,
        weather: weather || undefined,
        itemIds: selectedItems
      });

      // Create alternative outfits if suggested by AI
      if (aiResult?.alternatives && aiResult.alternatives.length > 0) {
        for (const alt of aiResult.alternatives) {
          // Find matching items for the alternative
          const altItemIds = alt.items.map((itemName: string) => {
            const foundItem = selectedItemsData.find(item => 
              item.name.toLowerCase().includes(itemName.toLowerCase()) ||
              itemName.toLowerCase().includes(item.name.toLowerCase())
            );
            return foundItem?.id;
          }).filter(Boolean);

          if (altItemIds.length > 0) {
            await createOutfit({
              name: `${name.trim()} - ${alt.name}`,
              description: alt.description,
              season: season || undefined,
              occasion: occasion || undefined,
              weather: weather || undefined,
              itemIds: altItemIds
            });
          }
        }
      }

      // Show success message with avatar
      setAvatarMessage(aiResult?.alternatives?.length > 0 
        ? `Stunning! I created ${1 + aiResult.alternatives.length} outfit variations for you! 💅✨`
        : "Gorgeous outfit created, bestie! You're gonna look amazing! 😍✨"
      );
      setShowAvatar(true);

      toast({
        title: "Outfit created!",
        description: aiResult?.alternatives?.length > 0 
          ? `Created ${1 + aiResult.alternatives.length} outfit variations!`
          : "Your new outfit has been saved to your collection."
      });

      setTimeout(() => {
        navigate('/outfits');
      }, 2000);
    } catch (error) {
      console.error('Error creating outfit:', error);
      toast({
        title: "Error creating outfit",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          Create Outfit
        </h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Outfit Name *</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Casual"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="mt-1"
              rows={3}
            />
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

        <div>
          <h3 className="text-sm font-medium mb-3">Select Items ({selectedItems.length})</h3>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No items in your wardrobe yet. Add some items first!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {items.map(item => (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all interactive-card ${
                    selectedItems.includes(item.id) 
                      ? 'ring-2 ring-outfit-primary bg-gradient-to-br from-outfit-primary/10 to-outfit-secondary/10 shadow-glow' 
                      : 'hover:bg-accent hover:shadow-elegant'
                  }`}
                  onClick={() => handleItemToggle(item.id)}
                >
                  <CardContent className="p-3">
                    <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2 relative">
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
                      {selectedItems.includes(item.id) && (
                        <div className="absolute top-2 right-2 bg-outfit-primary text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-medium truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full interactive-card" 
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <div className="flex flex-col items-center space-y-1">
              <span>Creating...</span>
              <span className="text-xs opacity-75">{loadingMessage}</span>
            </div>
          ) : (
            'Create Outfit'
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateOutfitPage;
