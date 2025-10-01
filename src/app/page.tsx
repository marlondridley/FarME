
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { placeholderImages } from '@/lib/placeholder-images';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const featureCards = [
    {
        icon: Search,
        title: "Discover Local Farms",
        description: "Find a variety of farms, from sprawling fields to cozy downtown market stalls.",
    },
    {
        icon: Star,
        title: "Find Top-Rated Produce",
        description: "Read reviews and find the best-rated farms and products near you.",
    },
    {
        icon: ShoppingCart,
        title: "Order with Ease",
        description: "Place orders directly in the app for pickup or local delivery.",
    }
]

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/explore');
        }
    };

    const screenshotPlaceholders = [
        placeholderImages.find(p => p.id === 'farm-hero-1'),
        placeholderImages.find(p => p.id === 'farm-hero-4'),
        placeholderImages.find(p => p.id === 'product-strawberries'),
        placeholderImages.find(p => p.id === 'farmers-market-stall'),
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <section className="relative flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-background to-secondary/20">
                <div
                    className="absolute inset-0 z-0 bg-grid-slate-100/10 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
                <div className="z-10">
                    <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tighter">
                        From Farm to Your Table
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Discover the freshest produce from local farms and markets right in your community. Support local, eat fresh.
                    </p>
                    <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                            <Input
                                id="search"
                                name="search"
                                placeholder="Search by zip code..."
                                className="w-full h-12 pl-10 pr-4 text-base rounded-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full sm:w-auto h-12">
                            Find Farms
                            <ArrowRight className="ml-2"/>
                        </Button>
                    </form>
                </div>
            </section>

            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featureCards.map(feature => (
                             <Card key={feature.title} className="text-center p-6 bg-card/50">
                                <div className="flex justify-center mb-4">
                                     <div className="p-4 bg-primary/10 rounded-full">
                                        <feature.icon className="w-8 h-8 text-primary"/>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="py-16 px-4 bg-secondary/20">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">A Glimpse of FarmFinder</h2>
                     <Carousel opts={{ loop: true }} className="max-w-3xl mx-auto">
                        <CarouselContent>
                            {screenshotPlaceholders.map((img, index) => (
                                <CarouselItem key={index}>
                                    <Card className="overflow-hidden">
                                        <CardContent className="p-0">
                                            {img && (
                                                <Image
                                                    src={img.imageUrl}
                                                    alt={img.description}
                                                    width={1200}
                                                    height={675}
                                                    className="aspect-video object-cover"
                                                    data-ai-hint={img.imageHint}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="ml-16"/>
                        <CarouselNext className="mr-16"/>
                    </Carousel>
                </div>
            </section>
        </div>
    );
}
