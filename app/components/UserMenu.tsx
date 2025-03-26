'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/app/hooks/useSupabase';

export default function UserMenu() {
  const { user, loading, signOut } = useSupabase();
  const router = useRouter();

  if (loading) {
    return (
      <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-sm"
      >
        Sign In
      </button>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center space-x-3 text-slate-700 focus:outline-none">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-sm font-bold text-white">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="hidden md:inline-block text-slate-700 font-medium">{user.email}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100 py-1 overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 mb-1">
            <p className="text-sm text-slate-500 mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-slate-800 truncate">{user.email}</p>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => router.push('/profile')}
                  className={`${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                  } group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-100`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${active ? 'text-indigo-600' : 'text-slate-500'} mr-3 h-5 w-5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut()}
                  className={`${
                    active ? 'bg-red-50 text-red-700' : 'text-slate-700'
                  } group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-100`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${active ? 'text-red-600' : 'text-slate-500'} mr-3 h-5 w-5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 