import type { AppProps } from 'next/app';
import '../styles/globalcss.css';
import { AppProvider } from '../context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
// import { AuthProvider } from "../context/AuthContext";

// Create a QueryClient instance
const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // Wrap your app in both AppProvider and QueryClientProvider
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </AppProvider>
  );
};

export default MyApp;

