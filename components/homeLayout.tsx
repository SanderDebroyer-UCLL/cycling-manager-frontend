import React, { ReactNode } from 'react';
import Navbar from './navbar';

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
