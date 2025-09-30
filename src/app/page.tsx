import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Search, SlidersHorizontal, ChevronUp, History } from 'lucide-react';
import { farms } from '@/lib/data';
import FarmCard from '@/components/farm-card';
import { placeholderImages } from '@/lib/placeholder-images';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';

const MapPinButton = ({ top, left, name, farmId }: { top: string, left: string, name: string, farmId: string }) => (
  <div className="absolute z-10" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 shadow-md border-2 border-white">
            <MapPin className="w-5 h-5 text-primary fill-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default function Home() {
  const mapImage = placeholderImages.find(p => p.id === 'map-background');

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      {mapImage && (
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          data-ai-hint={mapImage.imageHint}
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for farms, food, or products"
            className="w-full rounded-full bg-card/80 backdrop-blur-sm h-14 pl-12 pr-4 text-lg border-2 border-card"
          />
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <Button variant="secondary" size="icon" className="rounded-full h-14 w-14">
            <History className="h-6 w-6" />
        </Button>
        <Button variant="secondary" size="icon" className="rounded-full h-14 w-14">
            <SlidersHorizontal className="h-6 w-6" />
        </Button>
      </div>


      <MapPinButton top="30%" left="40%" name="Green Valley Greens" farmId="green-valley-greens" />
      <MapPinButton top="50%" left="60%" name="Sunrise Eggs" farmId="sunrise-eggs" />
      <MapPinButton top="65%" left="35%" name="Honeybee Meadows" farmId="honeybee-meadows" />
      <MapPinButton top="45%" left="25%" name="Riverside Farmers Market" farmId="riverside-market" />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full h-12 px-6"
            variant="default"
          >
            <ChevronUp className="mr-2 h-5 w-5" />
            Show Nearby Farms
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[75vh] flex flex-col rounded-t-2xl bg-background border-t-0">
           <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-12 rounded-full bg-muted-foreground/50" />
          <SheetHeader className="pt-4">
            <SheetTitle className="text-center text-xl">Farms & Markets Near You</SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-auto p-4 space-y-4 -mx-4">
            {farms.map(farm => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
