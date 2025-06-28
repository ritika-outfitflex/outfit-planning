
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  created_at: string;
}

const AIFashionAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    setLoading(true);
    const userMessage = input;
    setInput('');

    // Generate AI response (mock for now - you'd integrate with OpenAI/Claude here)
    const aiResponse = generateMockResponse(userMessage);

    try {
      const { data, error } = await supabase
        .from('fashion_chats')
        .insert([{
          user_id: user.id,
          message: userMessage,
          response: aiResponse,
          context: { timestamp: new Date().toISOString() }
        }])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error('Error saving chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockResponse = (message: string): string => {
    const responses = [
      "Based on your wardrobe, I'd suggest pairing that with your navy blazer for a sophisticated look!",
      "That color would work beautifully with your existing pieces. Consider adding a statement accessory.",
      "Great choice! For the weather today, I recommend layering with your light cardigan.",
      "This outfit combination would be perfect for your upcoming event. The colors complement each other well.",
      "I notice you haven't worn your denim jacket lately - it would pair perfectly with this look!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const quickSuggestions = [
    "What should I wear today?",
    "Suggest outfits for work",
    "What goes with my blue dress?",
    "Help me plan weekend looks"
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-outfit-primary" />
          AI Fashion Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-4 mb-4 max-h-60 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Ask me anything about your wardrobe!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-2">
                <div className="bg-accent p-3 rounded-lg ml-8">
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className="bg-outfit-primary text-white p-3 rounded-lg mr-8">
                  <p className="text-sm">{msg.response}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {messages.length === 0 && (
          <div className="grid grid-cols-1 gap-2 mb-4">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your wardrobe..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFashionAssistant;
