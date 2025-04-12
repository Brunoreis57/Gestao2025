'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!authLoading) {
      console.log('ProtectedRoute: Estado de autenticação -', { 
        isAuthenticated: !!user, 
        user: user ? `${user.name} (${user.email})` : 'nenhum', 
        authLoading 
      });
      
      if (!user) {
        console.log('ProtectedRoute: Usuário não autenticado, redirecionando para login');
        // Redirecionar para a página de login se não estiver autenticado
        router.replace('/login');
      } else {
        console.log('ProtectedRoute: Usuário autenticado, mostrando conteúdo protegido');
        // Caso contrário, mostrar o conteúdo
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  // Limpar dados de autenticação inválidos se necessário
  useEffect(() => {
    const checkAuthStorage = () => {
      try {
        const authStorageRaw = localStorage.getItem('auth-storage');
        if (authStorageRaw) {
          const authStorage = JSON.parse(authStorageRaw);
          
          // Verificar se os dados estão corrompidos ou inválidos
          if (authStorage && authStorage.state && 
              authStorage.state.isAuthenticated && 
              !authStorage.state.user) {
            console.warn('ProtectedRoute: Dados de autenticação inválidos detectados, limpando...');
            localStorage.removeItem('auth-storage');
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('ProtectedRoute: Erro ao verificar localStorage', error);
      }
    };
    
    checkAuthStorage();
  }, []);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Carregando...
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Verificando suas credenciais
        </p>
      </div>
    );
  }

  return <>{children}</>;
} 