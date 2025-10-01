
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Farm, FarmStatus } from './types';
import { GeoPoint } from 'firebase/firestore';
import { geocode } from '@/ai/flows/geocode-flow';

export async function getFarms(): Promise<Farm[]> {
  try {
    const farmsCollection = collection(db, 'farms');
    const farmSnapshot = await getDocs(farmsCollection);
    const farmList = farmSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Farm));
    return farmList;
  } catch (error) {
    console.error("Error fetching farms from Firestore:", error);
    // In case of error, return an empty array.
    // The UI will show a message based on the empty array.
    return [];
  }
}

export async function getFarmForUser(userId: string): Promise<Partial<Farm> | null> {
    try {
        const farmDocRef = doc(db, 'farms', userId);
        const farmDoc = await getDoc(farmDocRef);
        if (farmDoc.exists()) {
            return farmDoc.data() as Farm;
        }
        return null;
    } catch (error) {
        console.error("Error fetching farm for user:", error);
        return null;
    }
}


export async function saveFarmData(userId: string, data: { name: string; bio: string; address: string; }): Promise<void> {
    const farmDocRef = doc(db, 'farms', userId);
    
    let geopoint = new GeoPoint(34.0522, -118.2437); // Default to LA
    try {
        const zipMatch = data.address.match(/\b\d{5}\b/);
        if (zipMatch) {
            const geoResult = await geocode({ zipCode: zipMatch[0] });
            if (geoResult.latitude && geoResult.longitude) {
                geopoint = new GeoPoint(geoResult.latitude, geoResult.longitude);
            }
        }
    } catch (e) {
        console.error("Geocoding failed, using default location.", e);
    }

    await setDoc(farmDocRef, {
        name: data.name,
        bio: data.bio,
        location: {
            address: data.address,
            geopoint: geopoint
        },
        id: userId,
        products: [],
        type: 'farm',
        rating: 4.5, 
        logoUrl: '',
        heroUrl: '',
    }, { merge: true });
}

export async function updateFarmStatus(userId: string, status: FarmStatus): Promise<void> {
    const farmDocRef = doc(db, 'farms', userId);
    await updateDoc(farmDocRef, {
      status: {
        ...status,
        timestamp: new Date(),
      }
    });
}
