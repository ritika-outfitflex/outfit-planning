
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
          <div className="space-y-3">
            {result.dominantColors.map((color, index) => {
              const isSelected = selectedColor?.hex === color.hex;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? 'bg-primary/10 border-primary shadow-md' 
                      : 'hover:bg-accent border-transparent'
                  }`}
                  onClick={() => onColorSelect(color)}
                >
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full w-5 h-5 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                        {color.name}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Primary</Badge>
                      )}
                      {isSelected && (
                        <Badge variant="default" className="text-xs">Selected</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{color.hex}</span>
                      <span>•</span>
                      <span>{color.percentage}%</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(color.hex);
                    }}
                    className="p-1 hover:bg-background rounded opacity-60 hover:opacity-100"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
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
