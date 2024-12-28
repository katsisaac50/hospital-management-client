import type { AppProps } from 'next/app';
import '../styles/globalcss.css';
import { AppProvider } from '../context/AppContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
};

export default MyApp;
