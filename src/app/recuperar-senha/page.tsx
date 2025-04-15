'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function RecuperarSenhaPage() {
  const { resetPassword, error: authError, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState(false);

  // Limpar mensagens de erro quando o componente é desmontado
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setFormError('O email é obrigatório');
      return false;
    }
    if (!emailRegex.test(email)) {
      setFormError('Digite um email válido');
      return false;
    }
    return true;
  };

  // Validação em tempo real quando o usuário interage com o campo
  useEffect(() => {
    if (touched && email) {
      validateEmail(email);
    }
  }, [email, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();
    setSuccess(false);
    setTouched(true);

    if (!validateEmail(email)) return;

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
      setTouched(false);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transition-all duration-300"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">
            Recuperar Senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Digite seu email para receber as instruções de recuperação de senha
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-md bg-green-50 dark:bg-green-900/50 p-4 transition-colors duration-300"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 transition-colors duration-300">
                  Email enviado com sucesso! Verifique sua caixa de entrada.
                </p>
                <p className="mt-2 text-xs text-green-700 dark:text-green-300 transition-colors duration-300">
                  Não recebeu o email? Verifique também sua pasta de spam ou tente novamente em alguns minutos.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className={`h-5 w-5 ${formError || authError ? 'text-red-400' : 'text-gray-400'} transition-colors duration-300`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched) validateEmail(e.target.value);
                  }}
                  onBlur={() => setTouched(true)}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border ${
                    formError || authError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 transition-colors duration-300`}
                  placeholder="Seu email"
                />
                {(formError || authError) && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {(formError || authError) && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center transition-colors duration-300"
                >
                  {formError || authError}
                </motion.p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/login"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors duration-300"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading 
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                } transition-all duration-300`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Enviar instruções'
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
} 