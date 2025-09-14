import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Show the get started button after logo animation
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  const welcomeMessages = [
    "Welcome to your personal stylist! ✨",
    "Let's create amazing outfits together! 👗",
    "Your fashion journey starts here! 🌟",
    "Ready to look absolutely stunning? 💫"
  ];

  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-outfit-primary/10 via-white to-outfit-secondary/10 flex flex-col items-center justify-center p-8"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
            className="relative mb-8"
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="relative"
            >
              <img 
                src={logo} 
                alt="Fashion App Logo" 
                className="w-32 h-32 object-contain"
              />
              
              {/* Glow effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
                className="absolute inset-0 bg-gradient-primary rounded-full blur-xl -z-10"
              />
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [-20, -60],
                  x: [0, (i % 2 === 0 ? 20 : -20)]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute w-2 h-2 bg-gradient-primary rounded-full"
                style={{
                  top: `${20 + (i * 10)}%`,
                  left: `${30 + (i * 8)}%`
                }}
              />
            ))}
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center mb-8"
          >
            <motion.h1 
              className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Style Sync
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="text-lg text-muted-foreground font-medium"
            >
              {randomMessage}
            </motion.p>
          </motion.div>

          {/* Get Started Button */}
          <AnimatePresence>
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 200
                }}
              >
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="px-12 py-4 text-lg font-semibold bg-gradient-primary hover:scale-105 transform transition-all duration-300 shadow-glow"
                >
                  <motion.span
                    animate={{ 
                      textShadow: [
                        "0 0 0px rgba(255,255,255,0)",
                        "0 0 10px rgba(255,255,255,0.8)",
                        "0 0 0px rgba(255,255,255,0)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Get Started
                  </motion.span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;