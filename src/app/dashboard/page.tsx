
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function DashboardPage() {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [updates, setUpdates] = useState("");

  const handlePostUpdate = () => {
    if (!location && !updates) {
      toast({
        variant: "destructive",
        title: "Empty Update",
        description: "Please enter a location or product update.",
      });
      return;
    }
    toast({
      title: "Status Updated!",
      description: "Your customers have been notified.",
    });
    setLocation("");
    setUpdates("");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Update Your Status</CardTitle>
          <CardDescription>Let customers know where you are and what you're selling today.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Today's Location</Label>
            <Input 
              id="location" 
              placeholder="e.g., At Downtown Market 9–2PM" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="updates">Product Updates</Label>
            <Textarea 
              id="updates" 
              placeholder="e.g., Fresh strawberries are in! Limited supply." 
              value={updates}
              onChange={(e) => setUpdates(e.target.value)}
            />
          </div>
          <Button onClick={handlePostUpdate}>Post Update</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
          <CardDescription>View and update the status of your recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* A placeholder for order list */}
          <div className="border rounded-md p-8 text-center text-muted-foreground bg-muted/50">
            <p>No new orders right now.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
