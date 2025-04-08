'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { FaShieldAlt, FaUsersCog, FaChartBar, FaListAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import clsx from 'clsx';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado e é administrador
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  const adminMenuItems = [
    { name: 'Usuários', href: '/admin/usuarios', icon: FaUsersCog },
    { name: 'Estatísticas', href: '/admin/estatisticas', icon: FaChartBar },
    { name: 'Logs', href: '/admin/logs', icon: FaListAlt },
    { name: 'Configurações', href: '/admin/configuracoes', icon: FaCog },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-pulse h-16 w-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Verificando permissões...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar de administração */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaShieldAlt className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Painel Admin</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Área de administração
          </p>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = typeof window !== 'undefined' && window.location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center px-4 py-3 rounded-md transition-colors",
                      isActive 
                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300"
          >
            <span>Voltar ao site</span>
          </Link>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Painel de Administração
            </h2>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 