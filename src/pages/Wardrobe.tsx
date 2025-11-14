
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Shirt, Heart, Star, Filter, SlidersHorizontal } from 'lucide-react';
import FilterPanel from '@/components/Wardrobe/FilterPanel';
import { Badge } from '@/components/ui/badge';
import ClothingItem from '@/components/Wardrobe/ClothingItem';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories'];

const WardrobePage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    colors: [] as string[],
    seasons: [] as string[],
    occasions: [] as string[],
    categories: [] as string[],
    timesWornRange: [0, 100] as [number, number],
    favorites: false
  });
  const navigate = useNavigate();
  const { items, loading } = useClothingItems();
  const { getFirstName } = useUserProfile();
  
  // Extract available filter options from items
  const availableFilters = useMemo(() => {
    const colors = [...new Set(items.map(item => item.color))].filter(Boolean);
    const seasons = [...new Set(items.flatMap(item => item.seasons || []))].filter(Boolean);
    const occasions = [...new Set(items.flatMap(item => item.occasions || []))].filter(Boolean);
    const categories = [...new Set(items.map(item => item.category))].filter(Boolean);
    
    return { colors, seasons, occasions, categories };
  }, [items]);
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Category filter
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      
      // Search query
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Color filter
      const matchesColor = filters.colors.length === 0 || filters.colors.includes(item.color);
      
      // Season filter
      const matchesSeason = filters.seasons.length === 0 || 
        (item.seasons && item.seasons.some(s => filters.seasons.includes(s)));
      
      // Occasion filter
      const matchesOccasion = filters.occasions.length === 0 || 
        (item.occasions && item.occasions.some(o => filters.occasions.includes(o)));
      
      // Category filter from filter panel
      const matchesFilterCategory = filters.categories.length === 0 || 
        filters.categories.includes(item.category);
      
      // Times worn range
      const matchesTimesWorn = item.times_worn >= filters.timesWornRange[0] && 
        (filters.timesWornRange[1] === 100 ? true : item.times_worn <= filters.timesWornRange[1]);
      
      // Favorites filter
      const matchesFavorites = !filters.favorites || item.is_favorite;
      
      return matchesCategory && matchesSearch && matchesColor && matchesSeason && 
             matchesOccasion && matchesFilterCategory && matchesTimesWorn && matchesFavorites;
    });
  }, [items, activeCategory, searchQuery, filters]);
  
  const activeFilterCount = 
    filters.colors.length + 
    filters.seasons.length + 
    filters.occasions.length + 
    filters.categories.length + 
    (filters.favorites ? 1 : 0) +
    (filters.timesWornRange[0] !== 0 || filters.timesWornRange[1] !== 100 ? 1 : 0);

  if (loading) {
    return (
      <div className="space-y-6 pb-6 animate-fade-in">
        <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
          <div className="text-center text-white space-y-3">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
              <h1 className="text-3xl font-bold">{getFirstName()}'s Wardrobe</h1>
              <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
            </div>
            <p className="text-purple-100 text-lg font-medium">Your Fashion Collection</p>
          </div>
        </div>
        <div className="px-4">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Hero Header */}
      <div className="relative px-4 pt-8 pb-6 bg-gradient-hero rounded-b-[2rem] shadow-elegant">
        <div className="text-center text-white space-y-3">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
            <h1 className="text-3xl font-bold">{getFirstName()}'s Wardrobe</h1>
            <Star className="h-6 w-6 text-yellow-200 animate-pulse" />
          </div>
          <p className="text-purple-100 text-lg font-medium">Your Fashion Collection</p>
          <p className="text-purple-200 text-sm max-w-xs mx-auto">
            {items.length} beautiful items in your collection ✨
          </p>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-white/20 rounded-full animate-float" />
        <div className="absolute top-8 right-6 w-3 h-3 bg-pink-300/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-4 left-8 w-2 h-2 bg-yellow-300/40 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="px-4 space-y-6">
        {/* Search Bar with Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, color, category..." 
              className="pl-9 border-primary/20 focus:border-primary transition-colors rounded-xl bg-gradient-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-xl">
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Your Wardrobe</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel
                  filters={filters}
                  onFilterChange={setFilters}
                  availableFilters={availableFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="bg-gradient-card h-auto p-1 w-auto shadow-sm border-0">
              {categories.map((category, index) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="px-4 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-white rounded-lg transition-all duration-300 data-[state=active]:shadow-md animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeCategory} className="mt-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shirt className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  {items.length === 0 
                    ? "Your wardrobe is waiting for its first piece!"
                    : "No items match your search criteria."
                  }
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  {items.length === 0 ? "Add your first fashion item to get started" : "Try adjusting your search or category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(`/wardrobe/item/${item.id}`)}
                    className="group cursor-pointer hover:scale-105 transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-card rounded-xl overflow-hidden shadow-card group-hover:shadow-elegant transition-all duration-300">
                      <ClothingItem 
                        id={item.id}
                        name={item.name}
                        category={item.category}
                        color={item.color}
                        hex_color={item.hex_color}
                        image={item.image_url || '/placeholder.svg'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4 px-4">
        <Button 
          onClick={() => navigate('/wardrobe/add')}
          className="w-full max-w-xs bg-gradient-primary hover:shadow-elegant transition-all duration-300 border-0 shadow-lg"
        >
          <Shirt className="h-4 w-4 mr-2" />
          Add New Fashion Item
        </Button>
      </div>
    </div>
  );
};

export default WardrobePage;
