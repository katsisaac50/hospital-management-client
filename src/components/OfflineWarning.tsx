import { useEffect, useState } from 'react';

const OfflineWarning = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center' }}>
      ⚠️ You are offline. Changes will be saved when you reconnect.
    </div>
  );
};

export default OfflineWarning;
