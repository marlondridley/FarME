
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
import { ArrowLeft, Minus, Plus, Loader2 } from 'lucide-react';
import React from 'react';
import { processOrder } from '@/ai/flows/process-order-flow';

export default function OrderPage({ params }: { params: { id: string } }) {
  const farmId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(1);
  const [loading, setLoading] = React.useState(false);


  const farm = farms.find(f => f.id === farmId);
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
  const total = product.price * quantity;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const result = await processOrder({
        farmName: farm.name,
        productName: product.name,
        quantity: quantity,
        total: total,
      });

      console.log("Farmer Notification:", result.farmerNotification);

      toast({
        title: "Order Placed!",
        description: `Your order for ${quantity}x ${product.name} has been sent to ${farm.name}.`,
      });
      
      const orderId = result.orderId.replace('ord_', 'order_');
      router.push(`/orders/${orderId}`);

    } catch (error) {
      console.error("Order processing error:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-card flex flex-col">
       <div className="flex-grow container mx-auto py-8 px-4 max-w-lg">
        <Link href={`/farm/${farm.id}`} className="mb-6 inline-block">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="space-y-6">
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={productImage?.imageHint || "product"} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.description}</p>
          </div>

          <Separator />
          
           <div>
            <h2 className="text-lg font-semibold mb-2">Delivery Options</h2>
             <RadioGroup defaultValue="standard" className="space-y-3">
              <Label htmlFor="standard" className="flex items-start p-4 bg-background rounded-md cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary border-2 border-transparent transition-colors">
                <RadioGroupItem value="standard" id="standard" className="mt-1" />
                <div className="ml-4">
                  <span className="font-semibold">Standard Delivery</span>
                  <p className="text-sm text-muted-foreground">A general selection of items, packed and shipped with care.</p>
                </div>
              </Label>
              <Label htmlFor="premium" className="flex items-start p-4 bg-background rounded-md cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary border-2 border-transparent transition-colors">
                <RadioGroupItem value="premium" id="premium" />
                <div className="ml-4">
                  <span className="font-semibold">Premium Hand-Picked</span>
                  <p className="text-sm text-muted-foreground">The farmer will personally select the best quality items for your order.</p>
                </div>
              </Label>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 bg-card border-t p-4">
         <div className="container mx-auto max-w-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQuantity(q => Math.max(1, q-1))} disabled={quantity <= 1}>
                    <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                 <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQuantity(q => q + 1)}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
          <Button onClick={handlePlaceOrder} className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              `Add to Order - $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
