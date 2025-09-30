
import type { Farm, Product } from './types';
import { placeholderImages } from './placeholder-images';
import { getFarmsFromFirestore } from './database';

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

export async function getFarms(): Promise<Farm[]> {
    const farms = await getFarmsFromFirestore();
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

    const allFarms = await getFarms();
    
    let farm = allFarms.find(f => f.id === id);

    if (farm) {
        // Enhance the found farm with a richer product list for the detail page.
        farm.products = ['heirloom-tomatoes', 'green-lettuce', 'fresh-strawberries', 'organic-zucchini', 'free-range-eggs', 'wildflower-honey'];
        return farm;
    }

    return null;
}
