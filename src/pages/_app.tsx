import type { AppProps } from 'next/app';
import '../styles/globalcss.css';
import { AppProvider } from '../context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // Wrap your app in both AppProvider and QueryClientProvider
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AppProvider>
  );
};

export default MyApp;

