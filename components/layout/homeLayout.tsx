import React, { ReactNode } from 'react';
import Navbar from '@/components/navbar';
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
