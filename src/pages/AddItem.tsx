
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Upload, X, Sparkles } from 'lucide-react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useAdvancedColorDetection } from '@/hooks/useAdvancedColorDetection';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ColorDetectionPreview from '@/components/ColorDetectionPreview';

const AddItemPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [season, setSeason] = useState('');
  const [occasion, setOccasion] = useState('');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [colorDetectionResult, setColorDetectionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { addItem } = useClothingItems();
  const { processImage, isProcessing, progress } = useAdvancedColorDetection();
  const { toast } = useToast();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setColorDetectionResult(null);

    try {
      toast({
        title: "Processing image...",
        description: "Removing background and detecting colors"
      });

      const result = await processImage(file);
      setColorDetectionResult(result);
      
      // Auto-set the primary color
      if (result.primaryColor) {
        setColor(result.primaryColor.name);
      }
      
      toast({
        title: "Colors detected!",
        description: `Primary color: ${result.primaryColor.name}`
      });
    } catch (error) {
      console.error('Color detection failed:', error);
      toast({
        title: "Color detection failed",
        description: "Using fallback color detection",
        variant: "destructive"
      });
    }
  };

  const handleColorSelect = (colorInfo: any) => {
    setColor(colorInfo.name);
    toast({
      title: "Color selected",
      description: `Selected: ${colorInfo.name}`
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('clothing-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('clothing-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !color) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, category, and color.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      await addItem({
        name: name.trim(),
        category,
        subcategory: subcategory || undefined,
        color,
        brand: brand || undefined,
        size: size || undefined,
        material: material || undefined,
        season: season || undefined,
        occasion: occasion || undefined,
        notes: notes || undefined,
        price: price ? parseFloat(price) : undefined,
        purchase_date: purchaseDate || undefined,
        image_url: imageUrl || undefined,
        is_favorite: false,
        last_worn: undefined
      });

      toast({
        title: "Item added!",
        description: "Your clothing item has been added to your wardrobe."
      });

      navigate('/wardrobe');
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error adding item",
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
        <h1 className="text-xl font-bold">Add Item</h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium">Photo</label>
          <div className="mt-1">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    setColorDetectionResult(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Card className="border-dashed border-2 h-48 flex items-center justify-center cursor-pointer hover:bg-accent">
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload photo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                  />
                </CardContent>
              </Card>
            )}
          </div>
          {isProcessing && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span className="text-xs text-muted-foreground">
                  Processing image and detecting colors... {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {colorDetectionResult && (
          <ColorDetectionPreview 
            result={colorDetectionResult}
            onColorSelect={handleColorSelect}
          />
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Item Name *</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Blue Denim Jacket"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category *</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tops">Tops</SelectItem>
                  <SelectItem value="Bottoms">Bottoms</SelectItem>
                  <SelectItem value="Dresses">Dresses</SelectItem>
                  <SelectItem value="Shoes">Shoes</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Outerwear">Outerwear</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Color *</label>
              <Input 
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Royal Blue"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Brand</label>
              <Input 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Zara"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Size</label>
              <Input 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., M"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
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
                  <SelectItem value="all-season">All Season</SelectItem>
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
                  <SelectItem value="workout">Workout</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !name.trim() || !category || !color}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </Button>
      </form>
    </div>
  );
};

export default AddItemPage;
