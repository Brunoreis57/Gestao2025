'use client';

import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function HomePage() {
  // Efeito para redirecionamento automático para o dashboard
  useEffect(() => {
    // Redirecionamento direto para o dashboard sem verificar autenticação
    const redirectTimeout = setTimeout(() => {
      console.log('Redirecionando para o dashboard');
      window.location.href = '/banco';
    }, 1500);

    return () => clearTimeout(redirectTimeout);
  }, []);

  // Página de carregamento simplificada, sem contador
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <FaSpinner className="animate-spin h-16 w-16 text-primary mx-auto" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Gestão 2025</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Carregando sistema...
        </p>
        <button 
          onClick={() => window.location.href = '/banco'}
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Acessar sistema agora
        </button>
      </div>
    </div>
  );
} 