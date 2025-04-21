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
  const [showLoading, setShowLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticação e redirecionar se necessário
  useEffect(() => {
    console.log('ProtectedRoute: Verificando autenticação', { 
      autenticado: !!user, 
      carregando: authLoading 
    });

    // Se não estiver carregando e não tiver usuário, redirecionar para login
    if (!authLoading && !user) {
      console.log('ProtectedRoute: Redirecionando para login');
      router.replace('/login');
    }
    
    // Se não estiver carregando ou tiver usuário, pode mostrar o conteúdo
    if (!authLoading || user) {
      setShowLoading(false);
    }
  }, [user, authLoading, router]);

  // Mostrar indicador de carregamento apenas quando necessário
  if (showLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário estiver autenticado, mostrar o conteúdo
  if (user) {
    return <>{children}</>;
  }

  // Estado intermediário - mostra um componente vazio enquanto aguarda redirecionamento
  return null;
} 