
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Trash, Heart, Save, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useClothingItems } from '@/hooks/useClothingItems';
import { useToast } from '@/hooks/use-toast';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, updateItem, deleteItem } = useClothingItems();
  const { toast } = useToast();
  
  const item = items.find(i => i.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item?.name || '',
    brand: item?.brand || '',
    notes: item?.notes || '',
    price: item?.price || ''
  });

  const handleSave = async () => {
    if (!item) return;
    
    try {
      await updateItem(item.id, {
        name: editData.name,
        brand: editData.brand || undefined,
        notes: editData.notes || undefined,
        price: editData.price ? parseFloat(editData.price.toString()) : undefined
      });
      
      setIsEditing(false);
      toast({
        title: "Item updated",
        description: "Your changes have been saved."
      });
    } catch (error) {
      toast({
        title: "Error updating item",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(item.id);
        toast({
          title: "Item deleted",
          description: "The item has been removed from your wardrobe."
        });
        navigate('/wardrobe');
      } catch (error) {
        toast({
          title: "Error deleting item",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!item) return;
    
    try {
      await updateItem(item.id, { is_favorite: !item.is_favorite });
      toast({
        title: item.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: item.is_favorite ? "Item removed from favorites." : "Item added to favorites."
      });
    } catch (error) {
      toast({
        title: "Error updating item",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleWorn = async () => {
    if (!item) return;
    
    try {
      await updateItem(item.id, {
        times_worn: item.times_worn + 1,
        last_worn: new Date().toISOString().split('T')[0]
      });
      toast({
        title: "Item marked as worn",
        description: "Your wear count has been updated."
      });
    } catch (error) {
      toast({
        title: "Error updating item",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!item) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Item not found</p>
        <Button onClick={() => navigate('/wardrobe')} className="mt-4">
          Back to Wardrobe
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Item Details</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Save className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
                <Heart className={`h-5 w-5 ${item.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="aspect-square w-full overflow-hidden bg-muted rounded-md">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-full border-4 border-gray-300"
              style={{ backgroundColor: item.hex_color || item.color }}
            />
          </div>
        )}
      </div>

      <div>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Brand</label>
              <Input
                value={editData.brand}
                onChange={(e) => setEditData(prev => ({ ...prev, brand: e.target.value }))}
                className="mt-1"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
                className="mt-1"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={editData.notes}
                onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                placeholder="Optional notes..."
                rows={3}
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge>{item.category}</Badge>
              {item.subcategory && <Badge variant="outline">{item.subcategory}</Badge>}
              <div 
                className="w-4 h-4 rounded-full border" 
                style={{ backgroundColor: item.hex_color || item.color }}
              />
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <>
          <Separator />

          <div className="space-y-4">
            {item.brand && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Brand</h3>
                <p>{item.brand}</p>
              </div>
            )}

            {item.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                <p>{item.notes}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date Added</h3>
                <p>{new Date(item.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Times Worn</h3>
                <p>{item.times_worn}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Worn</h3>
                <p>{item.last_worn ? new Date(item.last_worn).toLocaleDateString() : 'Never'}</p>
              </div>
              {item.price && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                  <p>${item.price}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button onClick={handleWorn} className="w-full">
              Mark as Worn Today
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="w-full flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Remove from Wardrobe
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemDetailPage;
