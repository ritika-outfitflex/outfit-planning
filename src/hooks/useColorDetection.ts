
import { useState } from 'react';

interface ColorInfo {
  hex: string;
  name: string;
  rgb: { r: number; g: number; b: number };
}

export const useColorDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const detectDominantColor = async (imageFile: File): Promise<ColorInfo> => {
    return new Promise((resolve, reject) => {
      setIsProcessing(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          reject(new Error('Failed to get image data'));
          return;
        }
        
        const colorCounts: { [key: string]: number } = {};
        const data = imageData.data;
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Skip transparent pixels
          if (alpha < 128) continue;
          
          // Round to nearest 32 to group similar colors
          const rRounded = Math.round(r / 32) * 32;
          const gRounded = Math.round(g / 32) * 32;
          const bRounded = Math.round(b / 32) * 32;
          
          const colorKey = `${rRounded},${gRounded},${bRounded}`;
          colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        
        // Find most common color
        let dominantColor = '0,0,0';
        let maxCount = 0;
        
        for (const [color, count] of Object.entries(colorCounts)) {
          if (count > maxCount) {
            maxCount = count;
            dominantColor = color;
          }
        }
        
        const [r, g, b] = dominantColor.split(',').map(Number);
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        const colorName = getColorName(r, g, b);
        
        setIsProcessing(false);
        resolve({
          hex,
          name: colorName,
          rgb: { r, g, b }
        });
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const removeBackground = async (imageFile: File): Promise<string> => {
    // This is a simplified background removal using canvas
    // In a real app, you'd use a proper AI service like Remove.bg
    return new Promise((resolve) => {
      setIsProcessing(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return;
        
        const data = imageData.data;
        
        // Simple background removal: make white/light pixels transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // If pixel is close to white, make it transparent
          const brightness = (r + g + b) / 3;
          if (brightness > 240) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        ctx?.putImageData(imageData, 0, 0);
        setIsProcessing(false);
        resolve(canvas.toDataURL('image/png'));
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  return {
    detectDominantColor,
    removeBackground,
    isProcessing
  };
};

const getColorName = (r: number, g: number, b: number): string => {
  const colors = [
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
    { name: 'Navy', r: 0, g: 0, b: 128 },
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
