import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Send, ShoppingBasket, Truck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const timelineEvents = [
  { icon: ShoppingBasket, title: 'Order Placed', description: 'We have received your order.', status: 'completed' },
  { icon: Package, title: 'Order Accepted', description: 'The farm is preparing your items.', status: 'completed' },
  { icon: Send, title: 'Order Shipped', description: 'Your order is on its way!', status: 'active' },
  { icon: Truck, title: 'Delivered', description: 'Your fresh produce has arrived.', status: 'pending' },
  { icon: Wallet, title: 'Payment', description: 'Pay upon delivery or pickup.', status: 'pending'},
];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Track Your Order</CardTitle>
          <CardDescription>Order ID: #{params.id.replace('order_', '')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:w-0.5 before:bg-border before:left-11">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex z-10 items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    event.status === 'completed' ? 'bg-primary' : event.status === 'active' ? 'bg-accent' : 'bg-muted border'
                  }`}>
                    <event.icon className={`w-5 h-5 ${
                      event.status === 'completed' ? 'text-primary-foreground' : event.status === 'active' ? 'text-accent-foreground' : 'text-muted-foreground'
                    }`} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
