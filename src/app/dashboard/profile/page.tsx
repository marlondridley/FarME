
"use client";

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Tractor } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { saveFarmData, getFarmForUser } from "@/lib/database";
import type { Farm } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(3, "Farm name must be at least 3 characters long."),
  bio: z.string().min(10, "Bio must be at least 10 characters long.").max(160, "Bio should not exceed 160 characters."),
  address: z.string().min(10, "Please enter a valid address."),
});

type FormData = z.infer<typeof formSchema>;

export default function FarmProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchFarmData = async () => {
      setInitializing(true);
      const farmData = await getFarmForUser(user.uid);
      if (farmData) {
        form.reset({
          name: farmData.name || "",
          bio: farmData.bio || "",
          address: farmData.location?.address || "",
        });
      }
      setInitializing(false);
    };

    fetchFarmData();
  }, [user, form]);
  
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user) {
        toast({ variant: 'destructive', title: "Error", description: "You must be logged in to save." });
        return;
    }
    setLoading(true);
    try {
      await saveFarmData(user.uid, data);
      toast({
        title: "Profile Saved!",
        description: "Your farm information has been updated.",
      });
    } catch (error) {
      console.error("Failed to save farm data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save your farm profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Tractor className="w-8 h-8 text-accent" />
        <h1 className="text-3xl font-bold font-headline">Your Farm Profile</h1>
      </div>
      <p className="text-muted-foreground">
        This information will be visible to customers on your farm's public page.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>Tell everyone what makes your farm special.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Green Valley Greens" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio / Short Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., We specialize in organic, sun-ripened tomatoes and leafy greens." {...field} />
                    </FormControl>
                    <FormDescription>A brief, engaging description of your farm.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 123 Green Valley Rd, Organica, CA 90210" {...field} />
                    </FormControl>
                    <FormDescription>Your farm's physical address. This will be used to place you on the map.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
