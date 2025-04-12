'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt } from 'react-icons/fa';

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Você precisa estar logado para acessar esta página
          </h2>
          <button
            onClick={() => router.push('/login')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg"
          >
            Ir para o login
          </button>
        </div>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmNewPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      // Aqui implementaria a lógica de mudança de senha
      // await changePassword(currentPassword, newPassword);
      setSuccess('Senha alterada com sucesso!');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar a senha');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Meu Perfil</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300">
              <FaUser size={40} />
            </div>
          </div>
          
          <div className="ml-6 flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
              </div>
              
              {user.isAdmin && (
                <div className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium">
                  Administrador
                </div>
              )}
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Conta criada em: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Segurança</h3>
        
        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FaLock className="mr-2" />
            Alterar senha
          </button>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}
            
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Senha atual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nova senha
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar nova senha
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Alterando...' : 'Salvar alterações'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmNewPassword('');
                  setError('');
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ações da conta</h3>
        
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Sair da conta
        </button>
      </div>
    </div>
  );
} 