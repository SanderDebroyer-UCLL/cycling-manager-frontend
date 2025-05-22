// components/CustomLayout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { requestLoggedInUser, setUser } from '@/features/user/user.slice';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePathname } from 'next/navigation';
import router from 'next/router';

type CustomLayoutProps = {
  children: ReactNode;
};

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: RootState) => state.user.data);
  const userStatus = useSelector((state: RootState) => state.user.status);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const jwtToken = sessionStorage.getItem('jwtToken');
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
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-surface-100 z-9999">
        <ProgressSpinner
          style={{ width: '100px', height: '100px' }}
          strokeWidth="8"
          className="stroke-primary-500"
          animationDuration=".5s"
        />{' '}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="max-w-[calc(100vw-350px)] w-full flex flex-col gap-12 py-12 px-8">
        {children}
      </div>
    </div>
  );
};

export default CustomLayout;
