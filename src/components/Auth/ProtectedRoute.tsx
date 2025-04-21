'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState<NodeJS.Timeout | null>(null);

  // Verificar autenticação e gerenciar estados
  useEffect(() => {
    console.log('ProtectedRoute: Estado de autenticação', { 
      autenticado: !!user, 
      carregando: authLoading 
    });

    // Limpar qualquer timer existente
    if (redirectTimer) {
      clearTimeout(redirectTimer);
      setRedirectTimer(null);
    }

    // Se não estiver carregando e não tiver usuário, redirecionar para login
    if (!authLoading && !user) {
      console.log('ProtectedRoute: Preparando redirecionamento para login');
      
      // Usar window.location para forçar a navegação após um breve delay
      const timer = setTimeout(() => {
        console.log('ProtectedRoute: Forçando redirecionamento para login');
        window.location.href = '/login';
      }, 500);
      
      setRedirectTimer(timer);
    }
    
    // Se não estiver carregando, podemos mostrar o conteúdo ou ir para o login
    if (!authLoading) {
      setShowLoading(false);
    }

    // Cleanup
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [user, authLoading]);

  // Adicionar um timeout de segurança para evitar carregamento infinito
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (showLoading) {
        console.log('ProtectedRoute: Timeout de segurança acionado');
        setShowLoading(false);
        
        // Se ainda não redirecionou, vamos forçar
        if (!user) {
          window.location.href = '/login';
        }
      }
    }, 5000);
    
    return () => clearTimeout(safetyTimeout);
  }, [showLoading, user]);

  // Mostrar indicador de carregamento apenas quando necessário
  if (showLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Ir para login
          </button>
        </div>
      </div>
    );
  }

  // Se o usuário estiver autenticado, mostrar o conteúdo
  if (user) {
    return <>{children}</>;
  }

  // Estado intermediário - mostra um componente mínimo enquanto aguarda redirecionamento
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">Redirecionando para login...</p>
      </div>
    </div>
  );
} 