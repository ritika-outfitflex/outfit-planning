import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  filters: {
    colors: string[];
    seasons: string[];
    occasions: string[];
    categories: string[];
    timesWornRange: [number, number];
    favorites: boolean;
  };
  onFilterChange: (filters: any) => void;
  availableFilters: {
    colors: string[];
    seasons: string[];
    occasions: string[];
    categories: string[];
  };
  activeFilterCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  availableFilters,
  activeFilterCount
}) => {
  const toggleFilter = (type: string, value: string) => {
    const currentValues = filters[type as keyof typeof filters] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [type]: newValues });
  };

  const clearAllFilters = () => {
    onFilterChange({
      colors: [],
      seasons: [],
      occasions: [],
      categories: [],
      timesWornRange: [0, 100],
      favorites: false
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filters</CardTitle>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs"
          >
            Clear all ({activeFilterCount})
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Favorites */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorites"
              checked={filters.favorites}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, favorites: checked })
              }
            />
            <Label htmlFor="favorites" className="text-sm font-medium cursor-pointer">
              Favorites only
            </Label>
          </div>
        </div>

        {/* Categories */}
        {availableFilters.categories.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Categories</Label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.categories.map(category => (
                <Badge
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('categories', category)}
                >
                  {category}
                  {filters.categories.includes(category) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {availableFilters.colors.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Colors</Label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.colors.map(color => (
                <Badge
                  key={color}
                  variant={filters.colors.includes(color) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('colors', color)}
                >
                  {color}
                  {filters.colors.includes(color) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Seasons */}
        {availableFilters.seasons.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Seasons</Label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.seasons.map(season => (
                <Badge
                  key={season}
                  variant={filters.seasons.includes(season) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('seasons', season)}
                >
                  {season}
                  {filters.seasons.includes(season) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Occasions */}
        {availableFilters.occasions.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Occasions</Label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.occasions.map(occasion => (
                <Badge
                  key={occasion}
                  variant={filters.occasions.includes(occasion) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFilter('occasions', occasion)}
                >
                  {occasion}
                  {filters.occasions.includes(occasion) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Times Worn Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Times Worn: {filters.timesWornRange[0]} - {filters.timesWornRange[1] === 100 ? '100+' : filters.timesWornRange[1]}
          </Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={filters.timesWornRange}
            onValueChange={(value) =>
              onFilterChange({ ...filters, timesWornRange: value as [number, number] })
            }
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;