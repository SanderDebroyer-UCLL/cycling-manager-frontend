import { User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import React from 'react';

const navbar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center justify-between text-dark-700 h-16 border-b-1 border-surface-500 backdrop-blur-md px-20">
      <div className="flex gap-12 items-center">
        <Link href="/" className="text-dark-700 text-2xl italic font-anton ">
          C<span className=" text-blue-500">M</span>
        </Link>
        <ul className="flex gap-7 font-semibold">
          <li
            className={`h-16 flex items-center ${isActive('/overview') ? 'border-b-2 border-blue-500' : 'text-dark-700'}`}
          >
            <Link href="/overview">Overzicht</Link>
          </li>
          <li
            className={`h-16 flex items-center ${isActive('/competitions') ? 'border-b-2 border-blue-500' : 'text-dark-700'}`}
          >
            <Link href="/competitions">Competities</Link>
          </li>
        </ul>
      </div>
      <Link href="/profile">
        <User size={24} className="stroke-blue-500" />
      </Link>
    </div>
  );
};

export default navbar;
