import { openDB } from 'idb';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { useState } from 'react';


// Database Setup for IndexedDB
let dbPromise: Promise<IDBDatabase> | null = null;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getDB = async () => {
  // const { setUser } = useAppContext(); // Use the global AuthContext
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);

  if (typeof window === "undefined") return null; // Prevent execution on the server

  if (!dbPromise) {
    dbPromise = openDB('hospitalDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('userCredentials')) {
          db.createObjectStore('userCredentials', { keyPath: 'id' });
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

// Encrypt and Decrypt Functions
const encryptData = (data: string) => {
  return CryptoJS.AES.encrypt(data, 'your-secret-key').toString();
};

const decryptData = (encryptedData: string) => {
  if (!encryptedData) {
    console.error("No encrypted data found");
    return null;
  }
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'your-secret-key');
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      console.error("Decryption failed: Invalid data format");
      return null;
    }

    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};


// Function to Save Credentials in IndexedDB
export const saveCredentials = async (email: string, password: string) => {
  const db = await getDB();
  if (!db) return;

  // Encrypt credentials before storing them
  const encryptedEmail = encryptData(email);
  const encryptedPassword = encryptData(password);

  await db.put('userCredentials', { id: 'userCredentials', email: encryptedEmail, password: encryptedPassword });
};

// Clear Corrupt Data and Re-store Credentials
export const clearStoredCredentials = async () => {
  const db = await getDB();
  if (!db) return;

  await db.delete('userCredentials', 'userCredentials');
  console.log("Corrupt credentials removed");
};

// Function to Get Stored Credentials from IndexedDB
export const getStoredCredentials = async () => {
  const db = await getDB();
  if (!db) return null;

  const data = await db.get('userCredentials', 'userCredentials');
  if (data) {
    const decryptedEmail = decryptData(data.email);
    const decryptedPassword = decryptData(data.password);

    if (!decryptedEmail || !decryptedPassword) {
      console.error("Decryption failed: Invalid data format");
      return null;
    }
    return { email: decryptedEmail, password: decryptedPassword };
  }
  return null;
};

// Function to Log in (Offline or Online)
const isOnline = () => typeof navigator !== "undefined" && navigator.onLine;


export const login = async (email: string, password: string, setLoading, setError, setUser, router) => {
  if (isOnline()) {
    setLoading(true);
    const url = `${API_URL}/auth/login`;
    console.log("Sending request to:", url);

    // Attempt to log in online with the server
    try {
      const response = await axios.post(url, { email, password });
  console.log('yems', response)
  document.cookie = `authToken=${response.data.token}; path=/; max-age=3600; samesite=strict`;

      localStorage.setItem("authToken", response.data.token); // Persist "authToken");

axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;


      console.log("Full User Data:", response.data); // Debugging log
    if (response.status === 200) {
      // Success notification
      toast.success('Logged in successfully!');
      // Optionally store credentials for offline use
      await saveCredentials(email, password);
    } else {
      // Error notification
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    }
  
      setUser(response.data); // Store full user data
      localStorage.setItem("user", JSON.stringify(response.data)); // Persist all fields
  
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
    
  } else {
    // Try to log in offline
    const storedCredentials = await getStoredCredentials();
    console.log(storedCredentials)
    if (storedCredentials) {
      if (storedCredentials.email === email && storedCredentials.password === password) {
        toast.success('Logged in offline successfully');
        router.push("/dashboard");
      } else {
        toast.error('Invalid offline credentials');
      }
    } else {
      toast.error('No stored credentials for offline login');
    }
  }
};

if (typeof window !== "undefined") {
  // Sync Data when Back Online
window.addEventListener('online', async () => {
  console.log('Back online! Syncing data...');

  // Sync any data saved offline
  const db = await getDB();
  if (!db) return;

  // Sync Lab Results (Example)
  const labResults = await db.getAll('labResults');
  labResults.forEach(async (result) => {
    // Send each result to the server for syncing
    try {
      const response = await fetch('/sync-lab-result', {
        method: 'POST',
        body: JSON.stringify(result),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        await db.delete('labResults', result.id); // Remove synced record
        console.log('Lab result synced and removed from offline storage.');
      }
    } catch (error) {
      console.error('Failed to sync lab result', error);
      
    }
  });
});
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