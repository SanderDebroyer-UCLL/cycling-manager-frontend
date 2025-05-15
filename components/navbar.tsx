import { selectCurrentUser } from '@/features/user/user.selector';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { AppDispatch } from '@/store/store';
import { setUser } from '@/features/user/user.slice';

const navbar = () => {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const jwtToken = sessionStorage.getItem('jwtToken');

    if (email && jwtToken) {
      dispatch(setUser({ email, jwtToken }));
    }
  }, [dispatch]);

  return (
    <div className="flex items-center justify-between text-dark-700 h-16 border-b-1 border-surface-500 backdrop-blur-md px-20">
      {user ? (
        <div className="flex gap-12 items-center font-bold">
          <Link href="/" className="text-dark-700 text-2xl italic font-anton ">
            C<span className=" text-blue-500">M</span>
          </Link>
          <ul className="flex gap-7 font-semibold">
            <Link href="/overview">
              <li
                className={`h-16 flex items-center ${isActive('/overview') ? 'border-b-2 border-blue-500' : 'text-dark-700'}`}
              >
                Overzicht
              </li>
            </Link>
            <Link href="/competitions">
              <li
                className={`h-16 flex items-center ${isActive('/competitions') ? 'border-b-2 border-blue-500' : 'text-dark-700'}`}
              >
                Competities
              </li>
            </Link>
          </ul>
        </div>
      ) : (
        <div className="text-2xl italic font-bold">
          <Link href="/" className="text-dark-700">
            CYCLING <span className=" text-blue-500">MANAGER</span>
          </Link>
        </div>
      )}
      {user ? (
        <Link href="/profile">
          <User size={24} className="stroke-blue-500" />
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link href="/authentication/login">
            <Button label="Login" severity="secondary" outlined />
          </Link>
          <Link href="/authentication/register">
            <Button label="Register" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default navbar;
function componentDidMount(arg0: () => void) {
  throw new Error('Function not implemented.');
}
