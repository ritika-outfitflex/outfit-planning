import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import fashionCharacter from '@/assets/fashion-character.png';

interface WelcomeCharacterProps {
  onClose?: () => void;
}

const WelcomeCharacter: React.FC<WelcomeCharacterProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "Hey beautiful! ✨",
    "Let's see how we're gonna style you today! 💅",
    "Ready to discover your perfect outfit? 👗"
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 8000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(hideTimer);
    };
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Card className="relative max-w-sm mx-4 p-6 bg-gradient-card shadow-elegant border-0 animate-bounce-in">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <img
              src={fashionCharacter}
              alt="Fashion Stylist Character"
              className="w-32 h-32 mx-auto animate-float"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full animate-pulse-glow" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {messages[currentMessage]}
            </h2>
            <div className="flex justify-center space-x-1">
              {messages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentMessage 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeCharacter;