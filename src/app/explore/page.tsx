
"use client";

import { useEffect, useState, useSearchParams, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2, AlertTriangle, LocateFixed } from 'lucide-react';
import FarmCard from '@/components/farm-card';
import { getExploreFarms } from '@/lib/data';
import type { Farm } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { geocode } from '@/ai/flows/geocode-flow';

function ExplorePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number, longitude: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleUseMyLocation = () => {
    setLoading(true);
    setLocationError(null);
    setError(null);
    setFarms([]);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setSearchQuery('');
          router.push('/explore');
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          setLocationError("Could not get your location. Please enable location services in your browser settings and refresh the page.");
          setLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const handleZipSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setCoords(null);
    setLocationError(null);
    setError(null);
    setFarms([]);
    
    try {
      const geo = await geocode({ zipCode: searchQuery.trim() });
      if (geo.latitude && geo.longitude) {
        setCoords({ latitude: geo.latitude, longitude: geo.longitude });
      } else {
        setLocationError("Could not find that zip code. Please try another one.");
        setLoading(false);
      }
    } catch(err) {
      console.error("Geocoding error", err);
      setLocationError("There was an issue looking up that zip code. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
      const form = new Event('submit', { cancelable: true, bubbles: true });
      // We need a synthetic event for the form submission.
      const syntheticEvent = {
        preventDefault: () => {},
        ...form
      } as unknown as React.FormEvent;
      handleZipSearch(syntheticEvent);
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch farms once we have location (or if auth state changes)
    if (authLoading || !coords) return;

    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      
      try {
          const fetchedFarms = await getExploreFarms(user, coords.latitude, coords.longitude);
          setFarms(fetchedFarms);
      } catch (error) {
          console.error("Failed to fetch farms:", error);
          setError("Could not fetch farm data. Please try again later. Ensure your USDA API key is set.");
      } finally {
          setLoading(false);
      }
    };
    
    fetchFarms();
  }, [user, authLoading, coords]);
  
  return (
    <div className="container mx-auto py-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
             <div>
                <h1 className="text-3xl font-bold font-headline">Farms & Markets</h1>
                <p className="text-muted-foreground">Discover fresh produce from local growers near you.</p>
             </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-8 p-2 rounded-lg border bg-card sticky top-16 z-20">
            <form onSubmit={handleZipSearch} className="flex-grow flex gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Enter a Zip Code..."
                        className="h-11 w-full pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="secondary" className="h-11" disabled={loading}>
                    <Search className="h-5 w-5 sm:hidden" />
                    <span className="hidden sm:inline">Search</span>
                </Button>
            </form>
            <Button onClick={handleUseMyLocation} className="h-11" disabled={loading}>
                <LocateFixed className="h-5 w-5 mr-2" />
                Use My Location
            </Button>
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
             {locationError && (
                 <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Location Error</AlertTitle>
                  <AlertDescription>
                    {locationError}
                  </AlertDescription>
                </Alert>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Finding farms...</p>
                </div>
            )}

            {!loading && !error && !locationError && farms.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg">
                    <MapPin className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold">No Farms Found</h3>
                    <p className="text-muted-foreground max-w-md">We couldn't find any farms for this location. Try a different zip code or use your current location.</p>
                </div>
            )}
            
            {!loading && farms.length > 0 && (
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
              </>
            )}
          </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-primary"/></div>}>
        <ExplorePageContent />
    </Suspense>
  )
}
