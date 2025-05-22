import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from './navbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useDispatch, useSelector } from 'react-redux';
import { requestLoggedInUser, setUser } from '@/features/user/user.slice';
import { AppDispatch, RootState } from '@/store/store';
import { usePathname } from 'next/navigation';
import router from 'next/router';

type LayoutProps = {
  children: ReactNode;
};

const HomeLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default HomeLayout;
