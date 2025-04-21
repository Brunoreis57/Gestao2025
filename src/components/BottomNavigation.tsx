'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaMoneyBill, FaCalendarAlt, FaUser } from 'react-icons/fa';

export default function BottomNavigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navigationItems = [
    {
      href: '/',
      icon: FaHome,
      label: 'Home',
      isActive: pathname === '/',
    },
    {
      href: '/banco',
      icon: FaMoneyBill,
      label: 'Financeiro',
      isActive: pathname?.startsWith('/banco'),
    },
    {
      href: '/agenda',
      icon: FaCalendarAlt,
      label: 'Agenda',
      isActive: pathname?.startsWith('/agenda'),
    },
    {
      href: '/perfil',
      icon: FaUser,
      label: 'Perfil',
      isActive: pathname?.startsWith('/perfil'),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                item.isActive
                  ? 'text-primary dark:text-primary-light'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 