'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { FaHome, FaMoneyBill, FaCalendarAlt, FaSun, FaMoon, FaSignOutAlt, FaUser, FaUsersCog } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Links padrão disponíveis para todos os usuários
  const links = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Financeiro', href: '/banco', icon: FaMoneyBill },
    { name: 'Agenda', href: '/agenda', icon: FaCalendarAlt },
  ];

  // Links de administração (apenas para administradores)
  const adminLinks = [
    { name: 'Gerenciar Usuários', href: '/admin/usuarios', icon: FaUsersCog },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="hidden md:flex fixed top-0 left-0 h-full w-16 bg-white dark:bg-gray-900/80 flex-col items-center py-4 z-10">
      {/* Logo ou iniciais do app */}
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mb-8">
        G25
      </div>

      <div className="flex-1 flex flex-col items-center gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'p-3 rounded-lg transition-colors relative group',
                isActive(link.href)
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

        {/* Links de administração - só aparecem se o usuário for administrador */}
        {user?.isAdmin && adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'p-3 rounded-lg transition-colors relative group mt-4',
                pathname === link.href || pathname?.startsWith(`${link.href}/`)
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-300'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="absolute left-full ml-2 bg-indigo-700 dark:bg-indigo-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Área do usuário e configurações */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        {user && (
          <div className="relative group">
            <div className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaUser className="w-6 h-6" />
            </div>
            <div className="absolute left-full ml-2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity min-w-max">
              {user.name}
              {user.isAdmin && <span className="block text-xs text-indigo-300">(Administrador)</span>}
            </div>
          </div>
        )}

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors relative group"
        >
          {isMounted && theme === 'dark' ? (
            <FaSun className="w-6 h-6" />
          ) : (
            <FaMoon className="w-6 h-6" />
          )}
          <span className="absolute left-full ml-2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </span>
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors relative group"
          >
            <FaSignOutAlt className="w-6 h-6" />
            <span className="absolute left-full ml-2 bg-gray-800 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Sair
            </span>
          </button>
        )}
      </div>
    </div>
  );
} 