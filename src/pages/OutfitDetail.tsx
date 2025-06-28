
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash, Heart, Share } from 'lucide-react';
import { useOutfits } from '@/hooks/useOutfits';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const OutfitDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { outfits, loading, deleteOutfit, toggleFavorite, updateOutfit } = useOutfits();
  const { toast } = useToast();
  
  const outfit = outfits.find(o => o.id === id);

  const handleDelete = async () => {
    if (!outfit) return;
    
    if (window.confirm('Are you sure you want to delete this outfit?')) {
      try {
        await deleteOutfit(outfit.id);
        toast({
          title: "Outfit deleted",
          description: "The outfit has been removed from your collection."
        });
        navigate('/outfits');
      } catch (error) {
        toast({
          title: "Error deleting outfit",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!outfit) return;
    
    try {
      await toggleFavorite(outfit.id);
      toast({
        title: outfit.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: outfit.is_favorite ? "Outfit removed from favorites." : "Outfit added to favorites."
      });
    } catch (error) {
      toast({
        title: "Error updating outfit",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleWorn = async () => {
    if (!outfit) return;
    
    try {
      await updateOutfit(outfit.id, {
        times_worn: outfit.times_worn + 1,
        last_worn: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Outfit marked as worn",
        description: "Your wear count has been updated."
      });
    } catch (error) {
      toast({
        title: "Error updating outfit",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-6 w-32" />
          <div className="w-10" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Outfit not found</p>
        <Button onClick={() => navigate('/outfits')} className="mt-4">
          Back to Outfits
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Outfit Details</h1>
        <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
          <Heart className={`h-5 w-5 ${outfit.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{outfit.name}</h2>
        {outfit.description && (
          <p className="text-muted-foreground mb-4">{outfit.description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {outfit.season && <Badge variant="secondary">{outfit.season}</Badge>}
          {outfit.occasion && <Badge variant="secondary">{outfit.occasion}</Badge>}
          {outfit.weather && <Badge variant="secondary">{outfit.weather}</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Times worn:</span>
            <span className="ml-2 font-medium">{outfit.times_worn}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last worn:</span>
            <span className="ml-2 font-medium">
              {outfit.last_worn ? new Date(outfit.last_worn).toLocaleDateString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Items in this outfit ({outfit.items?.length || 0})</h3>
        {outfit.items && outfit.items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {outfit.items.map(item => (
              <Card 
                key={item.id}
                className="cursor-pointer hover:bg-accent"
                onClick={() => navigate(`/wardrobe/item/${item.clothing_item_id}`)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                    {item.clothing_item?.image_url ? (
                      <img
                        src={item.clothing_item.image_url}
                        alt={item.clothing_item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: item.clothing_item?.color }}
                        />
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-medium truncate">{item.clothing_item?.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.clothing_item?.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No items in this outfit</p>
        )}
      </div>

      <div className="space-y-3">
        <Button onClick={handleWorn} className="w-full">
          Mark as Worn Today
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
        
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          className="w-full flex items-center gap-2"
        >
          <Trash className="h-4 w-4" />
          Delete Outfit
        </Button>
      </div>
    </div>
  );
};

export default OutfitDetailPage;
