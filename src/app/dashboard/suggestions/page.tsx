"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  smartCropSuggestions,
  type SmartCropSuggestionsInput,
  type SmartCropSuggestionsOutput,
} from "@/ai/flows/smart-crop-suggestions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  weatherPatterns: z.string().min(10, "Please describe the weather patterns in more detail."),
  timeOfYear: z.string().min(3, "Please enter a valid time of year (e.g., Spring)."),
  trendingPreferences: z.string().min(10, "Please describe trending customer preferences."),
  geographicArea: z.string().min(3, "Please enter your geographic area."),
  farmHistory: z.string().optional(),
});

export default function SmartCropSuggestionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmartCropSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weatherPatterns: "",
      timeOfYear: "",
      trendingPreferences: "",
      geographicArea: "",
      farmHistory: "",
    },
  });

  const onSubmit: SubmitHandler<SmartCropSuggestionsInput> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await smartCropSuggestions(data);
      setResult(response);
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get suggestions. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-accent" />
        <h1 className="text-3xl font-bold font-headline">Smart Crop Suggestions</h1>
      </div>
      <p className="text-muted-foreground">
        Use our AI tool to get recommendations for crops to plant based on market trends, weather, and your location.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Tell us about your farm</CardTitle>
          <CardDescription>The more details you provide, the better the suggestions will be.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="geographicArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geographic Area</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Napa Valley, California" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeOfYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Late Spring" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weatherPatterns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Patterns</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Unusually rainy, with a late frost predicted." {...field} />
                    </FormControl>
                    <FormDescription>Describe recent and predicted weather.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trendingPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trending Customer Preferences</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., High demand for heirloom tomatoes and organic kale." {...field} />
                    </FormControl>
                     <FormDescription>What are local customers buying?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="farmHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm History (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Grew corn last year with low yield. Good success with zucchini." {...field} />
                    </FormControl>
                    <FormDescription>Past crops and their performance.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Suggestions...
                  </>
                ) : (
                  "Get AI Suggestions"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Our AI is thinking...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in-50">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Suggested Crops</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.suggestedCrops}</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle>Reasoning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.reasoning}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
