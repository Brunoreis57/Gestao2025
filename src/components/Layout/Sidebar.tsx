'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { HomeIcon, BanknotesIcon, CalendarIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Banco', href: '/banco', icon: BanknotesIcon },
  { name: 'Agenda', href: '/agenda', icon: CalendarIcon },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Menu para Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white dark:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="mb-8 px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary dark:text-white">Gestão 2025</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-6 h-6 text-yellow-500" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      isActive
                        ? 'bg-primary text-white dark:bg-primary/80'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
} 