export type Farm = {
  id: string;
  name: string;
  logoUrl: string;
  heroUrl: string;
  bio: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  products: string[]; // array of product ids
  type: 'farm' | 'market' | 'vendor';
  rating: number;
  distance: number; // in km
};

export type Product = {
  id:string;
  name: string;
  farmId: string;
  imageUrl: string;
  price: number;
  category: string;
  description: string;
};

export type Order = {
  id: string;
  farmId: string;
  products: { productId: string, quantity: number }[];
  total: number;
  deliveryOption: 'standard' | 'premium';
  status: 'placed' | 'accepted' | 'shipped' | 'delivered';
  orderDate: string;
  estimatedDelivery: string;
};

export type USDADirectory = 'agritourism' | 'csa' | 'farmersmarket' | 'foodhub' | 'onfarmmarket';

export type USDAFarm = {
  listing_id: string;
  listing_name: string;
  listing_description: string;
  media_website: string;
  location_state: string;
  location_city: string;
  location_zipcode: string;
  location_x: number;
  location_y: number;
  distance: number;
  directory: USDADirectory;
};
