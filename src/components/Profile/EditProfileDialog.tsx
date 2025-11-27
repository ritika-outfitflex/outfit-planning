import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/useUserProfile';

interface EditProfileDialogProps {
  children: React.ReactNode;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ children }) => {
  const { profile, updateProfile } = useUserProfile();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [ageGroup, setAgeGroup] = useState(profile?.age_group || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [region, setRegion] = useState(profile?.region || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateProfile({ 
      full_name: fullName,
      age_group: ageGroup || null,
      gender: gender || null,
      region: region || null
    });
    if (result.success) {
      setIsOpen(false);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-elegant">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email (read-only)
            </Label>
            <Input
              id="email"
              value={profile?.email || ''}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ageGroup" className="text-sm font-medium">
              Age Group
            </Label>
            <select
              id="ageGroup"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Not specified</option>
              <option value="child">Child (5-12)</option>
              <option value="teen">Teen (13-19)</option>
              <option value="young_adult">Young Adult (20-35)</option>
              <option value="adult">Adult (36-55)</option>
              <option value="senior">Senior (55+)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium">
              Gender
            </Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Not specified</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non_binary">Non-Binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="region" className="text-sm font-medium">
              Region
            </Label>
            <Input
              id="region"
              placeholder="e.g., India, USA, UK"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="border-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-primary hover:shadow-elegant transition-all duration-300"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;