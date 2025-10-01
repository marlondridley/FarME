
import type { Farm, Product } from './types';
import { placeholderImages } from './placeholder-images';
import { getFarms as getFarmsFromDb } from './database';

const getImageUrl = (id: string) => placeholderImages.find(p => p.id === id)?.imageUrl || 'https://placehold.co/400x300';

export const products: Product[] = [
  {
    id: 'heirloom-tomatoes',
    name: 'Heirloom Tomatoes',
    farmId: 'green-valley-greens',
    imageUrl: getImageUrl('product-tomatoes'),
    price: 4.99,
    category: 'Vegetables',
    description: 'Juicy, flavorful heirloom tomatoes, perfect for salads and sauces. Variety of colors and sizes.'
  },
  {
    id: 'green-lettuce',
    name: 'Green Leaf Lettuce',
    farmId: 'green-valley-greens',
    imageUrl: getImageUrl('product-lettuce'),
    price: 2.50,
    category: 'Vegetables',
    description: 'Crisp and fresh green leaf lettuce, grown organically without pesticides.'
  },
  {
    id: 'free-range-eggs',
    name: 'Free-Range Eggs',
    farmId: 'sunrise-eggs',
    imageUrl: getImageUrl('product-eggs'),
    price: 6.00,
    category: 'Dairy & Eggs',
    description: 'A dozen of our finest free-range brown and white eggs.'
  },
  {
    id: 'wildflower-honey',
    name: 'Wildflower Honey',
    farmId: 'honeybee-meadows',
    imageUrl: getImageUrl('product-honey'),
    price: 12.00,
    category: 'Pantry',
    description: 'Pure, raw wildflower honey. Unfiltered and full of natural goodness.'
  },
  {
    id: 'fresh-strawberries',
    name: 'Fresh Strawberries',
    farmId: 'riverside-market',
    imageUrl: getImageUrl('product-strawberries'),
    price: 5.50,
    category: 'Fruits',
    description: 'Sweet and juicy strawberries, picked at the peak of ripeness.'
  },
  {
    id: 'organic-zucchini',
    name: 'Organic Zucchini',
    farmId: 'riverside-market',
    imageUrl: getImageUrl('product-zucchini'),
    price: 3.00,
    category: 'Vegetables',
    description: 'Versatile and delicious organic zucchini, great for grilling or baking.'
  }
];

export const farms: Farm[] = [
    {
        id: 'green-valley-greens',
        name: 'Green Valley Greens',
        logoUrl: getImageUrl('farm-logo-1'),
        heroUrl: getImageUrl('farm-hero-1'),
        bio: 'Specializing in organic leafy greens and heirloom vegetables.',
        location: {
            address: '123 Green Valley Rd, Organica, CA',
            geopoint: { latitude: 34.0522, longitude: -118.2437 } as any,
        },
        products: ['heirloom-tomatoes', 'green-lettuce'],
        type: 'farm',
        rating: 4.8,
    },
    {
        id: 'sunrise-eggs',
        name: 'Sunrise Eggs',
        logoUrl: getImageUrl('farm-logo-2'),
        heroUrl: getImageUrl('farm-hero-2'),
        bio: 'The freshest free-range eggs, from happy chickens.',
        location: {
            address: '456 Chicken Run, Cluckington, CA',
            geopoint: { latitude: 34.0522, longitude: -118.2437 } as any,
        },
        products: ['free-range-eggs'],
        type: 'farm',
        rating: 4.9,
    },
    {
        id: 'honeybee-meadows',
        name: 'Honeybee Meadows',
        logoUrl: getImageUrl('farm-logo-3'),
        heroUrl: getImageUrl('farm-hero-3'),
        bio: 'Artisanal honey from local wildflowers. As pure as it gets.',
        location: {
            address: '789 Nectar Ln, Buzzville, CA',
            geopoint: { latitude: 34.0522, longitude: -118.2437 } as any,
        },
        products: ['wildflower-honey'],
        type: 'vendor',
        rating: 4.7,
    },
    {
        id: 'riverside-market',
        name: 'Riverside Community Market',
        logoUrl: getImageUrl('farm-logo-4'),
        heroUrl: getImageUrl('farm-hero-4'),
        bio: 'A collective of local growers and artisans. Your one-stop shop for local goodness.',
        location: {
            address: '101 Market St, Riverside, CA',
            geopoint: { latitude: 34.0522, longitude: -118.2437 } as any,
        },
        products: ['fresh-strawberries', 'organic-zucchini'],
        type: 'market',
        rating: 4.6,
    }
];

export async function getFarms(): Promise<Farm[]> {
    const farms = await getFarmsFromDb();
    
    if (farms.length === 0) {
        // Return static data if the database is empty, so the app is still usable.
        return staticFarmsWithImages;
    }

    return farms.map((farm, index) => {
        const logoUrlId = `farm-logo-${(index % 4) + 1}`;
        const heroUrlId = `farm-hero-${(index % 4) + 1}`;
        return {
            ...farm,
            logoUrl: getImageUrl(logoUrlId),
            heroUrl: getImageUrl(heroUrlId),
        }
    });
}


export async function getFarmById(id: string): Promise<Farm | null> {
    if (!id) return null;
    
    // In a real app, this would fetch a single document from Firestore.
    // For now, we'll find it in the list we get from the DB.
    const allFarms = await getFarms();
    
    let farm = allFarms.find(f => f.id === id);

    // Fallback to static data if not found in DB results
    if (!farm) {
      farm = staticFarmsWithImages.find(f => f.id === id);
    }
    
    if (farm) {
        // Enhance the found farm with a richer product list for the detail page.
        farm.products = ['heirloom-tomatoes', 'green-lettuce', 'fresh-strawberries', 'organic-zucchini', 'free-range-eggs', 'wildflower-honey'];
        return farm;
    }

    return null;
}

// Add images to static farm data
const staticFarmsWithImages = farms.map((farm, index) => {
    const logoUrlId = `farm-logo-${(index % 4) + 1}`;
    const heroUrlId = `farm-hero-${(index % 4) + 1}`;
    return {
        ...farm,
        logoUrl: getImageUrl(logoUrlId),
        heroUrl: getImageUrl(heroUrlId),
    }
});
