
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Search, SlidersHorizontal, ChevronUp, History, Loader2, AlertTriangle } from 'lucide-react';
import FarmCard from '@/components/farm-card';
import { getFarms } from '@/lib/data';
import type { Farm } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedFarms = await getFarms();
        setFarms(fetchedFarms);
      } catch (error) {
        console.error("Failed to fetch farms:", error);
        setError("Could not fetch farm data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1543487995-1c392b54c599?w=800&q=80"
          alt="A stylized, light-colored map with a street grid."
          data-ai-hint="map pattern"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/20 dark:bg-black/30" />
      </div>


      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="search"
            name="search"
            placeholder="Search for farms, food, or products"
            className="w-full rounded-full bg-background/80 backdrop-blur-sm h-14 pl-12 pr-4 text-lg border-2 border-border"
          />
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 shadow-md">
            <History className="h-6 w-6" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 shadow-md">
            <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <ChevronUp className="mr-2 h-5 w-5" />
            Show Nearby Farms
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[75vh] flex flex-col rounded-t-2xl bg-background border-t-0 shadow-2xl">
           <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-muted-foreground/50" />
          <SheetHeader className="pt-4">
            <SheetTitle className="text-center text-xl">Farms & Markets Near You</SheetTitle>

          </SheetHeader>
          <div className="flex-grow overflow-auto p-4 space-y-4 -mx-4">
            {error && (
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Finding farms near you...</p>
                </div>
            ) : (
              <>
                {(user ? farms : farms.slice(0, 3)).map(farm => (
                  <FarmCard key={farm.id} farm={farm} isGuest={!user} />
                ))}
                {!user && farms.length > 0 && (
                  <div className="p-4 text-center bg-muted/50 rounded-lg">
                    <h3 className="font-semibold">Want to see more?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Create an account to view all local farms and unlock exclusive features.</p>
                    <Button asChild>
                      <Link href="/signup">Sign Up Now</Link>
                    </Button>
                  </div>
                )}
                 {farms.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold">No Farms Found</h3>
                        <p className="text-muted-foreground">We couldn't find any farms in our database. Once data is added, it will appear here.</p>
                    </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
