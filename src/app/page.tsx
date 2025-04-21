'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(3);

  // Função de redirecionamento forçado usando window.location
  const forceRedirect = (path: string) => {
    console.log(`Redirecionando para ${path} via window.location`);
    window.location.href = path;
  };

  // Contador regressivo para mostrar ao usuário quanto tempo falta para o redirecionamento
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Quando o contador chegar a zero, redirecionar para login
      forceRedirect('/login');
    }
  }, [countdown]);

  // Efeito para decidir para onde redirecionar com base no estado de autenticação
  useEffect(() => {
    // Se já sabemos o estado de autenticação (não está carregando)
    if (!isLoading) {
      if (user) {
        // Se o usuário estiver autenticado, redireciona para o dashboard
        console.log('Usuário autenticado, redirecionando para o dashboard');
        forceRedirect('/banco');
      } else {
        // Se não estiver autenticado, redireciona para o login
        console.log('Usuário não autenticado, redirecionando para o login');
        forceRedirect('/login');
      }
    }
  }, [user, isLoading]);

  // Enquanto decide para onde redirecionar, mostra uma tela de carregamento com contador
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaSpinner className="animate-spin h-16 w-16 text-primary mx-auto" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Gestão 2025</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Carregando sistema...
          {countdown < 3 && (
            <span className="block mt-2">
              Redirecionando em {countdown} {countdown === 1 ? 'segundo' : 'segundos'}
            </span>
          )}
        </p>
        <button 
          onClick={() => forceRedirect('/login')}
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Ir para login agora
        </button>
      </div>
    </div>
  );
} 