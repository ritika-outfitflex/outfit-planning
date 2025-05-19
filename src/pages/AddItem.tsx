
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear', 'Underwear'
];

const AddItemPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#000000');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will connect to backend later
    console.log({ name, category, color, notes });
    
    // Navigate back to the wardrobe after "saving"
    navigate('/wardrobe');
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Add New Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <div className="relative w-48 h-48 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            <Camera className="h-10 w-10 text-muted-foreground" />
            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-center p-2">
              <Button variant="ghost" size="sm" className="text-white w-full h-auto p-0 text-xs">
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input 
            id="name" 
            placeholder="E.g., Blue Denim Jacket" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex items-center space-x-2">
            <div 
              className="w-10 h-10 rounded-md border"
              style={{ backgroundColor: color }}
            />
            <Input 
              type="color" 
              id="color" 
              className="w-full h-10" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea 
            id="notes" 
            placeholder="Any additional information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">Save Item</Button>
      </form>
    </div>
  );
};

export default AddItemPage;
