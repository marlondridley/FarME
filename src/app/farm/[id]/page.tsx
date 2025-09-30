import { farms, products as allProducts } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Leaf, MapPin, Star, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';

export default function FarmPage({ params }: { params: { id: string } }) {
  const farm = farms.find(f => f.id === params.id);
  
  if (!farm) {
    notFound();
  }

  const farmProducts = allProducts.filter(p => farm.products.includes(p.id));
  const farmImage = placeholderImages.find(p => farm.logoUrl.includes(p.id));

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Farm Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-background shrink-0">
          <Image src={farm.logoUrl} alt={farm.name} fill className="object-cover" data-ai-hint={farmImage?.imageHint || "farm logo"} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold font-headline">{farm.name}</h1>
            <Button variant="outline" size="icon" className="rounded-full">
              <Heart className="w-5 h-5" />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{farm.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{farm.location.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Delivery & Pickup</span>
            </div>
          </div>
          <p className="mt-4 text-foreground/80">{farm.bio}</p>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold font-headline mb-6 flex items-center gap-2">
          <Leaf className="w-7 h-7 text-primary" />
          Fresh Products
        </h2>
        {farmProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {farmProducts.map(product => {
              const productImage = placeholderImages.find(p => product.imageUrl.includes(p.id));
              return (
                <Card key={product.id} className="overflow-hidden group flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={productImage?.imageHint || "product vegetable"} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <Badge variant="outline" className="mb-2 w-fit">{product.category}</Badge>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-accent mt-1">${product.price.toFixed(2)}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-grow">{product.description}</p>
                    <Link href={`/farm/${farm.id}/order?product=${product.id}`} className="mt-4">
                      <Button className="w-full">
                        Order Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )})}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">This farm has not listed any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
