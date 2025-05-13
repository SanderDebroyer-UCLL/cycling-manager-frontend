import Link from 'next/link';
import { Button } from 'primereact/button';
import React from 'react';

const navbar = () => {
  return (
    <div className="flex items-center justify-between text-dark-700 font-anton h-16 border-b-1 border-surface-500 backdrop-blur-md px-20">
      <div className="text-2xl italic">
        <Link href="/" className="text-dark-700">
          CYCLING <span className=" text-blue-500">MANAGER</span>
        </Link>
      </div>
      <div>
        <Link href="/authentication">
          <Button label="Login" />
        </Link>
      </div>
    </div>
  );
};

export default navbar;
