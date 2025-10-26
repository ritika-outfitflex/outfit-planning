import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, Shirt, Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingScreensProps {
  onComplete: () => void;
}

const OnboardingScreens = ({ onComplete }: OnboardingScreensProps) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      icon: Shirt,
      title: 'Organize Your Wardrobe',
      description: 'Digitize your entire closet with smart color detection and AI-powered categorization. Never forget what you own again.',
      gradient: 'from-pink-500 via-purple-500 to-indigo-500',
      illustration: (
        <div className="relative w-64 h-64 mx-auto">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-pink-400/20 to-purple-400/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
              <Shirt className="w-24 h-24 text-white drop-shadow-lg" />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-8 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-purple-300 to-indigo-300 shadow-lg"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Styling',
      description: 'Get personalized outfit suggestions based on weather, occasion, and your unique style preferences.',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      illustration: (
        <div className="relative w-64 h-64 mx-auto">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl relative overflow-hidden">
              <Sparkles className="w-24 h-24 text-white drop-shadow-lg z-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-white shadow-lg"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      ),
    },
    {
      icon: Calendar,
      title: 'Plan & Track Outfits',
      description: 'Schedule your weekly looks, track wear frequency, and discover your most-loved pieces with smart analytics.',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      illustration: (
        <div className="relative w-64 h-64 mx-auto">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-indigo-400/20 to-pink-400/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-2xl">
              <Calendar className="w-24 h-24 text-white drop-shadow-lg" />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-4 right-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <TrendingUp className="w-12 h-12 text-pink-200 drop-shadow-lg" />
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-4 w-24 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-full shadow-lg"
            animate={{ scaleX: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      ),
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
  const Icon = currentScreenData.icon;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="h-full w-full flex flex-col">
        {/* Skip button */}
        <div className="flex justify-end p-6">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md flex flex-col items-center text-center space-y-8"
            >
              {/* Illustration */}
              <div className="w-full">
                {currentScreenData.illustration}
              </div>

              {/* Text content */}
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${currentScreenData.gradient} shadow-lg mb-2`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
                >
                  {currentScreenData.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {currentScreenData.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom section */}
        <div className="pb-8 px-6 space-y-6">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {screens.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentScreen
                    ? 'w-8 bg-gradient-to-r from-primary to-secondary'
                    : 'w-2 bg-muted'
                }`}
                animate={{
                  scale: index === currentScreen ? 1.2 : 1,
                }}
              />
            ))}
          </div>

          {/* Next/Get Started button */}
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
          >
            {currentScreen === screens.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreens;
