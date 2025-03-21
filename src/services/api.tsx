import { saveData, getAllData, removeData } from '../utils/indexedDB';
import { savePatientOffline, getOfflinePatients } from '../utils/sqlite';

// Check if online
const isOnline = () => navigator.onLine;

// Function to sync data when online
const syncData = async () => {
  if (isOnline()) {

    getOfflinePatients(async (patients) => {
        if (patients.length) {
          await fetch('/api/sync/patients', {
            method: 'POST',
            body: JSON.stringify({ patients }),
            headers: { 'Content-Type': 'application/json' },
          });
        }
      });

    const unsyncedPatients = await getAllData('patients');
    if (unsyncedPatients.length) {
      fetch('/api/sync/patients', {
        method: 'POST',
        body: JSON.stringify({ patients: unsyncedPatients }),
        headers: { 'Content-Type': 'application/json' },
      }).then(() => {
        unsyncedPatients.forEach(patient => removeData('patients', patient.id));
      });
    }
  }
};

// Save patient (offline or online)
export const savePatient = async (patient: any) => {
  if (isOnline()) {
    return fetch('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    await saveData('patients', patient);
    savePatientOffline(patient);
  }
};

// Sync when online
window.addEventListener('online', syncData);

// navigator.serviceWorker.register('/service-worker.js').then((registration) => {
//     if ('sync' in registration) {
//       navigator.serviceWorker.ready.then((reg) => {
//         return reg.sync.register('sync-patients');
//       });
//     }
//   });
  