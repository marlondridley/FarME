
import type { Farm } from './types';
import { GeoPoint } from 'firebase/firestore';

// A type guard to ensure we have a valid market object
interface USDAMarket {
    id: string;
    marketname: string;
    // The API sometimes returns distance as a string, sometimes a number.
    [key: string]: any; 
}

function isValidMarket(market: any): market is USDAMarket {
  return market && typeof market.id === 'string' && typeof market.marketname === 'string';
}


export async function getFarmsFromUSDA(lat: number, lng: number): Promise<Farm[]> {
    const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY;

    if (!apiKey || apiKey === "YOUR_API_KEY") {
        console.error("USDA API Key is not configured. Please add it to your .env file.");
        // Return an empty array or throw an error, depending on desired behavior
        return []; 
    }
    
    // The USDA API uses different endpoints for lat/lng vs zip.
    const url = `https://www.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=${lat}&lng=${lng}&auth=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`USDA API request failed with status: ${response.status}`);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            throw new Error('Failed to fetch data from USDA API.');
        }

        const data = await response.json();

        if (!data.results) {
            console.warn("USDA API returned no results for the given location.");
            return [];
        }

        return data.results
            .filter(isValidMarket)
            .map((market: USDAMarket) => {
                // The market name string often contains the distance, e.g., "3.5 mi) Main Street Market"
                // We need to parse it out.
                const nameParts = market.marketname.split(')');
                const cleanName = nameParts.length > 1 ? nameParts.slice(1).join(')').trim() : market.marketname;
                const distance = nameParts.length > 1 ? parseFloat(nameParts[0]) : 0;

                return {
                    id: market.id,
                    name: cleanName,
                    bio: 'A local market providing fresh produce from various vendors.', // USDA API doesn't provide a bio
                    location: {
                        geopoint: new GeoPoint(lat, lng), // This is the search origin, not the market's precise location
                        address: 'Address not provided by API',
                    },
                    products: [], // Products are not detailed in this API response
                    type: 'market',
                    rating: 4.5, // Assign a default rating
                    distance: distance,
                    // These will be overridden in data.ts
                    logoUrl: '', 
                    heroUrl: '',
                } as Farm;
            });

    } catch (error) {
        console.error('Error fetching or processing USDA data:', error);
        // Return an empty array to prevent the app from crashing.
        return [];
    }
}
