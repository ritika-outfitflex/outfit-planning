
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">User Name</h2>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-1">
        <h3 className="font-medium">Your Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="text-2xl font-semibold text-outfit-primary">28</h4>
              <p className="text-xs text-muted-foreground">Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="text-2xl font-semibold text-outfit-primary">12</h4>
              <p className="text-xs text-muted-foreground">Outfits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <h4 className="text-2xl font-semibold text-outfit-primary">5</h4>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full" variant="default">Edit Profile</Button>
        <Button className="w-full" variant="outline">Sign Out</Button>
      </div>
    </div>
  );
};

export default UserProfile;
