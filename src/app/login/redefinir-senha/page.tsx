'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FaLock, FaSpinner, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formState, setFormState] = useState<'initial' | 'submitting' | 'success' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const { updatePassword } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Em um cenário real, validaríamos o token aqui
    if (!token) {
      setFormState('error');
      setErrorMessage('Token inválido ou expirado. Solicite um novo link de recuperação.');
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setFormState('submitting');
    
    try {
      // Em um cenário real, o token seria validado no backend
      await updatePassword(token || '', password);
      setFormState('success');
    } catch (error) {
      setFormState('error');
      setErrorMessage('Ocorreu um erro ao redefinir sua senha. Tente novamente mais tarde.');
    }
  };

  // Redirecionamento automático após 5 segundos em caso de sucesso
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (formState === 'success') {
      timer = setTimeout(() => {
        router.push('/login');
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formState, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Redefinir Senha</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
            {formState === 'success' ? 'Senha redefinida' : 'Crie uma nova senha'}
          </h2>
        </div>

        {formState === 'success' ? (
          <div className="space-y-6">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md flex items-start">
              <FaCheckCircle className="h-5 w-5 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Senha redefinida com sucesso!</p>
                <p className="text-sm mt-1">Você será redirecionado para a página de login em alguns segundos.</p>
              </div>
            </div>
            <Link 
              href="/login" 
              className="flex items-center justify-center text-primary dark:text-primary-light hover:underline"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Ir para o login agora
            </Link>
          </div>
        ) : formState === 'error' && !token ? (
          <div className="space-y-6">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-md">
              <p className="font-medium">Link inválido</p>
              <p className="text-sm mt-1">{errorMessage}</p>
            </div>
            <Link 
              href="/login/recuperar-senha" 
              className="flex items-center justify-center text-primary dark:text-primary-light hover:underline"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nova senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={formState === 'submitting'}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmar senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Confirmar nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={formState === 'submitting'}
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  href="/login" 
                  className="text-primary dark:text-primary-light hover:underline flex items-center"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao login
                </Link>

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 flex items-center"
                >
                  {formState === 'submitting' ? (
                    <>
                      <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                      Redefinindo...
                    </>
                  ) : (
                    'Redefinir senha'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 