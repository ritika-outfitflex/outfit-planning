
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, Camera, Palette } from 'lucide-react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useAdvancedColorDetection } from '@/hooks/useAdvancedColorDetection';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ColorDetectionPreview from '@/components/ColorDetectionPreview';
import { MultiSelect } from '@/components/MultiSelect';

const AddItemPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [seasons, setSeasons] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [material, setMaterial] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState({ name: '', hex: '' });
  const [colorDetectionResult, setColorDetectionResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useClothingItems();
  const { processImage, isProcessing, progress } = useAdvancedColorDetection();
  const { toast } = useToast();

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 
    'Accessories', 'Underwear', 'Sleepwear', 'Activewear'
  ];

  const subcategories = {
    'Tops': ['T-shirt', 'Shirt', 'Blouse', 'Sweater', 'Tank Top', 'Hoodie'],
    'Bottoms': ['Jeans', 'Pants', 'Shorts', 'Skirt', 'Leggings'],
    'Dresses': ['Casual', 'Formal', 'Maxi', 'Mini', 'Midi'],
    'Outerwear': ['Jacket', 'Coat', 'Blazer', 'Cardigan'],
    'Shoes': ['Sneakers', 'Boots', 'Heels', 'Flats', 'Sandals'],
    'Accessories': ['Bag', 'Hat', 'Scarf', 'Belt', 'Jewelry'],
    'Underwear': ['Bra', 'Underwear', 'Socks'],
    'Sleepwear': ['Pajamas', 'Nightgown', 'Robe'],
    'Activewear': ['Sports Bra', 'Workout Top', 'Yoga Pants', 'Shorts']
  };

  const seasonOptions = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' }
  ];

  const occasionOptions = [
    { value: 'casual', label: 'Casual' },
    { value: 'work', label: 'Work' },
    { value: 'formal', label: 'Formal' },
    { value: 'party', label: 'Party' },
    { value: 'date', label: 'Date' },
    { value: 'workout', label: 'Workout' }
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    
    try {
      const result = await processImage(file);
      setColorDetectionResult(result);
      
      if (result.primaryColor) {
        setSelectedColor({
          name: result.primaryColor.name,
          hex: result.primaryColor.hex
        });
      }
    } catch (error) {
      console.error('Color detection error:', error);
      toast({
        title: "Color detection failed",
        description: "We'll use a default color. You can change it later.",
        variant: "destructive"
      });
    }
  };

  const handleColorSelect = (color: any) => {
    setSelectedColor({
      name: color.name,
      hex: color.hex
    });
    
    toast({
      title: "Color selected!",
      description: `Selected ${color.name} as the primary color.`,
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('No user found');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('clothing-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('clothing-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !category) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the name and category.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      let imageUrl = '';
      
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await addItem({
        name: name.trim(),
        category,
        subcategory: subcategory || undefined,
        color: selectedColor.name || 'Unknown',
        hex_color: selectedColor.hex || '#808080',
        brand: brand.trim() || undefined,
        size: size.trim() || undefined,
        material: material.trim() || undefined,
        seasons: seasons.length > 0 ? seasons : undefined,
        occasions: occasions.length > 0 ? occasions : undefined,
        image_url: imageUrl || undefined,
        notes: notes.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
        is_favorite: false
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
      setUploading(false);
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
          <label className="text-sm font-medium mb-2 block">Photo</label>
          <div className="space-y-4">
            <Card 
              className="border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CardContent className="p-6 text-center">
                {selectedFile ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                    {selectedColor.hex && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div 
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: selectedColor.hex }}
                        />
                        <span className="text-sm font-medium">{selectedColor.name}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Tap to upload a photo
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <input
              id="file-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="text-sm">Processing image...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {colorDetectionResult && (
            <ColorDetectionPreview 
              result={colorDetectionResult}
              onColorSelect={handleColorSelect}
              selectedColor={selectedColor}
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Item Name *</label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Blue Cotton T-shirt"
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
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Subcategory</label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {category && subcategories[category as keyof typeof subcategories]?.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <MultiSelect
            label="Seasons"
            options={seasonOptions}
            value={seasons}
            onChange={setSeasons}
          />

          <MultiSelect
            label="Occasions"
            options={occasionOptions}
            value={occasions}
            onChange={setOccasions}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Brand</label>
              <Input 
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Nike"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Size</label>
              <Input 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., M, 32, 8"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Material</label>
              <Input 
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g., Cotton"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input 
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
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
          disabled={uploading || !name.trim() || !category}
        >
          {uploading ? 'Adding Item...' : 'Add to Wardrobe'}
        </Button>
      </form>
    </div>
  );
};

export default AddItemPage;
