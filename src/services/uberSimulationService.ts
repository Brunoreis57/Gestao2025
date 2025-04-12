import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UberSimulation {
  id?: string;
  date: string;
  hoursWorked: number;
  distance: number;
  fuelPrice: number;
  earnings: number;
  consumption: number;
  fuelCost: number;
  netEarnings: number;
  earningsPerHour: number;
  earningsPerKm: number;
  userId: string; // Para associar simulações a usuários específicos
  createdAt?: Timestamp;
}

const COLLECTION_NAME = 'uberSimulations';

export async function addSimulation(simulation: Omit<UberSimulation, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...simulation,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar simulação:', error);
    throw error;
  }
}

export async function getSimulationsByUser(userId: string): Promise<UberSimulation[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const simulations: UberSimulation[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      simulations.push({
        id: doc.id,
        ...data as Omit<UberSimulation, 'id'>
      });
    });
    
    return simulations;
  } catch (error) {
    console.error('Erro ao buscar simulações:', error);
    throw error;
  }
}

export async function deleteSimulation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erro ao excluir simulação:', error);
    throw error;
  }
}

export async function updateSimulation(id: string, data: Partial<UberSimulation>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Remover campos que não devem ser atualizados
    const { id: _, createdAt, ...updateData } = data;
    
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Erro ao atualizar simulação:', error);
    throw error;
  }
}

export async function deleteAllSimulationsByUser(userId: string): Promise<void> {
  try {
    const simulations = await getSimulationsByUser(userId);
    
    // Excluir cada simulação individualmente
    const deletePromises = simulations.map(sim => {
      if (sim.id) {
        return deleteSimulation(sim.id);
      }
    });
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Erro ao excluir todas as simulações:', error);
    throw error;
  }
} 