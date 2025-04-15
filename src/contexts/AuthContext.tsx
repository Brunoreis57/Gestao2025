"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset as firebaseConfirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User, loginUser, registerUser, logoutUser, resetPassword, getCurrentUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  forceRefresh: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  confirmPasswordReset: async () => {},
  clearError: () => {},
  forceRefresh: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Debugging flags
  const [authTimeoutDetected, setAuthTimeoutDetected] = useState(false);

  // Função para forçar a atualização do contexto
  const forceRefresh = useCallback(() => {
    console.log('AuthContext: Forçando atualização do contexto');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Monitorar mudanças no estado de autenticação do Firebase
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let unsubscribe = () => {};
    
    console.log('AuthContext: Configurando observador de autenticação');

    // Reduzir o timeout para apenas 3 segundos
    timeoutId = setTimeout(() => {
      console.warn('AuthContext: Timeout de autenticação detectado. O Firebase pode estar com problemas de conectividade.');
      setAuthTimeoutDetected(true);
      setIsLoading(false);
    }, 3000);
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
        console.log('AuthContext: Estado de autenticação alterado', { 
          isAuthenticated: !!currentFirebaseUser,
          uid: currentFirebaseUser?.uid
        });
        
        clearTimeout(timeoutId);
        setAuthTimeoutDetected(false);
        
        if (currentFirebaseUser) {
          try {
            console.log('AuthContext: Buscando detalhes do usuário');
            const userDetails = await getCurrentUser(currentFirebaseUser);
            
            if (userDetails) {
              console.log('AuthContext: Detalhes do usuário encontrados', { 
                name: userDetails.name,
                email: userDetails.email
              });
              setFirebaseUser(currentFirebaseUser);
              setUser(userDetails);
            } else {
              console.warn('AuthContext: Usuário autenticado, mas sem detalhes no Firestore');
              setFirebaseUser(currentFirebaseUser);
              setUser(null);
              // Tentar logout automático para corrigir o estado
              try {
                await signOut(auth);
              } catch (logoutError) {
                console.error('AuthContext: Erro ao fazer logout automático', logoutError);
              }
            }
          } catch (error) {
            console.error("AuthContext: Erro ao buscar detalhes do usuário:", error);
            setFirebaseUser(currentFirebaseUser);
            setUser(null);
          }
        } else {
          console.log('AuthContext: Usuário não autenticado');
          setFirebaseUser(null);
          setUser(null);
        }
        
        setIsLoading(false);
      });
    } catch (initError) {
      console.error("AuthContext: Erro ao inicializar observador de autenticação:", initError);
      clearTimeout(timeoutId);
      setIsLoading(false);
    }

    return () => {
      console.log('AuthContext: Removendo observador de autenticação');
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [refreshTrigger]);

  // Efeito para verificar se o localStorage está funcionando corretamente
  useEffect(() => {
    try {
      // Teste básico para verificar se o localStorage está disponível
      localStorage.setItem('auth-test', 'test');
      const testValue = localStorage.getItem('auth-test');
      if (testValue !== 'test') {
        console.warn('AuthContext: localStorage não está funcionando corretamente');
      } else {
        localStorage.removeItem('auth-test');
      }
    } catch (error) {
      console.error('AuthContext: Erro ao acessar localStorage', error);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthContext: Iniciando login', { email });
    setIsLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Login Firebase bem-sucedido', { uid: userCredential.user.uid });
      
      const userDetails = await getCurrentUser(userCredential.user);
      if (userDetails) {
        console.log('AuthContext: Detalhes do usuário obtidos com sucesso');
        setFirebaseUser(userCredential.user);
        setUser(userDetails);
      } else {
        console.error('AuthContext: Usuário não encontrado no Firestore após login');
        throw new Error('Usuário não encontrado');
      }
    } catch (error: any) {
      console.error("AuthContext: Erro no login:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro durante o login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('AuthContext: Iniciando registro', { name, email });
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await registerUser(name, email, password);
      console.log('AuthContext: Registro bem-sucedido', { uid: user.uid });
      setUser(user);
    } catch (error: any) {
      console.error("AuthContext: Erro no registro:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro durante o registro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('AuthContext: Iniciando logout');
    setIsLoading(true);
    setError(null);
    
    try {
      await signOut(auth);
      console.log('AuthContext: Logout bem-sucedido');
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      console.error("AuthContext: Erro no logout:", error);
      setError('Ocorreu um erro durante o logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('AuthContext: Iniciando recuperação de senha', { email });
    setIsLoading(true);
    setError(null);
    
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('AuthContext: Email de recuperação enviado com sucesso');
    } catch (error: any) {
      console.error("AuthContext: Erro na recuperação de senha:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro ao solicitar recuperação de senha');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPasswordReset = async (token: string, newPassword: string) => {
    console.log('AuthContext: Iniciando confirmação de redefinição de senha');
    setIsLoading(true);
    setError(null);
    
    try {
      await firebaseConfirmPasswordReset(auth, token, newPassword);
      console.log('AuthContext: Senha redefinida com sucesso');
    } catch (error: any) {
      console.error("AuthContext: Erro ao redefinir senha:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro ao redefinir senha');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    if (error) {
      console.log('AuthContext: Limpando mensagem de erro');
      setError(null);
    }
  };

  // Adicionar tratamento para timeout de autenticação
  useEffect(() => {
    if (authTimeoutDetected) {
      console.warn('AuthContext: Resolvendo timeout de autenticação');
      // Se houver timeout, forçar estado de não autenticado para evitar problemas
      setUser(null);
      setFirebaseUser(null);
    }
  }, [authTimeoutDetected]);

  const value = {
    user,
    firebaseUser,
    isLoading,
    error,
    login,
    logout,
    register,
    resetPassword,
    confirmPasswordReset,
    clearError,
    forceRefresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Função para traduzir códigos de erro do Firebase para mensagens amigáveis em português
function translateFirebaseError(errorCode: string): string | null {
  console.log('AuthContext: Traduzindo código de erro', { errorCode });
  
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Endereço de email inválido.';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada.';
    case 'auth/user-not-found':
      return 'Não existe conta com este email.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/email-already-in-use':
      return 'Este email já está sendo usado por outra conta.';
    case 'auth/weak-password':
      return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas consecutivas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Erro de conexão com a internet. Verifique sua conexão e tente novamente.';
    case 'auth/internal-error':
      return 'Erro interno de autenticação. Tente novamente mais tarde.';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas.';
    default:
      return null;
  }
} 