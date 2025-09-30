import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Payment Integration</CardTitle>
          <CardDescription>
            Connect a payment provider to accept online payments. Currently, only "Pay on Delivery" is supported.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-md bg-muted/50">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
                <div>
                    <h3 className="font-semibold">Stripe (Coming Soon)</h3>
                    <p className="text-sm text-muted-foreground">
                        Allow customers to pay online with credit cards.
                    </p>
                </div>
                <Button variant="secondary" disabled className="ml-auto">Connect</Button>
            </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
          <CardDescription>
            Product management is not yet available. Products are currently managed via a static list.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="border rounded-md p-8 text-center text-muted-foreground bg-muted/50">
                <p>Backend product management coming soon!</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
