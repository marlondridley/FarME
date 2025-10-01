
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Farm } from './types';
import { GeoPoint } from 'firebase/firestore';

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
    
    // For now, we'll use placeholder values for fields not in the form.
    // A real app would have UI for these or more robust logic.
    await setDoc(farmDocRef, {
        name: data.name,
        bio: data.bio,
        location: {
            address: data.address,
            // In a real app, you would geocode the address to get a GeoPoint.
            geopoint: new GeoPoint(34.0522, -118.2437) 
        },
        // Preserve existing fields if they exist, or set defaults.
        id: userId,
        products: [],
        type: 'farm',
        rating: 4.5, 
        logoUrl: '',
        heroUrl: '',
    }, { merge: true });
}
