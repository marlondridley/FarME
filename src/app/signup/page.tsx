
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const consumerFeatures = [
  "Access to all local farms and markets",
  "Real-time product availability",
  "Easy in-app ordering",
  "Support local agriculture",
];

const farmerFeatures = [
  "List your farm and products",
  "Reach new local customers",
  "Manage orders and inventory",
];


export default function SignupPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline tracking-tight">Choose Your Path</h1>
        <p className="mt-4 text-lg text-muted-foreground">Join our community of local food lovers and producers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Consumer Card */}
        <Card className="flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Consumer</CardTitle>
            <CardDescription>Find and buy fresh produce from local farms.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="text-center my-4">
              <span className="text-5xl font-bold">$12</span>
              <span className="text-muted-foreground">/year</span>
            </div>
            <ul className="space-y-3 text-sm flex-grow">
              {consumerFeatures.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
             <Button size="lg" className="w-full mt-8" asChild>
                <Link href="/register">Sign Up as a Consumer</Link>
             </Button>
          </CardContent>
        </Card>

        {/* Farmer Card */}
        <Card className="border-primary/50 ring-2 ring-primary/20 flex flex-col">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Farmer</CardTitle>
            <CardDescription>Sell your products directly to your community.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <div className="text-center my-4">
              <span className="text-5xl font-bold">$24</span>
              <span className="text-muted-foreground">/year</span>
            </div>
            <ul className="space-y-3 text-sm flex-grow">
               {farmerFeatures.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full mt-8" asChild>
                <Link href="/register">Sign Up as a Farmer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
