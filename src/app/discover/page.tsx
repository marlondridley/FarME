"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  discoverProduce,
  type DiscoverProduceInput,
  type DiscoverProduceOutput,
} from "@/ai/flows/discover-produce-flow";
import {
  getRecipeSuggestions,
  type GetRecipeSuggestionsOutput
} from "@/ai/flows/get-recipe-suggestions-flow";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, ChefHat } from "lucide-react";

const formSchema = z.object({
  geographicArea: z.string().min(3, "Please enter your geographic area."),
  timeOfYear: z.string().min(3, "Please enter a valid time of year (e.g., Spring)."),
  tastePreferences: z.string().min(10, "Please describe your taste preferences in a bit more detail."),
  cookingHabits: z.string().optional(),
});

export default function DiscoverProducePage() {
  const [produceLoading, setProduceLoading] = useState(false);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [produceResult, setProduceResult] = useState<DiscoverProduceOutput | null>(null);
  const [recipeResult, setRecipeResult] = useState<GetRecipeSuggestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      geographicArea: "",
      timeOfYear: "",
      tastePreferences: "",
      cookingHabits: "",
    },
  });

  const onProduceSubmit: SubmitHandler<DiscoverProduceInput> = async (data) => {
    setProduceLoading(true);
    setProduceResult(null);
    setRecipeResult(null);
    try {
      const response = await discoverProduce(data);
      setProduceResult(response);
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get suggestions. Please try again.",
      });
    } finally {
      setProduceLoading(false);
    }
  };

  const onRecipeSubmit = async () => {
    if (!produceResult) return;

    setRecipeLoading(true);
    setRecipeResult(null);
    try {
      const response = await getRecipeSuggestions({ produce: produceResult.suggestedProducts });
      setRecipeResult(response);
    } catch (error) {
      console.error("Recipe suggestion error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get recipe ideas. Please try again.",
      });
    } finally {
      setRecipeLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <div className="flex items-center gap-4 mb-4">
        <Sparkles className="w-10 h-10 text-primary" />
        <div>
            <h1 className="text-3xl font-bold font-headline">Discover Local Produce</h1>
            <p className="text-muted-foreground mt-1">
                Let our AI guide you to the best seasonal food in your area.
            </p>
        </div>
      </div>
     

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>What are you looking for?</CardTitle>
          <CardDescription>Tell us a bit about your tastes, and we'll suggest something new to try.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onProduceSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="geographicArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, California" {...field} />
                    </FormControl>
                     <FormDescription>This helps us find what's local to you.</FormDescription>
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
                      <Input placeholder="e.g., Early Summer" {...field} />
                    </FormControl>
                     <FormDescription>So we can recommend what's in season.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tastePreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tastes & Flavors You Enjoy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I love sweet fruits, tangy citrus, and leafy greens." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cookingHabits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How You Like to Cook (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., I usually make quick salads, but enjoy grilling on weekends." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={produceLoading} size="lg">
                {produceLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finding Recommendations...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {produceLoading && (
        <div className="text-center p-8 mt-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Our AI is searching for the best local produce...</p>
        </div>
      )}

      {produceResult && (
        <div className="space-y-6 animate-in fade-in-50 mt-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Here's What We Found For You</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap font-medium">{produceResult.suggestedProducts}</p>
            </CardContent>
          </Card>
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle>Why You Might Like It</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{produceResult.reasoning}</p>
            </CardContent>
          </Card>
          
          {!recipeResult && (
            <div className="text-center py-4">
              <Button onClick={onRecipeSubmit} disabled={recipeLoading} size="lg">
                {recipeLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recipes...
                  </>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-5 w-5" />
                    Get Recipe Ideas
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {recipeLoading && (
        <div className="text-center p-8 mt-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Thinking of some delicious recipes...</p>
        </div>
      )}

      {recipeResult && (
        <div className="mt-8 animate-in fade-in-50">
          <Card className="bg-accent/10 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat />
                  Recipe Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">{recipeResult.recipes}</p>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
