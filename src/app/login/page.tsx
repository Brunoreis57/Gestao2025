'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, error: authError, clearError, isLoading, user, forceRefresh } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginBlocked, setLoginBlocked] = useState(false);
  const [showFallbackHelp, setShowFallbackHelp] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const redirectAttempted = useRef(false);

  // Verificar se é um redirecionamento de reset
  useEffect(() => {
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      console.log('LoginPage: Redirecionamento de reset detectado. Limpando estado.');
      localStorage.removeItem('auth-storage');
      forceRefresh();
    }
  }, [searchParams, forceRefresh]);

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    console.log('LoginPage: Verificando autenticação...', { 
      user: user ? 'autenticado' : 'não autenticado', 
      isLoading, 
      redirectAttempted: redirectAttempted.current 
    });
    
    if (user && !redirectAttempted.current) {
      console.log('LoginPage: Usuário já autenticado, redirecionando para banco');
      redirectAttempted.current = true;
      
      // Usando setTimeout para garantir que o redirecionamento ocorra depois da renderização
      const redirectTimer = setTimeout(() => {
        router.replace('/banco');
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, router, isLoading]);

  // Adicionar um tempo máximo para o estado de carregamento
  useEffect(() => {
    if (localLoading) {
      const timeoutId = setTimeout(() => {
        // Se ainda estiver carregando após 5 segundos, forçar o fim do carregamento
        console.warn('LoginPage: Timeout de carregamento, forçando estado não-carregando');
        setLocalLoading(false);
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [localLoading]);

  // Monitorar tentativas de login para prevenir muitas tentativas
  useEffect(() => {
    if (loginAttempts >= 5) {
      console.warn('LoginPage: Muitas tentativas de login detectadas, bloqueando temporariamente');
      setLoginBlocked(true);
      
      const timer = setTimeout(() => {
        console.log('LoginPage: Desbloqueando login após timeout');
        setLoginBlocked(false);
        setLoginAttempts(0);
      }, 60000); // 1 minuto de bloqueio
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  // Mostrar opções de ajuda após múltiplas tentativas
  useEffect(() => {
    if (loginAttempts >= 3) {
      setShowFallbackHelp(true);
    }
  }, [loginAttempts]);

  const validateForm = () => {
    let isValid = true;
    const errors = {
      email: '',
      password: ''
    };

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = 'O email é obrigatório';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.email = 'Digite um email válido';
      isValid = false;
    }

    // Validação de senha
    if (!password) {
      errors.password = 'A senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LoginPage: Tentativa de login iniciada');
    clearError();
    setLocalLoading(true);

    if (loginBlocked) {
      console.warn('LoginPage: Tentativa de login enquanto bloqueado');
      setLocalLoading(false);
      return;
    }

    if (!validateForm()) {
      console.log('LoginPage: Formulário inválido');
      setLocalLoading(false);
      return;
    }

    try {
      setLoginAttempts(prev => prev + 1);
      console.log('LoginPage: Enviando credenciais para autenticação');
      await login(email, password);
      console.log('LoginPage: Login bem-sucedido, redirecionando');
      redirectAttempted.current = true;
      router.push('/banco');
    } catch (error) {
      console.error('LoginPage: Erro no login:', error);
      setLocalLoading(false);
    }
  };

  const handleReset = () => {
    console.log('LoginPage: Resetando estado de autenticação');
    localStorage.removeItem('auth-storage');
    // Força a atualização da página para reiniciar todos os estados
    window.location.href = '/login?reset=true';
  };

  // Verificar problemas comuns de conectividade
  const handleCheckNetwork = async () => {
    try {
      console.log('LoginPage: Verificando conectividade com a internet');
      const response = await fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' });
      console.log('LoginPage: Teste de conectividade concluído');
      alert('Sua conexão com a internet parece estar funcionando. O problema pode ser temporário com o servidor de autenticação.');
    } catch (error) {
      console.error('LoginPage: Erro de conectividade detectado', error);
      alert('Parece que você está com problemas de conexão com a internet. Verifique sua conexão e tente novamente.');
    }
  };

  // Se já estiver autenticado, mostrar uma tela de redirecionamento
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center">
          <div className="animate-spin mb-4 h-10 w-10 mx-auto border-4 border-primary-500 border-t-transparent rounded-full"></div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Redirecionando para o sistema...</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Você já está autenticado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Entrar no Sistema
          </h2>
        </div>
        
        {showFallbackHelp && (
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Problemas para entrar?
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                  <p>Verifique se:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Seu email e senha estão corretos</li>
                    <li>Sua conexão com a internet está funcionando</li>
                    <li>Você tem uma conta cadastrada no sistema</li>
                  </ul>
                  <div className="mt-3 flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={handleCheckNetwork}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:hover:bg-yellow-900/70 transition-colors"
                    >
                      Verificar conexão
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70 transition-colors"
                    >
                      <FiRefreshCw className="mr-2 h-4 w-4" />
                      Reiniciar autenticação
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loginBlocked && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Login temporariamente bloqueado
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                  <p>
                    Muitas tentativas de login foram detectadas. Por favor, aguarde um minuto e tente novamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400`}
                  placeholder="Seu email"
                  disabled={loginBlocked || localLoading}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                  }}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 py-2 border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400`}
                  placeholder="Sua senha"
                  disabled={loginBlocked || localLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loginBlocked || localLoading}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
          </div>

          {authError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">{authError}</p>
                </div>
              </div>
            </div>
          )}

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
              disabled={loginBlocked || localLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loginBlocked || localLoading
                  ? 'bg-primary-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {localLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </div>

          {/* Botão temporário para login rápido em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setEmail('teste@teste.com');
                  setPassword('123456');
                  console.log('LoginPage: Dados de teste preenchidos');
                  setTimeout(() => {
                    console.log('LoginPage: Enviando formulário com dados de teste');
                    handleSubmit(new Event('submit') as any);
                  }, 100);
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Login rápido (apenas desenvolvimento)
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 