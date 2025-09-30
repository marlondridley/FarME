import type { Farm, Product } from './types';
import { placeholderImages } from './placeholder-images';
import { getUsdaFarms } from './usda';

const getImageUrl = (id: string) => placeholderImages.find(p => p.id === id)?.imageUrl || 'https://placehold.co/400x300';

// This is now fetched from the USDA API in the page components.
export const farms: Farm[] = [];

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

export async function getFarms(options: {x: number, y: number, radius: number}): Promise<Farm[]> {
    const usdaFarms = await getUsdaFarms(options);

    const farmData: Farm[] = usdaFarms.map((usdaFarm, index) => {
        const farmId = usdaFarm.listing_id || `${usdaFarm.listing_name.replace(/\s+/g, '-').toLowerCase()}-${index}`;

        let type: 'farm' | 'market' | 'vendor' = 'vendor';
        if (usdaFarm.directory === 'farmersmarket') {
            type = 'market';
        } else if (usdaFarm.directory === 'agritourism' || usdaFarm.directory === 'onfarmmarket' || usdaFarm.directory === 'csa') {
            type = 'farm';
        }
        
        const logoUrlId = `farm-logo-${(index % 4) + 1}`;
        const heroUrlId = `farm-hero-${(index % 4) + 1}`;
        
        const distanceNumber = parseFloat(usdaFarm.distance as any);

        return {
            id: farmId,
            name: usdaFarm.listing_name,
            bio: usdaFarm.listing_description || 'A local food provider.',
            location: {
                lat: usdaFarm.location_y,
                lng: usdaFarm.location_x,
                address: `${usdaFarm.location_city}, ${usdaFarm.location_state}`,
            },
            products: ['heirloom-tomatoes', 'green-lettuce'], // Sample products
            type: type,
            rating: Math.random() * (5 - 3.5) + 3.5, // Random rating between 3.5 and 5
            distance: !isNaN(distanceNumber) ? parseFloat(distanceNumber.toFixed(1)) : 0,
            logoUrl: getImageUrl(logoUrlId),
            heroUrl: getImageUrl(heroUrlId),
        };
    });

    return farmData;
}

export async function getFarmById(id: string): Promise<Farm | null> {
    // In a real application, you would fetch this from your database.
    // For now, we'll simulate it by creating a mock farm object.
    // We can't use getFarms because that requires coordinates.
    
    // Simple mock to ensure the page renders
    if (id) {
        const randomImageId = Math.floor(Math.random() * 4) + 1;
        return {
            id: id,
            name: "The Bountiful Harvest",
            bio: "Serving the community with fresh, organic produce for over 20 years. We believe in sustainable farming and healthy living.",
            location: {
                lat: 38.5816,
                lng: -121.4944,
                address: "Sacramento, CA",
            },
            products: ['heirloom-tomatoes', 'green-lettuce', 'fresh-strawberries', 'organic-zucchini'],
            type: 'farm',
            rating: 4.8,
            distance: 12.5,
            logoUrl: getImageUrl(`farm-logo-${randomImageId}`),
            heroUrl: getImageUrl(`farm-hero-${randomImageId}`),
        };
    }

    return null;
}
