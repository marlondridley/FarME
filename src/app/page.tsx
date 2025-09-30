import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MapPin, Search, SlidersHorizontal, ChevronUp } from 'lucide-react';
import { farms } from '@/lib/data';
import FarmCard from '@/components/farm-card';
import { placeholderImages } from '@/lib/placeholder-images';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';

// A helper for map pins
const MapPinButton = ({ top, left, name, farmId }: { top: string, left: string, name: string, farmId: string }) => (
  <div className="absolute z-10" style={{ top, left, transform: 'translate(-50%, -50%)' }}>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 shadow-md border-2 border-white">
            <MapPin className="w-5 h-5 text-accent fill-accent" />
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
      {/* Map Background */}
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

      {/* Map Overlay for slight darkness */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Top Search/Filter Bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10">
        <Card className="bg-background/80 backdrop-blur-sm shadow-lg p-2 flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for strawberries, honey, eggs..." className="pl-10 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
          </div>
          <Select>
            <SelectTrigger className="w-[120px] shrink-0">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </Card>
      </div>

      {/* Farm Pins on Map */}
      <MapPinButton top="30%" left="40%" name="Green Valley Greens" farmId="green-valley-greens" />
      <MapPinButton top="50%" left="60%" name="Sunrise Eggs" farmId="sunrise-eggs" />
      <MapPinButton top="65%" left="35%" name="Honeybee Meadows" farmId="honeybee-meadows" />
      <MapPinButton top="45%" left="25%" name="Riverside Farmers Market" farmId="riverside-market" />

      {/* Bottom Sliding Panel */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 shadow-lg rounded-full h-12 px-6"
            variant="secondary"
          >
            <ChevronUp className="mr-2 h-5 w-5" />
            Show Nearby Farms
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[75vh] flex flex-col rounded-t-lg">
          <SheetHeader>
            <SheetTitle className="text-center text-xl">Farms & Markets Near You</SheetTitle>
          </SheetHeader>
          <div className="flex-grow overflow-auto p-4 space-y-4">
            {farms.map(farm => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
