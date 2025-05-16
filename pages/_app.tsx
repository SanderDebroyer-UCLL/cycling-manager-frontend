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
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import Layout from '@/components/layout';

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

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const isCompetitionRoute = router.pathname.includes('/competities/');

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <Provider store={store}>
        <Toast ref={toastRef} position="bottom-right" />
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </PrimeReactProvider>
  );
}
