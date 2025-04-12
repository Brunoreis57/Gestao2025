import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface PendingUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingUsers: PendingUser[];
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  
  // Funções de administração
  approvePendingUser: (userId: string) => Promise<void>;
  rejectPendingUser: (userId: string) => Promise<void>;
}

// Lista de usuários pré-definidos (em produção, isso viria de um banco de dados)
const predefinedUsers = [
  {
    email: 'bruno.g.reis@gmail.com',
    password: 'Cambota2205',
    name: 'Bruno Reis',
    isAdmin: true
  }
];

// Função para simular envio de email
async function sendEmail(to: string, subject: string, body: string) {
  console.log('Enviando email para:', to);
  console.log('Assunto:', subject);
  console.log('Corpo:', body);
  
  // Em um ambiente de produção, você usaria um serviço de email como SendGrid, Mailgun, AWS SES, etc.
  // Exemplo com API de email:
  try {
    // Simula uma chamada à API adicionando um delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulação de envio de email
    const emailData = {
      to,
      subject,
      html: body,
      from: 'noreply@gestao2025.com'
    };
    
    // Aqui você faria uma chamada à API do serviço de email
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(emailData)
    // });
    
    console.log('Email enviado com sucesso:', emailData);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

// Função para simular envio de notificação para o administrador sobre novo cadastro
async function notifyAdminAboutNewUser(newUser: { name: string, email: string }) {
  const adminEmail = 'bruno.g.reis@gmail.com';
  const subject = `[Gestão 2025] Novo usuário cadastrado: ${newUser.name}`;
  const body = `
    <h1>Novo usuário cadastrado</h1>
    <p>Um novo usuário se cadastrou no sistema Gestão 2025.</p>
    <h2>Detalhes do usuário:</h2>
    <ul>
      <li><strong>Nome:</strong> ${newUser.name}</li>
      <li><strong>Email:</strong> ${newUser.email}</li>
    </ul>
    <p>Acesse o sistema para aprovar ou rejeitar este cadastro.</p>
    <p>Atenciosamente,<br>Sistema Gestão 2025</p>
  `;
  
  return sendEmail(adminEmail, subject, body);
}

// Gerar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      pendingUsers: [],

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
              user: { 
                email: user.email, 
                name: user.name,
                isAdmin: user.isAdmin 
              },
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
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simula uma chamada à API adicionando um delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const normalizedEmail = email.trim().toLowerCase();
          
          // Verificar se o email já está em uso entre os usuários confirmados
          const emailExists = predefinedUsers.some(
            user => user.email.toLowerCase() === normalizedEmail
          );
          
          // Verificar se o email já está em uso entre os usuários pendentes
          const isPending = get().pendingUsers.some(
            user => user.email.toLowerCase() === normalizedEmail
          );
          
          if (emailExists) {
            set({ 
              error: 'Este email já está em uso.',
              isLoading: false 
            });
            return Promise.reject({ message: 'Este email já está em uso.' });
          }
          
          if (isPending) {
            set({ 
              error: 'Já existe uma solicitação pendente para este email.',
              isLoading: false 
            });
            return Promise.reject({ message: 'Já existe uma solicitação pendente para este email.' });
          }
          
          // Criar novo usuário pendente
          const newPendingUser: PendingUser = {
            id: generateId(),
            name,
            email: normalizedEmail,
            password,
            createdAt: new Date().toISOString()
          };
          
          // Adicionar à lista de usuários pendentes
          set(state => ({ 
            pendingUsers: [...state.pendingUsers, newPendingUser],
            isLoading: false 
          }));
          
          // Notificar administrador sobre novo registro
          await notifyAdminAboutNewUser({ name, email: normalizedEmail });
          
          return Promise.resolve();
        } catch (error) {
          console.error('Erro durante o registro:', error);
          set({ 
            error: 'Ocorreu um erro durante o cadastro.',
            isLoading: false 
          });
          return Promise.reject({ message: 'Ocorreu um erro durante o cadastro.' });
        }
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
      },
      
      // Funções de administração
      approvePendingUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simula uma chamada à API adicionando um delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const pendingUser = get().pendingUsers.find(user => user.id === userId);
          
          if (!pendingUser) {
            set({ 
              error: 'Usuário pendente não encontrado',
              isLoading: false 
            });
            return Promise.reject('Usuário pendente não encontrado');
          }
          
          // Em um cenário real, você adicionaria o usuário ao banco de dados
          // Aqui, vamos apenas atualizar a lista local (apenas para simulação)
          predefinedUsers.push({
            email: pendingUser.email,
            password: pendingUser.password,
            name: pendingUser.name,
            isAdmin: false // Por padrão, novos usuários não são administradores
          });
          
          // Remover usuário da lista de pendentes
          set(state => ({ 
            pendingUsers: state.pendingUsers.filter(user => user.id !== userId),
            isLoading: false 
          }));
          
          // Enviar email de confirmação ao usuário
          await sendEmail(
            pendingUser.email,
            'Seu cadastro foi aprovado!',
            `<h1>Bem-vindo ao Gestão 2025!</h1>
             <p>Olá ${pendingUser.name},</p>
             <p>Seu cadastro foi aprovado. Você já pode acessar o sistema usando seu email e senha.</p>
             <p>Atenciosamente,<br>Equipe Gestão 2025</p>`
          );
          
          return Promise.resolve();
        } catch (error) {
          console.error('Erro ao aprovar usuário:', error);
          set({ 
            error: 'Ocorreu um erro ao aprovar o usuário',
            isLoading: false 
          });
          return Promise.reject('Erro ao aprovar usuário');
        }
      },
      
      rejectPendingUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simula uma chamada à API adicionando um delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const pendingUser = get().pendingUsers.find(user => user.id === userId);
          
          if (!pendingUser) {
            set({ 
              error: 'Usuário pendente não encontrado',
              isLoading: false 
            });
            return Promise.reject('Usuário pendente não encontrado');
          }
          
          // Remover usuário da lista de pendentes
          set(state => ({ 
            pendingUsers: state.pendingUsers.filter(user => user.id !== userId),
            isLoading: false 
          }));
          
          // Enviar email ao usuário informando que seu cadastro foi rejeitado
          await sendEmail(
            pendingUser.email,
            'Solicitação de cadastro não aprovada',
            `<h1>Solicitação de cadastro não aprovada</h1>
             <p>Olá ${pendingUser.name},</p>
             <p>Infelizmente, sua solicitação de cadastro não foi aprovada neste momento.</p>
             <p>Caso acredite que houve um engano, por favor, entre em contato conosco.</p>
             <p>Atenciosamente,<br>Equipe Gestão 2025</p>`
          );
          
          return Promise.resolve();
        } catch (error) {
          console.error('Erro ao rejeitar usuário:', error);
          set({ 
            error: 'Ocorreu um erro ao rejeitar o usuário',
            isLoading: false 
          });
          return Promise.reject('Erro ao rejeitar usuário');
        }
      }
    }),
    {
      name: 'auth-storage', // nome para persistência no localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        pendingUsers: state.pendingUsers
      }),
    }
  )
); 