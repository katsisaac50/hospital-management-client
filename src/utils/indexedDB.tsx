import { openDB } from 'idb';

// Open or create database
const dbPromise = openDB('hospitalDB', 1, {
  upgrade(db) {
    db.createObjectStore('patients', { keyPath: 'id' });
    db.createObjectStore('labResults', { keyPath: 'id' });
    db.createObjectStore('invoices', { keyPath: 'id' });
  },
});

// Function to save data offline
export const saveData = async (storeName: string, data: any) => {
  const db = await dbPromise;
  await db.put(storeName, data);
};

// Function to get data
export const getData = async (storeName: string, id: string) => {
  const db = await dbPromise;
  return db.get(storeName, id);
};

// Get all records
export const getAllData = async (storeName: string) => {
  const db = await dbPromise;
  return db.getAll(storeName);
};

// Remove data after syncing
export const removeData = async (storeName: string, id: string) => {
  const db = await dbPromise;
  return db.delete(storeName, id);
};