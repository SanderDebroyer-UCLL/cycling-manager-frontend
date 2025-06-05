// pages/_app.tsx
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/store/store';
import '@/styles/globals.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { addLocale, PrimeReactProvider } from 'primereact/api';
import { Inter, Manrope, Anton } from 'next/font/google';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import { toastRef } from '@/services/toast.service';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import Layout from '@/components/layout/layout';
import { locale } from 'primereact/api';
import { CompetitionRouteWatcher } from '@/components/CompetitionRouteWatcher';

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
  addLocale('nl', {
    firstDayOfWeek: 1,
    dayNames: [
      'maandag',
      'dinsdag',
      'woensdag',
      'donderdag',
      'vrijdag',
      'zaterdag',
      'zondag',
    ],
    dayNamesShort: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
    dayNamesMin: ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'],
    monthNames: [
      'januari',
      'februari',
      'maart',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
    ],
    monthNamesShort: [
      'jan',
      'feb',
      'mrt',
      'apr',
      'mei',
      'jun',
      'jul',
      'aug',
      'sep',
      'okt',
      'nov',
      'dec',
    ],
    today: 'Vandaag',
    clear: 'Wissen',
    accept: 'Ja',
    reject: 'Nee',
    //...
  });

  locale('nl');

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <Provider store={store}>
        <CompetitionRouteWatcher />
        <Toast ref={toastRef} />
        <div className="bg-surface-container-lowest">
          {getLayout(<Component {...pageProps} />)}
        </div>
      </Provider>
    </PrimeReactProvider>
  );
}
