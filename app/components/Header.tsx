'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="bg-white shadow-sm py-4 border-b border-slate-100 sticky top-0 z-10">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">10,000 Hours</h1>
          </div>
        </div>
        <div className="flex items-center">
          <nav className="mr-8">
            <ul className="flex space-x-8">
              <li>
                <Link 
                  href="/" 
                  className={`flex items-center transition-colors px-1 py-1 ${
                    pathname === '/' 
                      ? 'text-indigo-600 font-medium' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="relative">
                    Dashboard
                    {pathname === '/' && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                    )}
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/timer" 
                  className={`flex items-center transition-colors px-1 py-1 ${
                    pathname.startsWith('/timer') 
                      ? 'text-indigo-600 font-medium' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="relative">
                    Timer
                    {pathname.startsWith('/timer') && (
                      <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>
                    )}
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
          <UserMenu />
        </div>
      </div>
    </header>
  );
} 