"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Interface simplificada para o usuário sem autenticação
interface User {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User;
  isLoading: boolean;
  error: null;
}

// Criar um usuário simulado para todos usarem
const mockUser: User = {
  uid: 'usuario-simulado',
  email: 'usuario@exemplo.com',
  name: 'Usuário do Sistema',
  isAdmin: true
};

const AuthContext = createContext<AuthContextType>({
  user: mockUser,
  isLoading: false,
  error: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Efeito de inicialização - simulação de carregamento
  useEffect(() => {
    console.log('Inicializando contexto de usuário simulado');
    
    // Simular um pequeno atraso de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log('Usuário simulado carregado');
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Valor simplificado do contexto
  const value = {
    user: mockUser,
    isLoading,
    error: null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 