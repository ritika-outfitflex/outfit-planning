import React from 'react';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useOutfits } from '@/hooks/useOutfits';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Shirt, Star, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
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

  const COLORS = ['hsl(315 70% 65%)', 'hsl(280 60% 70%)'];

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
    <div className="safe-top safe-bottom pb-20 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="hero-header">
        <div className="hero-content">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="hero-title">Style Analytics</h1>
          </div>
          <p className="hero-subtitle">Insights into your wardrobe</p>
        </div>
        <div className="hero-decoration" />
      </div>

      <div className="px-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shirt className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                  <p className="text-xs text-muted-foreground">Fashion Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalOutfits}</p>
                  <p className="text-xs text-muted-foreground">Style Combos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{favoriteItems}</p>
                  <p className="text-xs text-muted-foreground">Favorites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 border-chart-1/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalWears}</p>
                  <p className="text-xs text-muted-foreground">Total Wears</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wardrobe by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Color Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={colorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))">
                  {colorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hex || COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Worn Items */}
        {mostWornItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Worn Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mostWornItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip />
                  <Bar dataKey="timesWorn" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Style Preferences */}
        {styleTagsData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Style Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={styleTagsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;