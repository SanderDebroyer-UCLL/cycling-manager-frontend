import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/features/user/user.slice';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import Link from 'next/link';
import router from 'next/router';
import { AppDispatch, RootState } from '@/store/store';
import { User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';

const navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const user = useSelector((state: RootState) => state.user.userDTO);

  const logoutHandler = () => {
    dispatch(setUser(null)); // Of een specifieke logout action als je die hebt
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('jwtToken');
    router.push('/'); // Redirect naar de login pagina
  };

  const menuLeft = useRef<Menu>(null);

  const items: MenuItem[] = [
    {
      label: 'Profiel',
      items: [
        {
          label: 'Instellingen',
          icon: 'pi pi-cog',
          command: () => {
            router.push('/profiel');
          },
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            logoutHandler();
          },
        },
      ],
    },
  ];

  return (
    <div className="flex items-center justify-between text-dark-700 h-16 border-b-1 border-outline backdrop-blur-md px-20">
      {user ? (
        <div className="flex gap-12 items-center font-bold">
          <Link href="/" className="text-dark-700 text-2xl italic font-anton ">
            C<span className=" text-primary">M</span>
          </Link>
          <ul className="flex gap-7 font-semibold">
            <Link href="/overzicht">
              <li
                className={`h-16 flex items-center border-b-4 border-transparent pt-1 ${isActive('/overzicht') ? '!border-primary' : 'text-dark-700'}`}
              >
                Overzicht
              </li>
            </Link>
            <Link href="/competities">
              <li
                className={`h-16 flex items-center border-b-4 border-transparent pt-1 ${isActive('/competities') ? '!border-primary' : 'text-dark-700'}`}
              >
                Competities
              </li>
            </Link>
            {user.role === 'ADMIN' && (
              <Link href="/scrape">
                <li
                  className={`h-16 flex items-center border-b-4 border-transparent pt-1 ${isActive('/scrape') ? '!border-primary' : 'text-dark-700'}`}
                >
                  Data Ophalen
                </li>
              </Link>
            )}
          </ul>
        </div>
      ) : (
        <div className="text-2xl italic font-bold">
          <Link href="/" className="text-dark-700">
            CYCLING <span className=" text-primary">MANAGER</span>
          </Link>
        </div>
      )}
      {user ? (
        <>
          <div
            onClick={(event) => menuLeft.current!.toggle(event)}
            className="cursor-pointer"
          >
            <User size={24} className="stroke-primary" />
          </div>
          <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
        </>
      ) : (
        <div className="flex gap-4">
          <Link href="/authenticatie/login">
            <Button label="Login" raised />
          </Link>
          <Link href="/authenticatie/register">
            <Button label="Registeer" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default navbar;
