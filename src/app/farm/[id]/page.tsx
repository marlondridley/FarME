
"use client";

import { getFarmById, products as allProducts } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Leaf, MapPin, Star, Truck, Info, ArrowLeft, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Farm } from '@/lib/types';

export default function FarmPage({ params: { id } }: { params: { id: string } }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarm = async () => {
      setLoading(true);
      const fetchedFarm = await getFarmById(id);
      setFarm(fetchedFarm); // This can be null if not found
      setLoading(false);
    };

    fetchFarm();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!farm) {
    return (
       <div className="container mx-auto py-10 text-center">
        <h2 className='text-2xl font-bold'>Farm Not Found</h2>
        <p className='text-muted-foreground'>The farm you are looking for does not exist.</p>
        <Link href="/explore">
          <Button className="mt-4">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  const handleFavoriteClick = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'You need to be logged in to favorite a farm.',
      });
      return;
    }
    // Here you would typically update the database
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? 'Removed from Favorites' : 'Added to Favorites',
      description: `${farm.name} has been ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const farmProducts = allProducts.filter(p => farm.products.includes(p.id));
  const heroImage = placeholderImages.find(p => farm.heroUrl.includes(p.id));

  return (
    <div className="pb-8">
      <div className="relative h-48 md:h-64 w-full">
         {heroImage && (
          <Image src={heroImage.imageUrl} alt={farm.name} fill className="object-cover" data-ai-hint={heroImage.imageHint} priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <Link href="/" className="absolute top-4 left-4 z-10">
          <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="container -mt-16 sm:-mt-20 md:-mt-24 z-10 relative px-4">
        <Card className="p-6 pt-10 sm:pt-6 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-grow">
              <h1 className="text-4xl font-bold">{farm.name}</h1>
              <p className="mt-2 text-muted-foreground">{farm.bio}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground mt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{farm.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">(500+ ratings)</span>
                </div>
                 <Separator orientation="vertical" className="h-4 bg-border" />
                 {farm.distance && (
                    <div className="flex items-center gap-1">
                        <span>{farm.distance.toFixed(1)} km away</span>
                    </div>
                 )}
              </div>
            </div>
            <Button onClick={handleFavoriteClick} variant="outline" size="icon" className="rounded-full w-12 h-12 shrink-0">
              <Heart className={cn("w-6 h-6 transition-colors", isFavorited && "fill-red-500 text-red-500")} />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Products Section */}
      <div className="container mt-8 px-4">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          All Products
        </h2>
        {farmProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {farmProducts.map(product => {
              const productImage = placeholderImages.find(p => product.imageUrl.includes(p.id));
              return (
                <Link key={product.id} href={`/farm/${farm.id}/order?product=${product.id}`} className="block group">
                  <Card className="bg-transparent border-0 shadow-none flex gap-4 items-start">
                    <CardContent className="p-0 flex-grow">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                      <p className="text-md font-medium text-foreground mt-2">$${product.price.toFixed(2)}</p>
                    </CardContent>
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-md overflow-hidden shrink-0">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={productImage?.imageHint || "product vegetable"} />
                    </div>
                  </Card>
                </Link>
              )})}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg bg-card">
            <p className="text-muted-foreground">This farm has not listed any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
