'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const { resetPassword, isAuthenticated, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'initial' | 'submitting' | 'success' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirecionar para a página inicial se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Por favor, insira um endereço de email válido.');
      return;
    }
    
    setStatus('submitting');
    setErrorMessage(null);
    
    try {
      await resetPassword(email);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      if (error === 'Email não encontrado') {
        setErrorMessage('Este email não está cadastrado em nosso sistema.');
      } else {
        setErrorMessage('Ocorreu um erro ao processar sua solicitação. Tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
              <FaLock className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Recuperação de Senha</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Informe seu email para receber as instruções de recuperação de senha
            </p>
          </div>
          
          {status === 'success' ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-md">
                <p>Uma mensagem com instruções para redefinir sua senha foi enviada para <strong>{email}</strong>.</p>
                <p className="mt-2">Verifique sua caixa de entrada e siga as instruções.</p>
              </div>
              <div className="mt-6">
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Voltar para a página de login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                  {errorMessage}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'submitting'}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-70"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Enviando...' : 'Enviar Instruções'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 