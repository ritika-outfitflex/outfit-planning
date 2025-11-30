
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Lock } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && fullName.trim().length < 2) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password, fullName, ageGroup, gender, region);

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[hsl(330,70%,65%)] via-[hsl(315,75%,70%)] to-[hsl(280,70%,75%)]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">OutfitFlex</h1>
        </div>

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Your Profile'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to continue your style journey' : 'Unlock your ultimate style companion'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-14 pl-12 pr-4 bg-white border-0 shadow-md rounded-2xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[hsl(315,70%,65%)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="h-14 pl-4 pr-8 bg-white border-0 shadow-md rounded-2xl text-base text-gray-700 appearance-none cursor-pointer focus:ring-2 focus:ring-[hsl(315,70%,65%)] focus:outline-none"
                  >
                    <option value="">Age Group</option>
                    <option value="child">Child (5-12)</option>
                    <option value="teen">Teen (13-19)</option>
                    <option value="young_adult">Young Adult (20-35)</option>
                    <option value="adult">Adult (36-55)</option>
                    <option value="senior">Senior (55+)</option>
                  </select>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-14 pl-4 pr-8 bg-white border-0 shadow-md rounded-2xl text-base text-gray-700 appearance-none cursor-pointer focus:ring-2 focus:ring-[hsl(315,70%,65%)] focus:outline-none"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non_binary">Non-Binary</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <Input
                  type="text"
                  placeholder="Region (e.g., India, USA, UK)"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="h-14 px-4 bg-white border-0 shadow-md rounded-2xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[hsl(315,70%,65%)]"
                />
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 pl-12 pr-4 bg-white border-0 shadow-md rounded-2xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[hsl(315,70%,65%)]"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-14 pl-12 pr-4 bg-white border-0 shadow-md rounded-2xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[hsl(315,70%,65%)]"
              />
            </div>
            
            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-14 pl-12 pr-4 bg-white border-0 shadow-md rounded-2xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[hsl(315,70%,65%)]"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[hsl(330,70%,60%)] to-[hsl(260,70%,65%)] hover:from-[hsl(330,70%,55%)] hover:to-[hsl(260,70%,60%)] text-white rounded-2xl shadow-lg transition-all duration-300 mt-6" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isLogin ? 'Log In' : 'Get Started'
              )}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-700">
              {isLogin ? "Already have on account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[hsl(260,70%,55%)] font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
