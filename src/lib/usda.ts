
import type { Farm } from './types';
import { GeoPoint } from 'firebase/firestore';

interface USDALocalFoodMarket {
  listing_id: string;
  listing_name: string;
  location_address: string;
  location_city: string;
  location_state: string;
  location_zipcode: string;
  media_website: string;
  lat: number;
  lon: number;
  d: number;
  listing_type: 'farmersmarket' | 'csa' | 'onfarmmarket' | 'foodhub' | 'agritourism';
}

function isValidMarket(market: any): market is USDALocalFoodMarket {
  return (
    market &&
    typeof market.listing_id === 'string' &&
    typeof market.listing_name === 'string' &&
    typeof market.lat === 'number' &&
    typeof market.lon === 'number'
  );
}

async function fetchFromDirectory(directory: string, lat: number, lon: number, apiKey: string): Promise<USDALocalFoodMarket[]> {
    const radius = 50; // Search within a 50-mile radius
    const url = `https://www.usdalocalfoodportal.com/api/${directory}/?apikey=${apiKey}&x=${lon}&y=${lat}&radius=${radius}`;

    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`USDA API request for ${directory} failed with status: ${response.status}`, errorText);
        // Throw an error to be caught by the caller
        throw new Error(`Failed to fetch from ${directory}. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data.map((item: any) => ({ ...item, listing_type: directory as any}));
}

function getFarmType(listingType: USDALocalFoodMarket['listing_type']): Farm['type'] {
    switch(listingType) {
        case 'farmersmarket':
            return 'market';
        case 'onfarmmarket':
            return 'farm';
        case 'csa':
            return 'farm';
        default:
            return 'vendor';
    }
}


export async function getFarmsFromUSDA(lat: number, lng: number): Promise<Farm[]> {
    const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY;

    if (!apiKey || apiKey === "YOUR_API_KEY") {
        console.error("USDA API Key is not configured. Please add it to your .env file.");
        throw new Error("USDA API Key is not configured.");
    }
    
    const directories: USDALocalFoodMarket['listing_type'][] = ['farmersmarket', 'csa', 'onfarmmarket'];
    
    try {
        const allResults = await Promise.all(
            directories.map(dir => fetchFromDirectory(dir, lat, lng, apiKey))
        );
        
        const combinedResults = allResults.flat();
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.listing_id, item])).values());

        return uniqueResults
            .filter(isValidMarket)
            .map((market: USDALocalFoodMarket) => {
                const fullAddress = [
                    market.location_address, 
                    market.location_city,
                    market.location_state,
                    market.location_zipcode
                ].filter(Boolean).join(', ');

                return {
                    id: market.listing_id,
                    name: market.listing_name,
                    bio: market.media_website || 'A local food provider offering fresh products.',
                    location: {
                        geopoint: new GeoPoint(market.lat, market.lon),
                        address: fullAddress,
                    },
                    products: [], 
                    type: getFarmType(market.listing_type),
                    rating: 4.5, // Assign a default rating
                    distance: market.d,
                    logoUrl: '', 
                    heroUrl: '',
                } as Farm;
            });
    } catch(error) {
        console.error("An error occurred while fetching farms from USDA API:", error);
        // Re-throw the error so the UI can handle it
        throw error;
    }
}
