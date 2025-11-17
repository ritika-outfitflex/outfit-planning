import React from 'react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Shirt, Star, TrendingUp, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const { items, loading: itemsLoading } = useClothingItems();
  const { outfits, loading: outfitsLoading } = useOutfits();

  const loading = itemsLoading || outfitsLoading;

  // Category distribution
  const categoryData = items.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, []);

  // Color distribution
  const colorData = items.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.name === item.color);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.color, value: 1, hex: item.hex_color });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Most worn item
  const mostWornItem = items.length > 0 
    ? [...items].sort((a, b) => b.times_worn - a.times_worn)[0]
    : null;

  const COLORS = ['hsl(315 70% 65%)', 'hsl(280 60% 70%)', 'hsl(340 70% 70%)', 'hsl(290 60% 75%)', 'hsl(320 65% 68%)'];

  const totalItems = items.length;
  const totalOutfits = outfits.length;
  const favoriteOutfits = outfits.filter(outfit => outfit.is_favorite).length;
  const totalWears = items.reduce((sum, item) => sum + item.times_worn, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="space-y-6 px-4 pt-6">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-purple-500 text-white px-6 py-8 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-white/95 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shirt className="w-8 h-8 text-pink-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                  <p className="text-xs text-gray-600">Fashion Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{favoriteOutfits}</p>
                  <p className="text-xs text-gray-600">Favorite Looks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-pink-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalOutfits}</p>
                  <p className="text-xs text-gray-600">Outfits Created</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalWears}</p>
                  <p className="text-xs text-gray-600">Total Wears</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Wardrobe Composition */}
        <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Wardrobe Composition</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.slice(0, 4).map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm text-gray-600">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Signature Hues */}
        <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Signature Hues</h2>
            
            {/* Color Bar */}
            <div className="flex h-16 rounded-2xl overflow-hidden mb-6">
              {colorData.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  style={{ 
                    backgroundColor: color.hex,
                    width: `${(color.value / items.length) * 100}%`
                  }}
                  className="transition-all"
                />
              ))}
            </div>

            {/* Most Worn Item */}
            {mostWornItem && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Most Worn</p>
                    <p className="font-semibold text-gray-800">{mostWornItem.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{mostWornItem.times_worn} wears</p>
                  </div>
                  {mostWornItem.image_url && (
                    <img 
                      src={mostWornItem.image_url} 
                      alt={mostWornItem.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;