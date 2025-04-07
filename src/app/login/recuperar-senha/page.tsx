'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { FaUser, FaSpinner, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<'initial' | 'submitting' | 'success' | 'error'>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const { resetPassword } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    try {
      await resetPassword(email);
      setFormState('success');
    } catch (error) {
      setFormState('error');
      if (error === 'Email não encontrado') {
        setErrorMessage('Email não encontrado em nosso sistema.');
      } else {
        setErrorMessage('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recuperar Senha</h1>
          <h2 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
            {formState === 'success' ? 'Email enviado' : 'Informe seu email'}
          </h2>
        </div>

        {formState === 'success' ? (
          <div className="space-y-6">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-md flex items-start">
              <FaCheckCircle className="h-5 w-5 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Email enviado com sucesso!</p>
                <p className="text-sm mt-1">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                <p className="text-sm mt-1">Caso não encontre o email, verifique também sua pasta de spam.</p>
              </div>
            </div>
            <Link 
              href="/login" 
              className="flex items-center justify-center text-primary dark:text-primary-light hover:underline"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            {formState === 'error' && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={formState === 'submitting'}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Enviaremos um link para recuperação da sua senha.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  href="/login" 
                  className="text-primary dark:text-primary-light hover:underline flex items-center"
                >
                  <FaArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 flex items-center"
                >
                  {formState === 'submitting' ? (
                    <>
                      <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar link'
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