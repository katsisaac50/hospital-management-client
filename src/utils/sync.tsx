import { getOfflineData, clearOfflineData } from './indexedDB';

export const syncOfflineData = async () => {
  const offlineData = await getOfflineData();
  if (offlineData.length === 0) return;

  console.log('Syncing offline data:', offlineData);
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offlineData),
    });

    if (response.ok) {
      console.log('Offline data synced successfully');
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Failed to sync offline data:', error);
  }
};

// Listen for when the internet is back
window.addEventListener('online', syncOfflineData);