import Link from 'next/link';
import Image from 'next/image';
import { type Farm } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Tent, Building } from 'lucide-react';
import { Badge } from './ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';

export default function FarmCard({ farm }: { farm: Farm }) {
  const farmImage = placeholderImages.find(p => farm.logoUrl.includes(p.id));

  const TypeIcon = farm.type === 'farm' ? Building : farm.type === 'market' ? Tent : MapPin;

  return (
    <Link href={`/farm/${farm.id}`} className="block px-4">
      <Card className="bg-transparent border-0 border-b rounded-none shadow-none hover:bg-muted/30">
        <CardContent className="p-4 flex gap-4 items-start">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
            <Image 
              src={farm.logoUrl} 
              alt={farm.name} 
              fill 
              className="object-cover" 
              data-ai-hint={farmImage?.imageHint || "farm logo"}
            />
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold text-lg">{farm.name}</h3>
            <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>{farm.bio}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className='flex items-center gap-1'>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>{farm.rating.toFixed(1)}</span>
              </div>
              <div className='flex items-center gap-1'>
                <MapPin className="w-4 h-4" />
                <span>{farm.distance} km</span>
              </div>
               <div className='flex items-center gap-1 capitalize'>
                <TypeIcon className='w-4 h-4' />
                <span>{farm.type}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
