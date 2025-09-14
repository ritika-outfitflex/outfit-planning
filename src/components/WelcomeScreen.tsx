import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import logo from '@/assets/logo.png';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'welcome' | 'transition' | 'message' | 'complete'>('welcome');
  const [showMessage, setShowMessage] = useState(false);

  const handleGetStarted = () => {
    setStage('transition');
    setTimeout(() => {
      setStage('message');
      setShowMessage(true);
    }, 800);
  };

  const handleMessageComplete = () => {
    setShowMessage(false);
    setStage('complete');
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    if (stage === 'message') {
      const timer = setTimeout(() => {
        handleMessageComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  return (
    <AnimatePresence>
      {stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Welcome Stage */}
          {stage === 'welcome' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full bg-white flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-16"
              >
                <img 
                  src={logo} 
                  alt="Fashion App Logo" 
                  className="w-32 h-32 object-contain"
                />
              </motion.div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="px-12 py-4 text-lg font-semibold bg-gradient-primary hover:scale-105 transform transition-all duration-300 shadow-glow"
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Transition Stage */}
          {stage === 'transition' && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="w-full h-full bg-white flex items-center justify-center"
            >
              <motion.img
                src={logo}
                alt="Fashion App Logo"
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={{ 
                  scale: 0.3, 
                  x: -150, 
                  y: -200 
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-32 h-32 object-contain"
              />
            </motion.div>
          )}

          {/* Message Stage with Blurred Background */}
          {stage === 'message' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full relative"
            >
              {/* Blurred background */}
              <motion.div
                initial={{ backdropFilter: "blur(0px)" }}
                animate={{ backdropFilter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-br from-outfit-primary/20 via-transparent to-outfit-secondary/20"
              />

              {/* Small logo in corner */}
              <motion.img
                src={logo}
                alt="Fashion App Logo"
                initial={{ scale: 0.3, x: -150, y: -200 }}
                animate={{ scale: 0.2, x: -180, y: -250 }}
                className="absolute top-8 left-8 w-32 h-32 object-contain opacity-60"
              />

              {/* Popup Message */}
              <AnimatePresence>
                {showMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{ 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <Card className="relative p-6 bg-gradient-card shadow-glow border-0 max-w-sm w-full">
                      <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                            <motion.div
                              animate={{ 
                                rotate: [0, 360]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="text-white text-xl"
                            >
                              ✨
                            </motion.div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full animate-pulse" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg font-medium bg-gradient-primary bg-clip-text text-transparent"
                          >
                            Let's create some outfits for you! 💫
                          </motion.p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;