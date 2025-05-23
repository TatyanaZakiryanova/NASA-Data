'use client';

import { Camera, CircleUser, House, LogIn, LogOut, Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '../context/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const linkClasses =
    'flex items-center gap-2 rounded-lg p-3 text-sm text-customTextColor transition-all duration-300 hover:bg-customButtonHover';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative z-50 flex items-center justify-between rounded-lg bg-customBackground p-4 shadow-md">
      <button onClick={toggleMenu} className="lg:hidden">
        <span className="text-white">☰</span>
      </button>
      <div
        ref={menuRef}
        className={`w-full lg:flex lg:justify-between ${isMenuOpen ? 'absolute left-0 right-0 top-full block w-full rounded-lg bg-customBackground' : 'hidden'} lg:block`}
      >
        <ul className="flex flex-col lg:flex-row lg:gap-2">
          <li>
            <Link
              href="/main"
              onClick={handleLinkClick}
              className={`${linkClasses} ${
                pathname === '/main' ? 'bg-customButton font-bold' : ''
              }`}
            >
              <Camera size={20} />
              Photo of the day
            </Link>
          </li>
          <li>
            <Link
              href="/main/search"
              onClick={handleLinkClick}
              className={`${linkClasses} ${
                pathname === '/main/search' ? 'bg-customButton font-bold text-white' : 'text-white'
              }`}
            >
              <Search size={20} />
              Photo search
            </Link>
          </li>
        </ul>
        <ul className="flex flex-col lg:mt-0 lg:flex-row lg:gap-2">
          {user ? (
            <>
              <li>
                <Link
                  href="/main/profile"
                  onClick={handleLinkClick}
                  className={`${linkClasses} ${
                    pathname === '/main/profile'
                      ? 'bg-customButton font-bold text-white'
                      : 'text-white'
                  }`}
                >
                  <CircleUser size={20} />
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={logout} className={`${linkClasses}`}>
                  <LogOut size={20} onClick={handleLinkClick} />
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/main/registration"
                  onClick={handleLinkClick}
                  className={`${linkClasses} ${pathname === '/main/registration' ? 'bg-customButton font-bold text-white' : 'text-white'}`}
                >
                  <UserPlus size={20} />
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/main/login"
                  onClick={handleLinkClick}
                  className={`${linkClasses} ${
                    pathname === '/main/login'
                      ? 'bg-customButton font-bold text-white'
                      : 'text-white'
                  }`}
                >
                  <LogIn size={20} />
                  Sign In
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`${linkClasses} ${
                pathname === '/' ? 'bg-customButton font-bold text-white' : 'text-white'
              }`}
            >
              <House size={20} />
              Home
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
