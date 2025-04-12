import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updatePassword,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface User {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;
  createdAt: Date;
}

// Registrar um novo usuário
export async function registerUser(name: string, email: string, password: string): Promise<User> {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Adicionar informações adicionais no Firestore
    const userData: Omit<User, 'uid'> = {
      email: user.email || email,
      name,
      isAdmin: false, // Por padrão, novos usuários não são administradores
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return {
      uid: user.uid,
      ...userData
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
}

// Login de usuário
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Buscar dados adicionais do usuário no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<User, 'uid'>;
      
      return {
        uid: user.uid,
        ...userData
      };
    } else {
      throw new Error('Dados do usuário não encontrados');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}

// Logout de usuário
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

// Recuperação de senha
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Erro ao enviar email de recuperação de senha:', error);
    throw error;
  }
}

// Atualizar senha
export async function changePassword(user: FirebaseUser, newPassword: string): Promise<void> {
  try {
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
}

// Atualizar perfil do usuário
export async function updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
  try {
    const { uid, createdAt, ...updateData } = data; // Remover campos que não devem ser atualizados
    
    await updateDoc(doc(db, 'users', userId), updateData);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

// Obter usuário atual do Firestore
export async function getCurrentUser(user: FirebaseUser): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as Omit<User, 'uid'>;
      
      return {
        uid: user.uid,
        ...userData
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    throw error;
  }
}

// Obter todos os usuários (apenas para admins)
export async function getAllUsers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users: User[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as Omit<User, 'uid'>;
      users.push({
        uid: doc.id,
        ...userData
      });
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar todos os usuários:', error);
    throw error;
  }
} 