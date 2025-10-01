
import { GeoPoint, Timestamp } from "firebase/firestore";

export type FarmStatus = {
  location: string;
  productUpdates: string;
  timestamp: Date;
}

export type Farm = {
  id: string;
  name: string;
  logoUrl: string;
  heroUrl: string;
  bio: string;
  location: {
    geopoint: GeoPoint;
    address: string;
  };
  status?: FarmStatus;
  products: string[]; // array of product ids
  type: 'farm' | 'market' | 'vendor';
  rating: number;
  distance?: number; // in miles, from API
};

export type Product = {
  id:string;
  name: string;
  farmId: string;
  imageUrl: string;
  price: number;
  category: string;
  description:string;
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
