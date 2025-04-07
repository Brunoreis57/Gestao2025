import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
}

// Lista de usuários pré-definidos (em produção, isso viria de um banco de dados)
const predefinedUsers = [
  {
    email: 'bruno.g.reis@gmail.com',
    password: 'Cambota2205',
    name: 'Bruno Reis'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Tentando login com:', { email });
          
          // Simula uma chamada à API adicionando um delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const normalizedEmail = email.trim().toLowerCase();
          
          const user = predefinedUsers.find(user => 
            user.email.toLowerCase() === normalizedEmail && 
            user.password === password
          );
          
          if (user) {
            console.log('Usuário encontrado, autenticação bem-sucedida');
            set({ 
              user: { email: user.email, name: user.name },
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            console.log('Usuário não encontrado ou senha incorreta');
            // Verificação adicional para ajudar na depuração
            const userExists = predefinedUsers.find(u => u.email.toLowerCase() === normalizedEmail);
            if (userExists) {
              console.log('Usuário existe, mas senha incorreta');
            } else {
              console.log('Usuário não existe');
            }
            
            set({ 
              error: 'Email ou senha inválidos',
              isLoading: false,
              user: null,
              isAuthenticated: false 
            });
          }
        } catch (error) {
          console.error('Erro durante o login:', error);
          set({ 
            error: 'Ocorreu um erro durante o login',
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
        }
      },
      
      logout: () => {
        console.log('Realizando logout');
        set({ 
          user: null,
          isAuthenticated: false,
          error: null
        });
      },
      
      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simula uma chamada à API adicionando um delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const normalizedEmail = email.trim().toLowerCase();
          const user = predefinedUsers.find(user => user.email.toLowerCase() === normalizedEmail);
          
          if (user) {
            // Em um caso real, aqui enviaríamos um email
            // Por enquanto apenas simulamos sucesso
            set({ isLoading: false });
            return Promise.resolve();
          } else {
            set({ 
              error: 'Email não encontrado',
              isLoading: false 
            });
            return Promise.reject('Email não encontrado');
          }
        } catch (error) {
          set({ 
            error: 'Ocorreu um erro ao processar a recuperação de senha',
            isLoading: false 
          });
          return Promise.reject('Erro ao processar recuperação');
        }
      },
      
      updatePassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simula uma chamada à API adicionando um delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Em um caso real, validaríamos o token e atualizaríamos a senha
          // Por enquanto apenas simulamos sucesso
          set({ isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({ 
            error: 'Ocorreu um erro ao atualizar a senha',
            isLoading: false 
          });
          return Promise.reject('Erro ao atualizar senha');
        }
      }
    }),
    {
      name: 'auth-storage', // nome para persistência no localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
); 