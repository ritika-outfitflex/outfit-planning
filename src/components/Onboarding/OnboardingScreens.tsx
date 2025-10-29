import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import wardrobeImg from '@/assets/onboarding-wardrobe.png';
import aiStylingImg from '@/assets/onboarding-ai-styling.png';
import calendarImg from '@/assets/onboarding-calendar.png';
import logo from '@/assets/logo.png';

interface OnboardingScreensProps {
  onComplete: () => void;
}

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      title: 'Unlock Your Virtual Wardrobe',
      description: 'Digitize your clothes & see everything you own',
      image: wardrobeImg,
      buttonText: 'Next: Smart Styling',
    },
    {
      title: 'AI-Powered Styling',
      description: 'Get personalized outfit suggestions based on weather, occasion, and your style',
      image: aiStylingImg,
      buttonText: 'Next: Plan Outfits',
    },
    {
      title: 'Plan & Track Outfits',
      description: 'Schedule your weekly looks and discover your most-loved pieces',
      image: calendarImg,
      buttonText: 'Get Started',
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentScreenData = screens[currentScreen];

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full w-full flex flex-col">
        {/* Logo */}
        <div className="flex justify-center pt-8 pb-4">
          <motion.img 
            src={logo} 
            alt="OutfitFlex" 
            className="h-16 w-16"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
          />
        </div>
        <motion.h2 
          className="text-center text-2xl font-bold text-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          OutfitFlex
        </motion.h2>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md flex flex-col items-center text-center space-y-6"
            >
              {/* Illustration */}
              <motion.div 
                className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img 
                  src={currentScreenData.image} 
                  alt={currentScreenData.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Text content */}
              <div className="space-y-3 px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-foreground"
                >
                  {currentScreenData.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base text-muted-foreground leading-relaxed"
                >
                  {currentScreenData.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom section */}
        <div className="pb-8 px-6 space-y-6">
          {/* Next/Get Started button */}
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-[hsl(20,70%,65%)] to-[hsl(25,75%,70%)] hover:opacity-90 transition-opacity shadow-lg text-white"
          >
            {currentScreenData.buttonText}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {screens.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentScreen
                    ? 'w-8 bg-[hsl(20,70%,65%)]'
                    : 'w-2 bg-muted'
                }`}
                animate={{
                  scale: index === currentScreen ? 1 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreens;
