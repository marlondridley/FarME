import type { USDAFarm, USDADirectory } from './types';

const API_BASE_URL = 'https://www.usdalocalfoodportal.com/api/';
const API_KEY = process.env.USDA_API_KEY;

const DIRECTORIES: USDADirectory[] = ['agritourism', 'csa', 'farmersmarket', 'foodhub', 'onfarmmarket'];

async function fetchDirectory(directory: USDADirectory, {x, y, radius}: {x: number, y: number, radius: number}): Promise<USDAFarm[]> {
    if (!API_KEY) {
        console.error("USDA_API_KEY is not set in environment variables.");
        return [];
    }
    const url = `${API_BASE_URL}${directory}/?apikey=${API_KEY}&x=${x}&y=${y}&radius=${radius}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching ${directory}: ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        
        // The API returns { data: [...] }
        if (data && Array.isArray(data.data)) {
             return data.data.map((item: any) => ({ ...item, directory }));
        }

        return [];
    } catch (error) {
        console.error(`Exception fetching ${directory}:`, error);
        return [];
    }
}

export async function getUsdaFarms(options: {x: number, y: number, radius: number}): Promise<USDAFarm[]> {
    const allFarms: USDAFarm[] = [];

    const fetchPromises = DIRECTORIES.map(dir => fetchDirectory(dir, options));

    const results = await Promise.all(fetchPromises);
    
    for (const result of results) {
        if (result.length > 0) {
            allFarms.push(...result);
        }
    }
    
    // Sort by distance
    allFarms.sort((a, b) => a.distance - b.distance);

    return allFarms;
}
