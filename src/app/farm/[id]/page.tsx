import { farms, products as allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Leaf, MapPin, Star, Truck, Info, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';

export default function FarmPage({ params }: { params: { id: string } }) {
  const farm = farms.find(f => f.id === params.id);
  
  if (!farm) {
    notFound();
  }

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
                <div className="flex items-center gap-1">
                  <span>{farm.distance} km away</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-border" />
                 <div className="flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  <span>Info</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full w-12 h-12 shrink-0">
              <Heart className="w-6 h-6" />
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
                      <p className="text-md font-medium text-foreground mt-2">${product.price.toFixed(2)}</p>
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
