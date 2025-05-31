import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from './navbar';
import { useDispatch, useSelector } from 'react-redux';
import { requestLoggedInUser, setUser } from '@/features/user/user.slice';
import { AppDispatch, RootState } from '@/store/store';
import { usePathname } from 'next/navigation';
import router from 'next/router';
import Head from 'next/head';
import LoadingOverlay from './LoadingOverlay';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.userDTO);
  const userStatus = useSelector((state: RootState) => state.user.status);

  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const jwtToken = sessionStorage.getItem('jwtToken');

    if (email && jwtToken) {
      dispatch(setUser({ email, jwtToken }));
    }

    setLoading(false); // regardless, we stop loading after setting user or none
  }, [dispatch]);

  useEffect(() => {
    if (!user && userStatus === 'idle') {
      dispatch(requestLoggedInUser());
    }
  }, [user, userStatus]);

  useEffect(() => {
    if (userStatus === 'not-authenticated') {
      shouldBeRedirected();
      dispatch(setUser(null));
      console.log('User not logged in', user);
    }
  }, [userStatus]);

  const shouldBeRedirected = () => {
    if (!user && !isActive('/')) {
      router.push('/');
    }
  };

  if (loading || !user) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Head>
        <title>Cycling Manager</title>
        <meta
          name="description"
          content="Cycling Manager - beheer jouw team en win de competitie"
        />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
