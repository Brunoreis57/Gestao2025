'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { FaCheck, FaTimes, FaUser, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    pendingUsers, 
    approvePendingUser, 
    rejectPendingUser 
  } = useAuthStore();
  
  const [isProcessingUser, setIsProcessingUser] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verificar autenticação e se o usuário é administrador
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Função para formatar a data
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Função para aprovar um usuário
  const handleApproveUser = async (userId: string) => {
    setIsProcessingUser(userId);
    setProcessingError(null);
    setSuccessMessage(null);
    
    try {
      await approvePendingUser(userId);
      setSuccessMessage('Usuário aprovado com sucesso!');
      
      // Reset da mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setProcessingError('Erro ao aprovar usuário. Tente novamente.');
    } finally {
      setIsProcessingUser(null);
    }
  };

  // Função para rejeitar um usuário
  const handleRejectUser = async (userId: string) => {
    setIsProcessingUser(userId);
    setProcessingError(null);
    setSuccessMessage(null);
    
    try {
      await rejectPendingUser(userId);
      setSuccessMessage('Usuário rejeitado com sucesso!');
      
      // Reset da mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setProcessingError('Erro ao rejeitar usuário. Tente novamente.');
    } finally {
      setIsProcessingUser(null);
    }
  };

  // Caso ainda esteja carregando a autenticação
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <FaClock className="text-blue-500 text-4xl mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Verificando permissões...</h1>
          <p className="text-gray-600">Por favor, aguarde enquanto verificamos suas credenciais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gerenciamento de Usuários</h1>
        
        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        {/* Mensagem de erro */}
        {processingError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {processingError}
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Usuários Pendentes</h2>
          
          {pendingUsers.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-md text-center">
              <FaUser className="mx-auto text-gray-400 text-3xl mb-2" />
              <p className="text-gray-600">Não há usuários pendentes de aprovação no momento.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nome</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Data de Cadastro</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-800">{user.name}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{formatDateTime(user.createdAt)}</td>
                      <td className="py-4 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            disabled={isProcessingUser === user.id}
                            className="flex items-center justify-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                          >
                            <FaCheck className="mr-1" />
                            Aprovar
                          </button>
                          <button
                            onClick={() => handleRejectUser(user.id)}
                            disabled={isProcessingUser === user.id}
                            className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
                          >
                            <FaTimes className="mr-1" />
                            Rejeitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 