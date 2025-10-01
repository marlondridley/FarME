

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Search, SlidersHorizontal, History, Loader2, AlertTriangle } from 'lucide-react';
import FarmCard from '@/components/farm-card';
import { getExploreFarms } from '@/lib/data';
import type { Farm } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch until auth state is resolved
    if (authLoading) return;

    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      try {
        // A real app would use geolocation. For now, we'll use a default.
        // We pass the user object to determine which data source to use.
        const fetchedFarms = await getExploreFarms(user, 34.0522, -118.2437); // Los Angeles
        setFarms(fetchedFarms);
      } catch (error) {
        console.error("Failed to fetch farms:", error);
        setError("Could not fetch farm data. Please try again later. Ensure your USDA API key is set.");
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, [user, authLoading]);
  
  return (
    <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
             <div>
                <h1 className="text-3xl font-bold font-headline">Farms & Markets</h1>
                <p className="text-muted-foreground">Discover fresh produce from local growers near you.</p>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" size="icon">
                    <History className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>

        <div className="space-y-4">
            {error && (
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
            )}

            {loading || authLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Finding farms near you...</p>
                </div>
            ) : (
              <>
                {farms.map(farm => (
                  <FarmCard key={farm.id} farm={farm} />
                ))}
                {!user && farms.length > 3 && (
                  <div className="p-6 text-center bg-muted/50 rounded-lg">
                    <h3 className="font-semibold">Want to see more?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create an account to view all local farms and unlock exclusive features.</p>
                    <Button asChild>
                      <Link href="/signup">Sign Up Now</Link>
                    </Button>
                  </div>
                )}
                 {farms.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg">
                        <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold">No Farms Found</h3>
                        <p className="text-muted-foreground">We couldn't find any farms in our database. Once data is added, it will appear here.</p>
                    </div>
                )}
              </>
            )}
          </div>
    </div>
  );
}
