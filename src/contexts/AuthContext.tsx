"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
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
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          const userDetails = await getCurrentUser(firebaseUser);
          setFirebaseUser(firebaseUser);
          setUser(userDetails);
        } catch (error) {
          console.error("Erro ao buscar detalhes do usuário:", error);
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await loginUser(email, password);
      setUser(user);
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro durante o login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await registerUser(name, email, password);
      setUser(user);
    } catch (error: any) {
      console.error("Erro no registro:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro durante o registro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await logoutUser();
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      console.error("Erro no logout:", error);
      setError('Ocorreu um erro durante o logout');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await resetPassword(email);
    } catch (error: any) {
      console.error("Erro na recuperação de senha:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro ao solicitar recuperação de senha');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    firebaseUser,
    isLoading,
    error,
    login,
    logout,
    register,
    resetPassword: requestPasswordReset,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Função para traduzir códigos de erro do Firebase para mensagens amigáveis em português
function translateFirebaseError(errorCode: string): string | null {
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
    default:
      return null;
  }
} 