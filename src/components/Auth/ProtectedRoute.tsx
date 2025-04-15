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
  // Inicializar como false para não mostrar a tela de carregamento
  const [isLoading, setIsLoading] = useState(false);
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
      authChecks
    });
  }, [user, firebaseUser, authLoading, isLoading, authChecks]);

  // Verificação rápida de autenticação - sem estado de carregamento
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
        // Redireciona sem mostrar tela de carregamento
        router.replace('/login');
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
    if (authChecks > 10) {
      console.error('ProtectedRoute: Possível loop infinito detectado!', { authChecks });
      // Forçar reset do estado para quebrar o loop
      localStorage.removeItem('auth-storage');
      window.location.href = '/login?reset=true';
    }
  }, [authChecks]);

  // Se o usuário estiver logado, sempre renderizar o conteúdo
  // Nunca mostrar a tela de carregamento
  if (user) {
    return <>{children}</>;
  }

  // Caso esteja verificando autenticação e não tenhamos confirmação:
  // - Se não estivermos carregando, mostrar conteúdo mesmo assim
  // - Se estivermos carregando, mostrar uma versão simplificada sem mensagem
  if (!isLoading && !authLoading) {
    return <>{children}</>;
  }

  // Versão extremamente simplificada do carregamento (sem mensagem)
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <FaSpinner className="animate-spin h-12 w-12 text-primary" />
    </div>
  );
} 