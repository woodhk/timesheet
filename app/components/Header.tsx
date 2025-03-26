'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserMenu from './UserMenu';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header 
      className="bg-white text-gray-800 shadow-sm py-4 border-b border-gray-200"
      style={{
        backgroundColor: 'white',
        color: '#1F2937',
        padding: '1rem 0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #E5E7EB'
      }}
    >
      <div 
        className="container mx-auto px-4 flex justify-between items-center"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
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
            className="text-2xl font-bold text-gray-900"
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827'
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
                  className={`hover:text-blue-600 transition-colors ${
                    pathname === '/' ? 'font-medium text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600'
                  }`}
                  style={{
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    ...(pathname === '/' ? {
                      fontWeight: 500,
                      color: '#2563EB',
                      borderBottom: '2px solid #2563EB',
                      paddingBottom: '0.25rem'
                    } : {
                      color: '#4B5563'
                    })
                  }}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/timer" 
                  className={`hover:text-blue-600 transition-colors ${
                    pathname.startsWith('/timer') ? 'font-medium text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600'
                  }`}
                  style={{
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    ...(pathname.startsWith('/timer') ? {
                      fontWeight: 500,
                      color: '#2563EB',
                      borderBottom: '2px solid #2563EB',
                      paddingBottom: '0.25rem'
                    } : {
                      color: '#4B5563'
                    })
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