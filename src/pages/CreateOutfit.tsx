
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

const CreateOutfitPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [season, setSeason] = useState('');
  const [occasion, setOccasion] = useState('');
  const [weather, setWeather] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
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

    setLoading(true);
    try {
      await createOutfit({
        name: name.trim(),
        description: description.trim() || undefined,
        season: season || undefined,
        occasion: occasion || undefined,
        weather: weather || undefined,
        itemIds: selectedItems
      });

      toast({
        title: "Outfit created!",
        description: "Your new outfit has been saved to your collection."
      });

      navigate('/outfits');
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
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Create Outfit</h1>
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
                  className={`cursor-pointer transition-all ${
                    selectedItems.includes(item.id) 
                      ? 'ring-2 ring-outfit-primary bg-outfit-primary/5' 
                      : 'hover:bg-accent'
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
          className="w-full" 
          disabled={loading || !name.trim()}
        >
          {loading ? 'Creating...' : 'Create Outfit'}
        </Button>
      </form>
    </div>
  );
};

export default CreateOutfitPage;
