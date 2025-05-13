// pages/_app.tsx
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/store/store';
import '@/styles/globals.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { PrimeReactProvider } from 'primereact/api';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </PrimeReactProvider>
  );
}
