import { useState } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

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

export const useAdvancedColorDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const resizeImageIfNeeded = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) => {
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return { width, height };
  };

  const removeBackground = async (imageFile: File): Promise<string> => {
    setProgress(20);
    console.log('Starting background removal...');
    
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    setProgress(40);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
    
    resizeImageIfNeeded(canvas, ctx, img);
    setProgress(60);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    const result = await segmenter(imageData);
    
    setProgress(80);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    outputCtx.drawImage(canvas, 0, 0);
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Apply inverted mask to keep the subject
    for (let i = 0; i < result[0].mask.data.length; i++) {
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    setProgress(90);
    
    return outputCanvas.toDataURL('image/png');
  };

  const analyzeColors = (imageDataUrl: string): Promise<ColorInfo[]> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        if (!ctx) return resolve([]);
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const colorCounts: { [key: string]: number } = {};
        let totalPixels = 0;
        
        // Sample every 8th pixel for better performance
        for (let i = 0; i < data.length; i += 32) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Skip transparent pixels
          if (alpha < 128) continue;
          
          // Group similar colors (round to nearest 16)
          const rRounded = Math.round(r / 16) * 16;
          const gRounded = Math.round(g / 16) * 16;
          const bRounded = Math.round(b / 16) * 16;
          
          const colorKey = `${rRounded},${gRounded},${bRounded}`;
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
          totalPixels++;
        }
        
        // Get top 5 colors
        const sortedColors = Object.entries(colorCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([color, count]) => {
            const [r, g, b] = color.split(',').map(Number);
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            const percentage = Math.round((count / totalPixels) * 100);
            
            return {
              hex,
              name: getAdvancedColorName(r, g, b),
              rgb: { r, g, b },
              percentage
            };
          });
        
        resolve(sortedColors);
      };
      
      img.src = imageDataUrl;
    });
  };

  const processImage = async (imageFile: File): Promise<ColorDetectionResult> => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const originalImage = URL.createObjectURL(imageFile);
      setProgress(10);
      
      const processedImage = await removeBackground(imageFile);
      const dominantColors = await analyzeColors(processedImage);
      
      setProgress(100);
      
      const result: ColorDetectionResult = {
        originalImage,
        processedImage,
        dominantColors,
        primaryColor: dominantColors[0] || { hex: '#000000', name: 'Black', rgb: { r: 0, g: 0, b: 0 }, percentage: 0 }
      };
      
      return result;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    processImage,
    isProcessing,
    progress
  };
};

const getAdvancedColorName = (r: number, g: number, b: number): string => {
  const colors = [
    // Reds
    { name: 'Crimson Red', r: 220, g: 20, b: 60 },
    { name: 'Cherry Red', r: 222, g: 49, b: 99 },
    { name: 'Burgundy', r: 128, g: 0, b: 32 },
    { name: 'Rose Red', r: 255, g: 102, b: 102 },
    { name: 'Scarlet', r: 255, g: 36, b: 0 },
    
    // Blues
    { name: 'Royal Blue', r: 65, g: 105, b: 225 },
    { name: 'Navy Blue', r: 0, g: 0, b: 128 },
    { name: 'Sky Blue', r: 135, g: 206, b: 235 },
    { name: 'Deep Blue', r: 0, g: 0, b: 139 },
    { name: 'Teal Blue', r: 0, g: 128, b: 128 },
    { name: 'Powder Blue', r: 176, g: 224, b: 230 },
    
    // Greens
    { name: 'Forest Green', r: 34, g: 139, b: 34 },
    { name: 'Emerald Green', r: 80, g: 200, b: 120 },
    { name: 'Olive Green', r: 128, g: 128, b: 0 },
    { name: 'Mint Green', r: 152, g: 251, b: 152 },
    { name: 'Sage Green', r: 154, g: 205, b: 50 },
    
    // Others
    { name: 'Lavender', r: 230, g: 230, b: 250 },
    { name: 'Coral', r: 255, g: 127, b: 80 },
    { name: 'Peach', r: 255, g: 218, b: 185 },
    { name: 'Cream', r: 255, g: 253, b: 208 },
    { name: 'Beige', r: 245, g: 245, b: 220 },
    { name: 'Charcoal', r: 54, g: 69, b: 79 },
    { name: 'Ivory', r: 255, g: 255, b: 240 },
    
    // Basic colors
    { name: 'Red', r: 255, g: 0, b: 0 },
    { name: 'Blue', r: 0, g: 0, b: 255 },
    { name: 'Green', r: 0, g: 255, b: 0 },
    { name: 'Yellow', r: 255, g: 255, b: 0 },
    { name: 'Purple', r: 128, g: 0, b: 128 },
    { name: 'Orange', r: 255, g: 165, b: 0 },
    { name: 'Pink', r: 255, g: 192, b: 203 },
    { name: 'Black', r: 0, g: 0, b: 0 },
    { name: 'White', r: 255, g: 255, b: 255 },
    { name: 'Gray', r: 128, g: 128, b: 128 },
    { name: 'Brown', r: 165, g: 42, b: 42 },
  ];

  let closestColor = 'Unknown';
  let minDistance = Infinity;

  colors.forEach(color => {
    const distance = Math.sqrt(
      Math.pow(r - color.r, 2) + 
      Math.pow(g - color.g, 2) + 
      Math.pow(b - color.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  });

  return closestColor;
};
