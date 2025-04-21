'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError, clearError, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError('');
    setLocalLoading(true);

    try {
      console.log('Iniciando login com:', email);
      await login(email, password);
      console.log('Login bem-sucedido, redirecionando...');
      router.push('/banco');
    } catch (error: any) {
      console.error('Erro no login:', error);
      setFormError(error.message || 'Ocorreu um erro durante o login');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Entrar no Sistema
        </h2>
        
        {(formError || authError) && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {formError || authError}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Seu email"
                disabled={localLoading || isLoading}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Sua senha"
                disabled={localLoading || isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                disabled={localLoading || isLoading}
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <FiEye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/recuperar-senha" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/cadastro" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Criar conta
              </Link>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={localLoading || isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                localLoading || isLoading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {localLoading || isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setEmail('teste@teste.com');
                  setPassword('123456');
                  setTimeout(() => handleSubmit(new Event('submit') as any), 100);
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                Login de teste (Dev)
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 