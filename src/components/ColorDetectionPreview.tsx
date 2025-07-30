
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Palette, Check } from 'lucide-react';

interface ColorInfo {
  hex: string;
  name: string;
  rgb: { r: number; g: number; b: number };
  percentage: number;
}

interface ColorDetectionResult {
  originalImage: string;
  processedImage: string;
  dominantColors: ColorInfo[];
  primaryColor: ColorInfo;
}

interface ColorDetectionPreviewProps {
  result: ColorDetectionResult;
  onColorSelect: (color: ColorInfo) => void;
  selectedColor?: { name: string; hex: string };
}

const ColorDetectionPreview: React.FC<ColorDetectionPreviewProps> = ({ 
  result, 
  onColorSelect, 
  selectedColor 
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${text} copied to clipboard`,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="processed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="original" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <img 
                src={result.originalImage} 
                alt="Original" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processed" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <img 
                src={result.processedImage} 
                alt="Background removed" 
                className="w-full h-48 object-cover rounded-lg bg-gray-100"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Choose the Best Matching Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {result.dominantColors.map((color, index) => {
              const isSelected = selectedColor?.hex === color.hex;
              
              return (
                <div 
                  key={index}
                  className={`relative cursor-pointer transition-all ${
                    isSelected ? 'scale-110 ring-2 ring-primary ring-offset-2' : 'hover:scale-105'
                  }`}
                  onClick={() => onColorSelect(color)}
                >
                  <div 
                    className="w-12 h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {index === 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-secondary rounded-full w-4 h-4 flex items-center justify-center">
                      <div className="w-2 h-2 bg-secondary-foreground rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorDetectionPreview;
