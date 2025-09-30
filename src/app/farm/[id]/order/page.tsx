"use client"

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { farms, products as allProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { placeholderImages } from '@/lib/placeholder-images';

export default function OrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const { toast } = useToast();

  const farm = farms.find(f => f.id === params.id);
  const product = allProducts.find(p => p.id === productId);

  if (!farm || !product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className='text-2xl font-bold'>Not Found</h2>
        <p className='text-muted-foreground'>The requested farm or product could not be found.</p>
        <Link href="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const productImage = placeholderImages.find(p => product.imageUrl.includes(p.id));

  const handlePlaceOrder = () => {
    // Simulate placing order
    toast({
      title: "Order Placed!",
      description: "Your order has been sent to the farm.",
    });
    // Generate a unique order ID for the prototype
    const orderId = `order_${new Date().getTime()}`;
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div className='space-y-6'>
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={productImage?.imageHint || "product"} />
              </div>
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-muted-foreground">From {farm.name}</p>
                <p className="font-semibold text-accent text-lg">${product.price.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Separator className="my-6" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${product.price.toFixed(2)}</span>
          </div>
        </div>

        <div className='space-y-6'>
          <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
          <RadioGroup defaultValue="standard" className="space-y-4">
            <Label htmlFor="standard" className="flex items-start p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
              <RadioGroupItem value="standard" id="standard" className="mt-1" />
              <div className="ml-4">
                <span className="font-semibold">Standard Delivery</span>
                <p className="text-sm text-muted-foreground">A general selection of items, packed and shipped with care.</p>
              </div>
            </Label>
            <Label htmlFor="premium" className="flex items-start p-4 border rounded-md cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
              <RadioGroupItem value="premium" id="premium" />
              <div className="ml-4">
                <span className="font-semibold">Premium Hand-Picked</span>
                <p className="text-sm text-muted-foreground">The farmer will personally select the best quality items for your order.</p>
              </div>
            </Label>
          </RadioGroup>
          
          <Button onClick={handlePlaceOrder} className="w-full mt-8" size="lg">
            Place Order
          </Button>
          <Link href={`/farm/${farm.id}`}>
            <Button variant="outline" className="w-full mt-2">
              Back to Farm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
