
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Heart } from 'lucide-react';
import loginBackground from '@/assets/login-background.jpg';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (isLogin) {
          navigate('/');
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-outfit-primary/20 via-transparent to-outfit-secondary/20 backdrop-blur-[2px]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-30">
        <Heart className="h-8 w-8 text-outfit-primary animate-pulse" />
      </div>
      <div className="absolute top-32 right-16 opacity-20">
        <Sparkles className="h-6 w-6 text-outfit-secondary animate-bounce" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-25">
        <Sparkles className="h-4 w-4 text-outfit-accent animate-pulse" />
      </div>
      
      <Card className="w-full max-w-md relative z-10 border-0 shadow-glow backdrop-blur-md bg-white/90">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-outfit-primary" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-outfit-primary to-outfit-secondary bg-clip-text text-transparent">
              OutfitFlex
            </CardTitle>
            <Heart className="h-6 w-6 text-outfit-accent" />
          </div>
          <CardDescription className="text-outfit-dark/70">
            {isLogin ? 'Welcome back, fashionista! ✨' : 'Join our stylish community 💖'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 pl-4 border-outfit-primary/20 focus:border-outfit-primary bg-white/50 backdrop-blur-sm"
                />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pl-4 border-outfit-primary/20 focus:border-outfit-primary bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-outfit-primary to-outfit-secondary hover:from-outfit-primary/90 hover:to-outfit-secondary/90 transition-all duration-300 shadow-glow" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <Sparkles className="mr-2 h-5 w-5" />
              {isLogin ? 'Sign In & Style' : 'Join the Fashion'}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-outfit-dark/70 hover:text-outfit-primary hover:bg-outfit-primary/5"
            >
              {isLogin 
                ? "New here? Create your style profile ✨" 
                : "Already have an account? Sign in 💫"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
