import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import fashionCharacter from '@/assets/fashion-character.png';

interface FashionAvatarProps {
  message?: string;
  compliments?: string[];
  isVisible?: boolean;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

const defaultCompliments = [
  "Yass queen! 💅",
  "You're absolutely slaying! ✨",
  "That outfit is giving main character energy! 👑",
  "Obsessed with this look! 😍",
  "Serving looks and I'm here for it! 🔥",
  "You understood the assignment! 💯",
  "This fit is chef's kiss! 👌",
  "Bestie, you look amazing! 💖",
  "That style is everything! ⭐",
  "You're absolutely stunning! 🌟"
];

const FashionAvatar: React.FC<FashionAvatarProps> = ({ 
  message, 
  compliments = defaultCompliments,
  isVisible = true,
  onClose,
  autoHide = true,
  duration = 4000
}) => {
  const [show, setShow] = useState(isVisible);
  const [currentMessage, setCurrentMessage] = useState(message || compliments[0]);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && !message) {
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
      setCurrentMessage(randomCompliment);
    } else if (message) {
      setCurrentMessage(message);
    }
  }, [show, message, compliments]);

  useEffect(() => {
    if (show && autoHide) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in w-[calc(100vw-2rem)] max-w-sm">
      <Card className="relative p-3 bg-gradient-card shadow-glow border-0">
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <img
              src={fashionCharacter}
              alt="Fashion Stylist"
              className="w-12 h-12 animate-float"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full animate-pulse-glow" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
              {currentMessage}
            </p>
          </div>

          {onClose && (
            <button
              onClick={() => {
                setShow(false);
                onClose();
              }}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-muted hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs"
            >
              ×
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FashionAvatar;