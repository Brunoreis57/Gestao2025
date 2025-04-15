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
  // Inicializar como true para mostrar a tela de carregamento inicialmente
  const [isLoading, setIsLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [authChecks, setAuthChecks] = useState(0);
  const router = useRouter();

  // Log detalhado do ciclo de vida do componente
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
      authChecks,
      initialCheckDone
    });
  }, [user, firebaseUser, authLoading, isLoading, authChecks, initialCheckDone]);

  // Verificação principal de autenticação
  useEffect(() => {
    // Só executa essa verificação se o carregamento de autenticação tiver terminado
    if (!authLoading) {
      console.log('ProtectedRoute: Verificação de autenticação principal', { 
        isAuthenticated: !!user, 
        user: user ? `${user.name} (${user.email})` : 'nenhum', 
        initialCheckDone
      });
      
      // Indica que a verificação inicial foi concluída
      if (!initialCheckDone) {
        setInitialCheckDone(true);
      }
      
      // Só incrementa o contador uma vez por ciclo de vida do componente
      if (authChecks === 0) {
        setAuthChecks(1);
      }
      
      // Se não houver usuário e a verificação inicial já tiver sido feita, redireciona
      if (!user && initialCheckDone) {
        console.log('ProtectedRoute: Usuário não autenticado, redirecionando para login');
        router.replace('/login');
      }
      
      // Desativar o estado de carregamento após a verificação
      setIsLoading(false);
    }
  }, [user, authLoading, router, firebaseUser, initialCheckDone, authChecks]);

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
            window.location.href = '/login?reset=true';
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
    if (authChecks > 5) {
      console.error('ProtectedRoute: Possível loop infinito detectado!', { authChecks });
      // Forçar reset do estado para quebrar o loop
      localStorage.removeItem('auth-storage');
      window.location.href = '/login?reset=true';
    }
  }, [authChecks]);

  // Se o usuário estiver logado, renderizar o conteúdo
  if (user) {
    return <>{children}</>;
  }

  // Mostrar tela de carregamento enquanto verificamos a autenticação pela primeira vez
  if (isLoading || (authLoading && !initialCheckDone)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  // Página temporária enquanto o redirecionamento está acontecendo
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaSpinner className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Verificando acesso...</p>
      </div>
    </div>
  );
} 