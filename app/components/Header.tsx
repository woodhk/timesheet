'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header 
      className="bg-gradient-to-r from-purple-800 to-blue-600 text-white shadow-lg py-4"
      style={{
        background: 'linear-gradient(to right, #6B46C1, #2563EB)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div 
        className="container mx-auto px-4 flex justify-between items-center"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div 
          className="flex items-center space-x-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <h1 
            className="text-2xl font-bold"
            style={{
              fontSize: '1.5rem',
              fontWeight: 700
            }}
          >
            10,000 Hours
          </h1>
        </div>
        <div className="flex items-center">
          <nav className="mr-6">
            <ul 
              className="flex space-x-6"
              style={{
                display: 'flex',
                gap: '1.5rem'
              }}
            >
              <li>
                <Link 
                  href="/" 
                  className={`hover:text-purple-200 transition-colors ${
                    pathname === '/' ? 'font-bold border-b-2 border-white pb-1' : ''
                  }`}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    ...(pathname === '/' ? {
                      fontWeight: 700,
                      borderBottom: '2px solid white',
                      paddingBottom: '0.25rem'
                    } : {})
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/timer" 
                  className={`hover:text-purple-200 transition-colors ${
                    pathname.startsWith('/timer') ? 'font-bold border-b-2 border-white pb-1' : ''
                  }`}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    ...(pathname.startsWith('/timer') ? {
                      fontWeight: 700,
                      borderBottom: '2px solid white',
                      paddingBottom: '0.25rem'
                    } : {})
                  }}
                >
                  Timer
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