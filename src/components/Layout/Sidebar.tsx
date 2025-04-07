'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { FaHome, FaMoneyBill, FaCalendarAlt, FaSun, FaMoon } from 'react-icons/fa';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const links = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Financeiro', href: '/banco', icon: FaMoneyBill },
    { name: 'Agenda', href: '/agenda', icon: FaCalendarAlt },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 z-10">
      <div className="flex-1 flex flex-col items-center gap-3 mt-6">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'p-3 rounded-lg transition-colors relative group',
                pathname === link.href
                  ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-primary-light'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="absolute left-full ml-2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        {isMounted && theme === 'dark' ? (
          <FaSun className="w-6 h-6" />
        ) : (
          <FaMoon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
} 