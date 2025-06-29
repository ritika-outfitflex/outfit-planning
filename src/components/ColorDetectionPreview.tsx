
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Palette } from 'lucide-react';

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
}

const ColorDetectionPreview: React.FC<ColorDetectionPreviewProps> = ({ result, onColorSelect }) => {
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
            Detected Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.dominantColors.map((color, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onColorSelect(color)}
              >
                <div 
                  className="w-8 h-8 rounded-full border-2 border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{color.name}</span>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
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
                  className="p-1 hover:bg-background rounded"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorDetectionPreview;
