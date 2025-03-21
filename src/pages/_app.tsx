import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globalcss.css';
import { AppProvider } from '../context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastContainer , toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../components/ErrorBoundary';
import axios from 'axios';
import OfflineWarning from '../components/OfflineWarning';
// import { AuthProvider } from "../context/AuthContext";
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // dsn: 'https://your-sentry-dsn', // Replace with your actual DSN
  dsn: 'http://localhost:3000',
  tracesSampleRate: 1.0,
});


// Function to extract meaningful error messages
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || "An unexpected error occurred.";
    const url = error.config?.url || ''; // Extract endpoint URL
     // Log to Sentry
    Sentry.captureException(error, { tags: { endpoint: url, status } });

    // Custom messages based on endpoints
    if (url.includes('/api/auth/login')) {
      if (status === 401) return toast.error("Invalid credentials. Please try again.");
      if (status === 403) return toast.error("Your account is restricted. Contact support.");
    }

    if (url.includes('/api/auth/register')) {
      if (status === 400) return toast.error("Registration failed. Check your details.");
      if (status === 409) return toast.error("Email already in use.");
    }

    if (url.includes('/api/patients')) {
      if (status === 400) return toast.error("Invalid patient data. Please check the form.");
      if (status === 404) return toast.error("Patient not found.");
    }

    if (url.includes('/api/appointments')) {
      if (status === 400) return toast.error("Invalid appointment details.");
      if (status === 404) return toast.error("Appointment not found.");
    }

    // General error handling
    switch (status) {
      case 400:
        toast.error(`Bad Request: ${message}`);
        break;
      case 401:
        toast.error("Unauthorized: Please log in again.");
        break;
      case 403:
        toast.error("Forbidden: You don’t have permission.");
        break;
      case 404:
        toast.error("Not Found: The requested resource does not exist.");
        break;
      case 500:
        toast.error("Server Error: Something went wrong on our end.");
        break;
      default:
        toast.error(message);
    }
  } else {
     Sentry.captureException(error);
    toast.error("An unknown error occurred.");
  }
};

// Create a single instance of QueryClient outside the component
const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry failed queries twice
  },
  mutations: {
    onError: handleApiError,
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);

          if ('sync' in registration) {
            navigator.serviceWorker.ready.then((reg) => {
              reg.sync.register('sync-patients');
            });
          }
        })
        .catch((error) => console.error('Service Worker registration failed:', error));
    }

    // Handle sync messages from Service Worker
    const messageHandler = async (event: MessageEvent) => {
      if (event.data.action === 'sync-patients') {
        const patients = await getAllData('patients');

        if (patients.length) {
          await fetch('/api/sync/patients', {
            method: 'POST',
            body: JSON.stringify({ patients }),
            headers: { 'Content-Type': 'application/json' },
          });

          for (const patient of patients) {
            await removeData('patients', patient.id);
          }
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', messageHandler);

    return () => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    };
  }, []);

  return (
    // Wrap your app in both AppProvider and QueryClientProvider
    <ErrorBoundary>
    <AppProvider>
      <OfflineWarning />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <Component {...pageProps} />
            <ToastContainer />
        </ThemeProvider>
      </QueryClientProvider>
    </AppProvider>
    </ErrorBoundary>
  );
};

export default MyApp;

