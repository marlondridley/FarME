
import { collection, getDocs, GeoPoint } from 'firebase/firestore';
import { db } from './firebase';
import type { Farm } from './types';

export async function getFarmsFromFirestore(): Promise<Farm[]> {
  try {
    const farmsCol = collection(db, 'farms');
    const farmSnapshot = await getDocs(farmsCol);
    const farmList = farmSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Farm',
        bio: data.bio || '',
        location: {
          geopoint: data.location?.geopoint || new GeoPoint(0, 0),
          address: data.location?.address || 'No address provided'
        },
        products: data.products || [],
        type: data.type || 'farm',
        rating: data.rating || 0,
        // These will be filled in by the getFarms function in data.ts
        logoUrl: '',
        heroUrl: '',
      } as Farm;
    });
    return farmList;
  } catch (e) {
    console.error("Error fetching farms from Firestore: ", e);
    // In case of error, return an empty array to prevent app crash
    return [];
  }
}
