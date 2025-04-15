'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavigationTab {
  href: string;
  label: string;
}

interface NavigationTabsProps {
  tabs: NavigationTab[];
}

export default function NavigationTabs({ tabs }: NavigationTabsProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Header com menu para mobile */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {tabs.find(tab => tab.href === pathname)?.label || 'Navegação'}
        </h1>
        <button 
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Menu de navegação para mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {tabs.map(tab => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-2 rounded-lg ${
                  pathname === tab.href
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Navegação em abas para desktop */}
      <div className="hidden md:block mb-6">
        <nav className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`py-3 px-6 border-b-2 ${
                pathname === tab.href
                  ? 'border-primary-600 text-primary-600 dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
} 