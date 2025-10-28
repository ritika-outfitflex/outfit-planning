
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, Camera, Palette, Sparkles } from 'lucide-react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useAdvancedColorDetection } from '@/hooks/useAdvancedColorDetection';
import { usePatternDetection } from '@/hooks/usePatternDetection';
import { useDetailedAttributeDetection } from '@/hooks/useDetailedAttributeDetection';
import { useItemNameGenerator } from '@/hooks/useItemNameGenerator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ColorDetectionPreview from '@/components/ColorDetectionPreview';
import { MultiSelect } from '@/components/MultiSelect';
import { getRandomMessage } from '@/utils/loadingMessages';

interface AddItemPageProps {
  editItem?: any;
  onSave?: (item: any) => void;
}

const AddItemPage = ({ editItem, onSave }: AddItemPageProps) => {
  const [name, setName] = useState(editItem?.name || '');
  const [category, setCategory] = useState(editItem?.category || '');
  const [subcategory, setSubcategory] = useState(editItem?.subcategory || '');
  const [seasons, setSeasons] = useState<string[]>(editItem?.seasons || []);
  const [occasions, setOccasions] = useState<string[]>(editItem?.occasions || []);
  const [size, setSize] = useState(editItem?.size || '');
  const [material, setMaterial] = useState(editItem?.material || '');
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState({ 
    name: editItem?.color || '', 
    hex: editItem?.hex_color || '' 
  });
  const [colorDetectionResult, setColorDetectionResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem, updateItem } = useClothingItems();
  const { processImage, isProcessing, progress } = useAdvancedColorDetection();
  const { detectPattern, isProcessing: isDetectingPattern } = usePatternDetection();
  const { detectAttributes, isProcessing: isDetectingAttributes } = useDetailedAttributeDetection();
  const { generateName, isGenerating } = useItemNameGenerator();
  const { toast } = useToast();
  
  const [detectedPattern, setDetectedPattern] = useState<string>(editItem?.pattern || '');
  const [styleTags, setStyleTags] = useState<string[]>(editItem?.style_tags || []);
  const [sleeveType, setSleeveType] = useState<string>(editItem?.sleeve_type || '');
  const [pantStyle, setPantStyle] = useState<string>(editItem?.pant_style || '');
  const [neckline, setNeckline] = useState<string>(editItem?.neckline || '');
  const [fit, setFit] = useState<string>(editItem?.fit || '');

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

  const generateDescription = async (imageFile: File) => {
    if (!imageFile) return;
    
    setGeneratingDescription(true);
    try {
      // Create a simple description based on category and color
      const description = `${selectedColor.name || 'colored'} ${category.toLowerCase()} ${subcategory ? `(${subcategory.toLowerCase()})` : ''} ${material ? `made of ${material.toLowerCase()}` : ''}`.trim();
      setNotes(description);
      
      toast({
        title: "Description generated!",
        description: "Auto-generated description has been added to notes."
      });
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: "Description generation failed",
        description: "You can add a description manually.",
        variant: "destructive"
      });
    } finally {
      setGeneratingDescription(false);
    }
  };

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
      // Process color detection
      const colorResult = await processImage(file);
      setColorDetectionResult(colorResult);
      
      if (colorResult.primaryColor) {
        setSelectedColor({
          name: colorResult.primaryColor.name,
          hex: colorResult.primaryColor.hex
        });
      }

      // Detect patterns
      const patternResult = await detectPattern(file);
      setDetectedPattern(patternResult.pattern);
      setStyleTags(patternResult.styleTags);

      // Detect detailed attributes
      if (category) {
        toast({
          title: "Analyzing details...",
          description: "Detecting sleeves, fit, and style details",
        });
        
        const attributes = await detectAttributes(file, category, subcategory);
        if (attributes.sleeveType) setSleeveType(attributes.sleeveType);
        if (attributes.pantStyle) setPantStyle(attributes.pantStyle);
        if (attributes.neckline) setNeckline(attributes.neckline);
        if (attributes.fit) setFit(attributes.fit);

        // Auto-generate name
        const generatedName = await generateName({
          category,
          subcategory,
          color: colorResult.primaryColor?.name || selectedColor.name,
          pattern: patternResult.pattern,
          material,
          sleeveType: attributes.sleeveType,
          pantStyle: attributes.pantStyle,
          neckline: attributes.neckline,
          fit: attributes.fit,
        });
        
        if (!name) {
          setName(generatedName);
        }
        
        toast({
          title: "Analysis complete!",
          description: `Auto-generated name and detected all attributes`,
        });
      }
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: "Analysis warning",
        description: "Some features may be limited. You can still add the item.",
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
    setUploadMessage(getRandomMessage('save'));
    
    try {
      let imageUrl = editItem?.image_url || '';
      
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const itemData = {
        name: name.trim(),
        category,
        subcategory: subcategory || undefined,
        color: selectedColor.name || 'Unknown',
        hex_color: selectedColor.hex || '#808080',
        pattern: detectedPattern || 'solid',
        style_tags: styleTags.length > 0 ? styleTags : undefined,
        sleeve_type: sleeveType || undefined,
        pant_style: pantStyle || undefined,
        neckline: neckline || undefined,
        fit: fit || undefined,
        size: size.trim() || undefined,
        material: material.trim() || undefined,
        seasons: seasons.length > 0 ? seasons : undefined,
        occasions: occasions.length > 0 ? occasions : undefined,
        image_url: imageUrl || undefined,
        notes: notes.trim() || undefined,
        is_favorite: editItem?.is_favorite || false
      };

      if (editItem) {
        await updateItem(editItem.id, itemData);
        toast({
          title: "Item updated!",
          description: "Your clothing item has been updated."
        });
        if (onSave) {
          onSave(itemData);
        }
      } else {
        await addItem(itemData);
        toast({
          title: "Item added!",
          description: "Your clothing item has been added to your wardrobe."
        });
      }

      navigate('/wardrobe');
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: `Error ${editItem ? 'updating' : 'adding'} item`,
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-outfit-primary/5 to-outfit-secondary/5 p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-outfit-primary to-outfit-secondary bg-clip-text text-transparent">
          {editItem ? 'Edit Item' : 'Add Item'}
        </h1>
        <div className="w-10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Photo</label>
          <div className="space-y-4">
            <Card 
              className="border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-all interactive-card"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <CardContent className="p-6 text-center">
                {selectedFile || editItem?.image_url ? (
                  <div className="space-y-2">
                    <img 
                      src={selectedFile ? URL.createObjectURL(selectedFile) : editItem?.image_url} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : 'Current image'}
                    </p>
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
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Camera option */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.capture = 'environment';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    handleFileSelect({ target: { files: [file] } } as any);
                  }
                };
                input.click();
              }}
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>

          {(isProcessing || isDetectingPattern || isDetectingAttributes || isGenerating) && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-outfit-primary/10 to-outfit-secondary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-outfit-primary animate-pulse" />
                <span className="text-sm font-medium text-outfit-primary">
                  {isProcessing ? getRandomMessage('colors') : 
                   isDetectingPattern ? 'Detecting patterns...' :
                   isDetectingAttributes ? 'Analyzing sleeves, fit & style...' :
                   'Generating name...'}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {isProcessing ? getRandomMessage('upload') : 
                 'AI is analyzing your item to make adding clothes super easy'}
              </p>
            </div>
          )}

          {(detectedPattern || sleeveType || pantStyle || neckline || fit) && (
            <div className="p-3 bg-accent/50 rounded-lg border border-primary/20 space-y-1">
              <p className="text-sm font-medium mb-2">🤖 AI Detected Attributes:</p>
              {detectedPattern && (
                <p className="text-sm">
                  <span className="font-medium">Pattern:</span> {detectedPattern}
                </p>
              )}
              {sleeveType && (
                <p className="text-sm">
                  <span className="font-medium">Sleeves:</span> {sleeveType}
                </p>
              )}
              {pantStyle && (
                <p className="text-sm">
                  <span className="font-medium">Pant Style:</span> {pantStyle}
                </p>
              )}
              {neckline && (
                <p className="text-sm">
                  <span className="font-medium">Neckline:</span> {neckline}
                </p>
              )}
              {fit && (
                <p className="text-sm">
                  <span className="font-medium">Fit:</span> {fit}
                </p>
              )}
              {styleTags.length > 0 && (
                <p className="text-sm">
                  <span className="font-medium">Style Tags:</span> {styleTags.join(', ')}
                </p>
              )}
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
              <label className="text-sm font-medium">Size</label>
              <Input 
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g., M, L, XL"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Material</label>
              <Input 
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g., Cotton"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Notes</label>
              {selectedFile && category && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => generateDescription(selectedFile)}
                  disabled={generatingDescription}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  {generatingDescription ? 'Generating...' : 'Auto-describe'}
                </Button>
              )}
            </div>
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
          className="w-full interactive-card" 
          disabled={uploading || !name.trim() || !category}
        >
          {uploading ? (
            <div className="flex flex-col items-center space-y-1">
              <span>{editItem ? 'Updating' : 'Adding'} Item...</span>
              <span className="text-xs opacity-75">{uploadMessage}</span>
            </div>
          ) : (
            `${editItem ? 'Update' : 'Add to'} Wardrobe`
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddItemPage;
