'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Componente de verificação do sistema para debug
export default function HealthCheckPage() {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  const [authState, setAuthState] = useState<Record<string, any>>({});
  
  // Monitorar mudanças no estado de autenticação
  useEffect(() => {
    setMounted(true);
    
    // Capturar o estado de autenticação
    setAuthState({
      isLoading: auth.isLoading,
      user: auth.user ? {
        uid: auth.user.uid,
        email: auth.user.email,
        name: auth.user.name,
        isAdmin: auth.user.isAdmin
      } : null,
      firebaseUser: auth.firebaseUser ? {
        uid: auth.firebaseUser.uid,
        email: auth.firebaseUser.email
      } : null,
      error: auth.error
    });
  }, [auth.isLoading, auth.user, auth.firebaseUser, auth.error]);

  return (
    <div className="min-h-screen p-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Sistema de Diagnóstico
        </h1>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Status do Sistema
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700 dark:text-gray-300">Componente:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${mounted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {mounted ? 'Montado' : 'Não montado'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700 dark:text-gray-300">Autenticação:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${!auth.isLoading ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                {auth.isLoading ? 'Carregando' : 'Carregado'}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="w-32 font-medium text-gray-700 dark:text-gray-300">Usuário:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${auth.user ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                {auth.user ? 'Autenticado' : 'Não autenticado'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Detalhes do Estado de Autenticação
          </h2>
          
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Voltar para Página Inicial
          </button>
          
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir para Login
          </button>
          
          <button 
            onClick={() => {
              auth.forceRefresh();
              setAuthState({
                ...authState,
                refreshing: true
              });
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Atualizar Auth
          </button>
        </div>
      </div>
    </div>
  );
} 