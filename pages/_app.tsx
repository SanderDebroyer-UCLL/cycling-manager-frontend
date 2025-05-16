// pages/_app.tsx
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/store/store';
import '@/styles/globals.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { PrimeReactProvider } from 'primereact/api';
import { Inter, Manrope, Anton } from 'next/font/google';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/router';
import Sidebar from '@/components/sidebar';
import { Toast } from 'primereact/toast';
import { toastRef } from '@/services/toast.service';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  weight: '400',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isCompetitionRoute = router.pathname.includes('/competities/');

  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <Provider store={store}>
        <Toast ref={toastRef} position="bottom-right" />
        {isCompetitionRoute ? (
          <div
            className={`${inter.variable} ${manrope.variable} ${anton.variable} font-inter bg-surface-300 min-h-[100vh] flex`}
          >
            <Sidebar />
            <Component {...pageProps} />
          </div>
        ) : (
          <div
            className={`${inter.variable} ${manrope.variable} ${anton.variable} font-inter bg-surface-300 min-h-[100vh]`}
          >
            <div className="sticky top-0 z-50">
              <Navbar />
            </div>
            <Component {...pageProps} />
          </div>
        )}
      </Provider>
    </PrimeReactProvider>
  );
}
