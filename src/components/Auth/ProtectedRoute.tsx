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
  const { user, firebaseUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecks, setAuthChecks] = useState(0);
  const router = useRouter();

  // Adicionar log detalhado do ciclo de vida do componente
  useEffect(() => {
    console.log('ProtectedRoute: Componente montado');
    
    return () => {
      console.log('ProtectedRoute: Componente desmontado');
    };
  }, []);

  // Log detalhado das alterações nos estados principais
  useEffect(() => {
    console.log('ProtectedRoute: Estado de autenticação alterado:', { 
      user, 
      firebaseUser: firebaseUser ? `UID: ${firebaseUser.uid}` : 'nenhum',
      authLoading, 
      isLoading,
      authChecks
    });
  }, [user, firebaseUser, authLoading, isLoading, authChecks]);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!authLoading) {
      // Incrementar contador para detectar loops infinitos
      setAuthChecks(prev => prev + 1);
      
      console.log('ProtectedRoute: Verificação de autenticação #', authChecks + 1, { 
        isAuthenticated: !!user, 
        user: user ? `${user.name} (${user.email})` : 'nenhum', 
        authLoading,
        firebaseUser: firebaseUser ? `UID: ${firebaseUser.uid}` : 'nenhum'
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
  }, [user, authLoading, router, firebaseUser, authChecks]);

  // Limpar dados de autenticação inválidos se necessário
  useEffect(() => {
    const checkAuthStorage = () => {
      try {
        const authStorageRaw = localStorage.getItem('auth-storage');
        console.log('ProtectedRoute: Verificando localStorage auth-storage', 
          authStorageRaw ? 'dados encontrados' : 'dados não encontrados');
        
        if (authStorageRaw) {
          const authStorage = JSON.parse(authStorageRaw);
          console.log('ProtectedRoute: Conteúdo do auth-storage:', {
            hasState: !!authStorage?.state,
            isAuthenticated: authStorage?.state?.isAuthenticated,
            hasUser: !!authStorage?.state?.user
          });
          
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

  // Evitar loops infinitos de verificação
  useEffect(() => {
    if (authChecks > 10) {
      console.error('ProtectedRoute: Possível loop infinito detectado!', { authChecks });
      // Forçar reset do estado para quebrar o loop
      localStorage.removeItem('auth-storage');
      window.location.href = '/login?reset=true';
    }
  }, [authChecks]);

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
        {authChecks > 5 && (
          <p className="mt-4 text-xs text-red-500">
            Estamos enfrentando um problema ao verificar suas credenciais.
            <button 
              onClick={() => {
                localStorage.removeItem('auth-storage');
                window.location.href = '/login?reset=true';
              }}
              className="ml-2 underline"
            >
              Clique aqui para reiniciar
            </button>
          </p>
        )}
      </div>
    );
  }

  return <>{children}</>;
} 