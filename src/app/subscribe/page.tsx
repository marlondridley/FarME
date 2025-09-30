
"use client";

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Check } from 'lucide-react';
import Purchases from '@revenuecat/purchases-js';

const plans = {
  consumer: {
    name: "Consumer Plan",
    price: "$12",
    period: "per year",
    features: [
        "Access to all local farms and markets",
        "Real-time product availability",
        "Easy in-app ordering",
        "Support local agriculture",
    ],
    // TODO: Replace with your actual RevenueCat Package ID
    revenueCatPackageId: "consumer_yearly", 
  },
  farmer: {
    name: "Farmer Plan",
    price: "$24",
    period: "per year",
    features: [
        "List your farm and products",
        "Reach new local customers",
        "Manage orders and inventory",
    ],
    // TODO: Replace with your actual RevenueCat Package ID
    revenueCatPackageId: "farmer_yearly",
  },
};

function SubscribeComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const role = searchParams.get('role') as keyof typeof plans;
  
  const plan = role && plans[role] ? plans[role] : null;

  const handleSubscription = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Logged In",
            description: "You must be logged in to subscribe.",
        });
        router.push('/login');
        return;
    }
    if (!plan) {
        toast({
            variant: "destructive",
            title: "Invalid Plan",
            description: "No subscription plan was selected.",
        });
        router.push('/signup');
        return;
    }

    toast({
      title: "Redirecting to payment...",
      description: "You will be redirected to complete your purchase.",
    });

    // --- RevenueCat Integration Placeholder ---
    // 1. Initialize Purchases with your API key
    //    (this should be done once when your app loads)
    //    Purchases.setDebugLogsEnabled(true);
    //    Purchases.configure({ apiKey: "YOUR_REVENUECAT_API_KEY" });
    //
    // 2. Identify the user
    //    await Purchases.logIn(user.uid);
    //
    // 3. Fetch offerings and make a purchase
    // try {
    //   const offerings = await Purchases.getOfferings();
    //   const packages = offerings.all[plan.revenueCatPackageId];
    //   if (packages && packages.length > 0) {
    //     const purchaseResult = await Purchases.purchasePackage(packages[0]);
    //     // Check purchaseResult.customerInfo.entitlements.active for active subscription
    //     toast({ title: "Purchase Successful!" });
    //     router.push('/');
    //   }
    // } catch (e: any) {
    //   if (!e.userCancelled) {
    //     toast({ variant: "destructive", title: "Purchase Failed", description: e.message });
    //   }
    // }
    // --- End Placeholder ---

    // Simulating a successful payment for now
    setTimeout(() => {
        router.push('/');
    }, 2000);
  };
  
  if (!plan) {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading subscription details...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Subscription</CardTitle>
          <CardDescription>
            You've selected the {plan.name}. Please confirm your selection below.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border bg-muted/30 rounded-lg p-6 mb-6">
                 <div className="text-center">
                    <p className="text-lg font-semibold">{plan.name}</p>
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 text-sm mt-6">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Button onClick={handleSubscription} className="w-full" size="lg">
                Proceed to Payment
            </Button>
            <Button variant="link" className="w-full mt-2" onClick={() => router.back()}>
                Choose a different plan
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscribePage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-primary"/></div>}>
            <SubscribeComponent />
        </Suspense>
    )
}
