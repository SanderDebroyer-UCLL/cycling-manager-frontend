import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { requestLoggedInUser, setUser } from '@/features/user/user.slice';
import { usePathname } from 'next/navigation';
import router from 'next/router';
import LoadingOverlay from '../LoadingOverlay';

type CustomLayoutProps = {
  children: ReactNode;
};

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user.userDTO);
  const userStatus = useSelector((state: RootState) => state.user.status);

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    if (!user && userStatus === 'idle') {
      dispatch(requestLoggedInUser());
    }
  }, [user, userStatus]);

  useEffect(() => {
    if (userStatus === 'not-authenticated') {
      shouldBeRedirected();
      dispatch(setUser(null));
    }
  }, [userStatus]);

  const shouldBeRedirected = () => {
    if (!user && !isActive('/')) {
      router.push('/');
    }
  };

  if (!user) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="max-w-[calc(100vw-320px)] w-full flex flex-col py-12 px-8 bg-surface-container-lowest overflow-y-auto max-h-screen">
        {children}
      </div>
    </div>
  );
};

export default CustomLayout;
