import type { Farm, Product } from './types';
import { placeholderImages } from './placeholder-images';

const getImageUrl = (id: string) => placeholderImages.find(p => p.id === id)?.imageUrl || 'https://placehold.co/400x300';

export const farms: Farm[] = [
  {
    id: 'green-valley-greens',
    name: 'Green Valley Greens',
    logoUrl: getImageUrl('farm-logo-1'),
    heroUrl: getImageUrl('farm-hero-1'),
    bio: 'Family-owned farm specializing in organic leafy greens and heirloom vegetables. We believe in sustainable agriculture and healthy communities.',
    location: { lat: 38.5816, lng: -121.4944, address: 'Sacramento, CA' },
    products: ['heirloom-tomatoes', 'green-lettuce'],
    type: 'farm',
    rating: 4.8,
    distance: 5.2,
  },
  {
    id: 'sunrise-eggs',
    name: 'Sunrise Eggs',
    logoUrl: getImageUrl('farm-logo-2'),
    heroUrl: getImageUrl('farm-hero-2'),
    bio: 'Fresh, free-range eggs delivered daily. Our happy chickens roam freely and eat a natural, all-organic diet.',
    location: { lat: 38.6, lng: -121.5, address: 'Davis, CA' },
    products: ['free-range-eggs'],
    type: 'farm',
    rating: 4.9,
    distance: 8.1,
  },
  {
    id: 'honeybee-meadows',
    name: 'Honeybee Meadows',
    logoUrl: getImageUrl('farm-logo-3'),
    heroUrl: getImageUrl('farm-hero-3'),
    bio: 'Artisanal honey from local wildflowers. Our bees are our passion, and you can taste it in every drop.',
    location: { lat: 38.55, lng: -121.45, address: 'Carmichael, CA' },
    products: ['wildflower-honey', 'strawberry-jam'],
    type: 'farm',
    rating: 4.7,
    distance: 12.5,
  },
  {
    id: 'riverside-market',
    name: 'Riverside Farmers Market',
    logoUrl: getImageUrl('farm-logo-4'),
    heroUrl: getImageUrl('farm-hero-4'),
    bio: 'A collection of the best local farms and artisans. Open every Sunday from 8 AM to 1 PM.',
    location: { lat: 38.57, lng: -121.51, address: 'Riverside, CA' },
    products: ['heirloom-tomatoes', 'free-range-eggs', 'wildflower-honey', 'fresh-strawberries', 'organic-zucchini'],
    type: 'market',
    rating: 4.9,
    distance: 2.1,
  }
];

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
