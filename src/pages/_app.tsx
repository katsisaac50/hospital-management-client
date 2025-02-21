import type { AppProps } from 'next/app';
import '../styles/globalcss.css';
import { AppProvider } from '../context/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from '../components/ErrorBoundary';
// import { AuthProvider } from "../context/AuthContext";

// Function to extract and display meaningful error messages
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || "An unexpected error occurred.";

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
    toast.error("An unknown error occurred.");
  }
};

// Create a QueryClient instance
// const queryClient = new QueryClient();

// Create a single instance of QueryClient outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2, // Retry failed queries twice
      onError: handleApiError,
      // onError: (error: unknown) => {
      //   console.error("Query Error:", error);
      //   toast.error('An error occurred while fetching data.');
      // },
    },
    mutations: {
      onError: handleApiError,
      // onError: (error: unknown) => {
      //   console.error("Mutation Error:", error);
      //   toast.error('An error occurred while processing your request.');
      // },
    },
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    // Wrap your app in both AppProvider and QueryClientProvider
    <ErrorBoundary>
    <AppProvider>
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

