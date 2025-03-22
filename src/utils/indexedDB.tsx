import { openDB } from 'idb';

let dbPromise: Promise<IDBDatabase> | null = null;

// Ensure IndexedDB only runs in the browser
const getDB = async () => {
  if (typeof window === "undefined") return null; // Prevent execution on the server

  if (!dbPromise) {
    dbPromise = openDB('hospitalDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('labResults')) {
          db.createObjectStore('labResults', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('invoices')) {
          db.createObjectStore('invoices', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// Function to save data offline
export const saveOfflineData = async (storeName: string, data: any) => {
  const db = await getDB();
  if (!db) return;
  await db.put(storeName, data);
};

// Function to get data
export const getData = async (storeName: string, id: string) => {
  const db = await getDB();
  if (!db) return null;
  return db.get(storeName, id);
};

// Get all records
export const getAllData = async (storeName: string) => {
  const db = await getDB();
  if (!db) return [];
  return db.getAll(storeName);
};

// Remove data after syncing
export const removeData = async (storeName: string, id: string) => {
  const db = await getDB();
  if (!db) return;
  return db.delete(storeName, id);
};