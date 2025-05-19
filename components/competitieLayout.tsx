// components/CustomLayout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/user/user.slice';
import { ProgressSpinner } from 'primereact/progressspinner';

type CustomLayoutProps = {
  children: ReactNode;
};

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const jwtToken = sessionStorage.getItem('jwtToken');

    if (email && jwtToken) {
      dispatch(setUser({ email, jwtToken }));
    }

    setLoading(false); // regardless, we stop loading after setting user or none
  }, [dispatch]);

  if (loading) {
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
    <div className="min-h-[100vh] flex">
      <Sidebar />
      <div className="max-w-[calc(100vw-350px)] w-full flex flex-col gap-12 py-12 px-8">
        {children}
      </div>
    </div>
  );
};

export default CustomLayout;
