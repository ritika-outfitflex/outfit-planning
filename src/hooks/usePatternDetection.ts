import { useState } from 'react';
import { pipeline } from '@huggingface/transformers';

export interface PatternDetectionResult {
  pattern: string;
  confidence: number;
  styleTags: string[];
}

export const usePatternDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const detectPattern = async (imageFile: File): Promise<PatternDetectionResult> => {
    setIsProcessing(true);
    setProgress(20);

    try {
      // Create image classifier
      const classifier = await pipeline(
        'image-classification',
        'Xenova/vit-base-patch16-224',
        { 
          progress_callback: (progressData: any) => {
            if (progressData.status === 'progress') {
              setProgress(20 + (progressData.progress || 0) * 0.6);
            }
          }
        }
      );

      setProgress(80);

      // Convert file to URL
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Classify the image
      const results = await classifier(imageUrl);
      
      setProgress(90);
      
      // Clean up
      URL.revokeObjectURL(imageUrl);

      // Analyze results to detect patterns
      const patternAnalysis = analyzeForPatterns(results);
      
      setProgress(100);
      
      return patternAnalysis;
    } catch (error) {
      console.error('Error detecting pattern:', error);
      // Return default values on error
      return {
        pattern: 'solid',
        confidence: 0.5,
        styleTags: ['casual']
      };
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return {
    detectPattern,
    isProcessing,
    progress
  };
};

// Helper function to analyze classification results for patterns
function analyzeForPatterns(results: any[]): PatternDetectionResult {
  const patternKeywords = {
    striped: ['stripe', 'striped', 'lines', 'horizontal', 'vertical'],
    floral: ['floral', 'flower', 'botanical', 'rose', 'daisy'],
    geometric: ['geometric', 'triangle', 'circle', 'square', 'pattern'],
    plaid: ['plaid', 'checkered', 'tartan', 'gingham'],
    polkadot: ['dot', 'polka', 'spotted'],
    animal: ['leopard', 'zebra', 'snake', 'animal print'],
    abstract: ['abstract', 'artistic', 'modern'],
    solid: ['solid', 'plain', 'uniform']
  };

  const styleKeywords = {
    casual: ['t-shirt', 'jeans', 'casual', 'everyday'],
    formal: ['suit', 'dress', 'formal', 'elegant', 'blazer'],
    sporty: ['athletic', 'sport', 'gym', 'active'],
    bohemian: ['boho', 'hippie', 'ethnic', 'tribal'],
    vintage: ['vintage', 'retro', 'classic'],
    modern: ['modern', 'contemporary', 'minimalist']
  };

  let detectedPattern = 'solid';
  let maxConfidence = 0;
  const styleTags: string[] = [];

  // Analyze top results
  for (const result of results.slice(0, 5)) {
    const label = result.label.toLowerCase();
    const score = result.score;

    // Check for patterns
    for (const [pattern, keywords] of Object.entries(patternKeywords)) {
      if (keywords.some(keyword => label.includes(keyword))) {
        if (score > maxConfidence) {
          detectedPattern = pattern;
          maxConfidence = score;
        }
      }
    }

    // Check for style tags
    for (const [style, keywords] of Object.entries(styleKeywords)) {
      if (keywords.some(keyword => label.includes(keyword))) {
        if (!styleTags.includes(style)) {
          styleTags.push(style);
        }
      }
    }
  }

  // If no style tags detected, add 'casual' as default
  if (styleTags.length === 0) {
    styleTags.push('casual');
  }

  return {
    pattern: detectedPattern,
    confidence: maxConfidence || 0.5,
    styleTags
  };
}
