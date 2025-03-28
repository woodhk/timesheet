'use client';

import React from 'react';

type FloatingActionButtonProps = {
  onClick: () => void;
  label: string;
};

export default function FloatingActionButton({ onClick, label }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center z-50"
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="ml-2 hidden md:inline">{label}</span>
    </button>
  );
} 