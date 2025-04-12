'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaCalendarAlt, FaWallet, FaUser } from 'react-icons/fa';

export default function BottomNavigation() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: <FaHome className="w-5 h-5" />
    },
    {
      href: '/eventos',
      label: 'Agenda',
      icon: <FaCalendarAlt className="w-5 h-5" />
    },
    {
      href: '/banco',
      label: 'Finanças',
      icon: <FaWallet className="w-5 h-5" />
    },
    {
      href: '/admin',
      label: 'Perfil',
      icon: <FaUser className="w-5 h-5" />
    }
  ];

  // Controle para ocultar/mostrar a barra de navegação ao rolar
  const controlNavbar = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Oculta em rolagens para baixo, mostra em rolagens para cima
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(window.scrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      
      // Limpar event listener
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [controlNavbar]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div 
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50 transition-transform duration-300 ${
        visible ? 'transform-none' : 'transform translate-y-full'
      }`}
    >
      <nav className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-3 px-2 flex-1 ${
              isActive(item.href) 
                ? 'text-primary dark:text-primary-light' 
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
} 