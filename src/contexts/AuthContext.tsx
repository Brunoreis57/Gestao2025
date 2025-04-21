"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { User } from '@/services/authService';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  forceRefresh: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  clearError: () => {},
  forceRefresh: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para recuperar os dados do usuário do Firestore
  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<User, 'uid'>;
        return {
          uid: firebaseUser.uid,
          ...userData
        };
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  };

  // Monitorar mudanças na autenticação
  useEffect(() => {
    console.log('Configurando observer de autenticação');
    setIsLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      console.log('Estado de autenticação alterado:', currentFirebaseUser ? 'autenticado' : 'não autenticado');
      
      if (currentFirebaseUser) {
        try {
          const userData = await fetchUserData(currentFirebaseUser);
          
          if (userData) {
            setFirebaseUser(currentFirebaseUser);
            setUser(userData);
          } else {
            // Se não encontrou dados do usuário, fazer logout
            console.warn('Usuário autenticado, mas sem dados no Firestore');
            await signOut(auth);
            setFirebaseUser(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Erro ao processar autenticação:', error);
          setFirebaseUser(null);
          setUser(null);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [refreshKey]);

  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Login no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Buscar dados do usuário
      const userData = await fetchUserData(userCredential.user);
      
      if (userData) {
        setFirebaseUser(userCredential.user);
        setUser(userData);
        return;
      }
      
      // Se não encontrou dados, fazer logout
      await signOut(auth);
      throw new Error('Usuário não encontrado no banco de dados');
    } catch (error: any) {
      console.error("Erro no login:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro durante o login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error: any) {
      console.error("Erro no logout:", error);
      setError('Ocorreu um erro durante o logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Recuperação de senha
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Erro na recuperação de senha:", error);
      setError(translateFirebaseError(error.code) || 'Ocorreu um erro ao solicitar recuperação de senha');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar mensagens de erro
  const clearError = () => {
    if (error) {
      setError(null);
    }
  };

  // Força uma atualização do contexto
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      isLoading,
      error,
      login,
      logout,
      resetPassword,
      clearError,
      forceRefresh
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Função para traduzir códigos de erro do Firebase
function translateFirebaseError(errorCode: string): string | null {
  console.log('Traduzindo código de erro:', errorCode);
  
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