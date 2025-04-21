'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpeza de timeout anterior se existir
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
    }

    // Timeout de segurança para caso a autenticação demore muito
    const fallbackTimeout = setTimeout(() => {
      console.log('Timeout de segurança acionado, redirecionando para login');
      router.replace('/login');
    }, 3000);

    setRedirectTimeout(fallbackTimeout);

    return () => {
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, []); // Executa apenas uma vez na montagem

  useEffect(() => {
    // Se a autenticação já carregou, podemos decidir para onde redirecionar
    if (!isLoading) {
      // Limpar o timeout de segurança
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
        setRedirectTimeout(null);
      }

      if (user) {
        // Se o usuário estiver autenticado, redireciona para o dashboard
        console.log('Usuário autenticado, redirecionando para o dashboard');
        router.replace('/banco');
      } else {
        // Se não estiver autenticado, redireciona para o login
        console.log('Usuário não autenticado, redirecionando para o login');
        router.replace('/login');
      }
    }
  }, [user, isLoading, router, redirectTimeout]);

  // Enquanto decide para onde redirecionar, mostra uma tela de carregamento
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaSpinner className="animate-spin h-16 w-16 text-primary mx-auto" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Gestão 2025</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando sistema...</p>
      </div>
    </div>
  );
} 