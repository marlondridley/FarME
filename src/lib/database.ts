
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import type { Farm } from './types';

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
