
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOutfitCalendar } from '@/hooks/useOutfitCalendar';
import { useOutfits } from '@/hooks/useOutfits';
import { ArrowLeft, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedOutfitId, setSelectedOutfitId] = useState('');
  const [notes, setNotes] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const navigate = useNavigate();
  const { entries, addEntry, loading } = useOutfitCalendar();
  const { outfits } = useOutfits();
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const selectedDateEntry = selectedDate 
    ? entries.find(entry => entry.date === formatDate(selectedDate))
    : null;

  const handleSaveOutfit = async () => {
    if (!selectedDate) return;

    try {
      await addEntry(
        formatDate(selectedDate),
        selectedOutfitId || undefined,
        notes.trim() || undefined
      );
      
      toast({
        title: "Outfit saved!",
        description: "Your outfit has been added to the calendar."
      });
      
      setDialogOpen(false);
      setSelectedOutfitId('');
      setNotes('');
    } catch (error) {
      toast({
        title: "Error saving outfit",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Outfit Calendar</h1>
        <div className="w-10" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedDate.toLocaleDateString()}</span>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Outfit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Outfit for {selectedDate.toLocaleDateString()}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Choose Outfit</label>
                      <Select value={selectedOutfitId} onValueChange={setSelectedOutfitId}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select an outfit" />
                        </SelectTrigger>
                        <SelectContent>
                          {outfits.map(outfit => (
                            <SelectItem key={outfit.id} value={outfit.id}>
                              {outfit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any notes about this outfit..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    
                    <Button onClick={handleSaveOutfit} className="w-full">
                      Save Outfit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEntry ? (
              <div className="space-y-4">
                {selectedDateEntry.outfit && (
                  <div>
                    <h4 className="font-medium mb-2">Outfit: {selectedDateEntry.outfit.name}</h4>
                    {selectedDateEntry.outfit.items && selectedDateEntry.outfit.items.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {selectedDateEntry.outfit.items.map(item => (
                          <div key={item.id} className="text-center">
                            <div className="aspect-square bg-muted rounded-md overflow-hidden mb-1">
                              {item.clothing_item?.image_url ? (
                                <img
                                  src={item.clothing_item.image_url}
                                  alt={item.clothing_item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div 
                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: item.clothing_item?.hex_color }}
                                  />
                                </div>
                              )}
                            </div>
                            <p className="text-xs truncate">{item.clothing_item?.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {item.clothing_item?.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedDateEntry.notes && (
                  <div>
                    <h4 className="font-medium">Notes:</h4>
                    <p className="text-sm text-muted-foreground">{selectedDateEntry.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No outfit planned for this day
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
