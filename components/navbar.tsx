import { selectCurrentUser } from '@/features/user/user.selector';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { AppDispatch } from '@/store/store';
import { setUser } from '@/features/user/user.slice';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import router from 'next/router';

const navbar = () => {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const dispatch = useDispatch<AppDispatch>();

const logoutHandler = () => {
  dispatch(setUser(null)); // Of een specifieke logout action als je die hebt
  sessionStorage.removeItem('email');
  sessionStorage.removeItem('token');
  router.push('/'); // Redirect naar de login pagina
};


  const menuLeft = useRef<Menu>(null);
  
  const items: MenuItem[] = [
    {
        label: 'Profile',
        items: [
            {
                label: 'Settings',
                icon: 'pi pi-cog'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    logoutHandler();
                }
            },
        ]
    }
];

  return (
    <div className="flex items-center justify-between text-dark-700 h-16 border-b-1 border-surface-500 backdrop-blur-md px-20">
      {user ? (
        <div className="flex gap-12 items-center font-bold">
          <Link href="/" className="text-dark-700 text-2xl italic font-anton ">
            C<span className=" text-blue-500">M</span>
          </Link>
          <ul className="flex gap-7 font-semibold">
            <Link href="/overzicht">
              <li
                className={`h-16 flex items-center ${isActive('/overzicht') ? 'border-b-2 border-blue-500' : 'text-dark-700'}`}
              >
                Overzicht
              </li>
            </Link>
            <Link href="/competities">
              <li
                className={`h-16 flex items-center ${isActive('/competities') ? 'border-b-2 border-blue-500' : 'text-dark-700'}`}
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
        <><div onClick={(event) => menuLeft.current!.toggle(event)} className='cursor-pointer' >
          <User size={24} className="stroke-blue-500" />
        </div><Menu model={items} popup ref={menuLeft} id="popup_menu_left" /></>

      ) : (
        <div className="flex gap-4">
          <Link href="/authenticatie/login">
            <Button label="Login" severity="secondary" outlined />
          </Link>
          <Link href="/authenticatie/register">
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
