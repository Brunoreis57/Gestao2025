import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from '@/contexts/AuthContext';

// Interface para o tipo de simulação
export interface UberSimulation {
  id?: string;
  userId: string;
  date: string;
  hoursWorked: number;
  distance: number;
  consumption: number; 
  fuelPrice: number;
  earnings: number;
  fuelCost: number;
  netEarnings: number;
  earningsPerHour: number;
  earningsPerKm: number;
  createdAt?: Date;
}

export const useUberSimulations = () => {
  const [simulations, setSimulations] = useState<UberSimulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Buscar simulações do usuário atual
  useEffect(() => {
    const loadSimulations = async () => {
      if (!user) {
        setSimulations([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const simulationsRef = collection(db, 'uberSimulations');
        const q = query(
          simulationsRef,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const loadedSimulations: UberSimulation[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<UberSimulation, 'id'>
        }));
        
        setSimulations(loadedSimulations);
      } catch (err) {
        console.error('Erro ao carregar simulações:', err);
        setError('Erro ao carregar simulações. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSimulations();
  }, [user]);

  // Adicionar nova simulação
  const addNewSimulation = async (simulation: Omit<UberSimulation, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) {
      setError('Você precisa estar logado para adicionar simulações');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newSimulation: Omit<UberSimulation, 'id'> = {
        ...simulation,
        userId: user.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'uberSimulations'), newSimulation);
      
      const simulationWithId = {
        id: docRef.id,
        ...newSimulation
      };
      
      setSimulations(prev => [simulationWithId, ...prev]);
      return simulationWithId;
    } catch (err) {
      console.error('Erro ao adicionar simulação:', err);
      setError('Erro ao adicionar simulação. Por favor, tente novamente.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Remover simulação
  const removeSimulation = async (id: string) => {
    if (!user) {
      setError('Você precisa estar logado para remover simulações');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, 'uberSimulations', id));
      setSimulations(prev => prev.filter(sim => sim.id !== id));
      return true;
    } catch (err) {
      console.error('Erro ao remover simulação:', err);
      setError('Erro ao remover simulação. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar todas as simulações
  const clearAllSimulations = async () => {
    if (!user) {
      setError('Você precisa estar logado para limpar simulações');
      return false;
    }

    if (simulations.length === 0) return true;

    setIsLoading(true);
    setError(null);

    try {
      // Excluir cada simulação individualmente
      const deletePromises = simulations.map(sim => 
        sim.id ? deleteDoc(doc(db, 'uberSimulations', sim.id)) : Promise.resolve()
      );
      
      await Promise.all(deletePromises);
      setSimulations([]);
      return true;
    } catch (err) {
      console.error('Erro ao limpar simulações:', err);
      setError('Erro ao limpar simulações. Por favor, tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular médias e estatísticas
  const calculateAverages = () => {
    if (simulations.length === 0) {
      return {
        totalNetEarnings: 0,
        totalFuelCost: 0,
        totalHours: 0,
        totalDistance: 0,
        avgConsumption: 0,
        avgEarningsPerHour: 0,
        avgEarningsPerKm: 0,
        // Tendências (0 = neutro, sem dados suficientes)
        totalNetEarningsTrend: 0,
        fuelCostTrend: 0,
        hoursTrend: 0,
        distanceTrend: 0,
        consumptionTrend: 0,
        earningsPerHourTrend: 0,
        earningsPerKmTrend: 0
      };
    }

    // Calcular totais
    const totalNetEarnings = simulations.reduce((sum, sim) => sum + sim.netEarnings, 0) / simulations.length;
    const totalFuelCost = simulations.reduce((sum, sim) => sum + sim.fuelCost, 0) / simulations.length;
    const totalHours = simulations.reduce((sum, sim) => sum + sim.hoursWorked, 0) / simulations.length;
    const totalDistance = simulations.reduce((sum, sim) => sum + sim.distance, 0) / simulations.length;
    
    // Calcular médias derivadas
    const avgConsumption = simulations.reduce((sum, sim) => sum + sim.consumption, 0) / simulations.length;
    const avgEarningsPerHour = simulations.reduce((sum, sim) => sum + sim.earningsPerHour, 0) / simulations.length;
    const avgEarningsPerKm = simulations.reduce((sum, sim) => sum + sim.earningsPerKm, 0) / simulations.length;

    // Calcular tendências (se tivermos pelo menos 2 simulações)
    let totalNetEarningsTrend = 0;
    let fuelCostTrend = 0;
    let hoursTrend = 0;
    let distanceTrend = 0;
    let consumptionTrend = 0;
    let earningsPerHourTrend = 0;
    let earningsPerKmTrend = 0;

    if (simulations.length >= 2) {
      // Ordenar por data para calcular tendências (mais recentes primeiro)
      const sortedSimulations = [...simulations].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Analisar os últimos 5 ou menos registros para tendências
      const recentSimulations = sortedSimulations.slice(0, Math.min(5, sortedSimulations.length));
      const olderSimulations = sortedSimulations.slice(Math.min(5, sortedSimulations.length));

      if (olderSimulations.length > 0) {
        // Calcular médias para cada grupo
        const recentNetEarnings = recentSimulations.reduce((sum, sim) => sum + sim.netEarnings, 0) / recentSimulations.length;
        const olderNetEarnings = olderSimulations.reduce((sum, sim) => sum + sim.netEarnings, 0) / olderSimulations.length;
        totalNetEarningsTrend = calculateTrendPercentage(olderNetEarnings, recentNetEarnings);

        const recentFuelCost = recentSimulations.reduce((sum, sim) => sum + sim.fuelCost, 0) / recentSimulations.length;
        const olderFuelCost = olderSimulations.reduce((sum, sim) => sum + sim.fuelCost, 0) / olderSimulations.length;
        fuelCostTrend = calculateTrendPercentage(olderFuelCost, recentFuelCost);

        const recentHours = recentSimulations.reduce((sum, sim) => sum + sim.hoursWorked, 0) / recentSimulations.length;
        const olderHours = olderSimulations.reduce((sum, sim) => sum + sim.hoursWorked, 0) / olderSimulations.length;
        hoursTrend = calculateTrendPercentage(olderHours, recentHours);

        const recentDistance = recentSimulations.reduce((sum, sim) => sum + sim.distance, 0) / recentSimulations.length;
        const olderDistance = olderSimulations.reduce((sum, sim) => sum + sim.distance, 0) / olderSimulations.length;
        distanceTrend = calculateTrendPercentage(olderDistance, recentDistance);

        const recentConsumption = recentSimulations.reduce((sum, sim) => sum + sim.consumption, 0) / recentSimulations.length;
        const olderConsumption = olderSimulations.reduce((sum, sim) => sum + sim.consumption, 0) / olderSimulations.length;
        consumptionTrend = calculateTrendPercentage(olderConsumption, recentConsumption);

        const recentEarningsPerHour = recentSimulations.reduce((sum, sim) => sum + sim.earningsPerHour, 0) / recentSimulations.length;
        const olderEarningsPerHour = olderSimulations.reduce((sum, sim) => sum + sim.earningsPerHour, 0) / olderSimulations.length;
        earningsPerHourTrend = calculateTrendPercentage(olderEarningsPerHour, recentEarningsPerHour);

        const recentEarningsPerKm = recentSimulations.reduce((sum, sim) => sum + sim.earningsPerKm, 0) / recentSimulations.length;
        const olderEarningsPerKm = olderSimulations.reduce((sum, sim) => sum + sim.earningsPerKm, 0) / olderSimulations.length;
        earningsPerKmTrend = calculateTrendPercentage(olderEarningsPerKm, recentEarningsPerKm);
      }
    }

    return {
      totalNetEarnings,
      totalFuelCost,
      totalHours,
      totalDistance,
      avgConsumption,
      avgEarningsPerHour,
      avgEarningsPerKm,
      totalNetEarningsTrend,
      fuelCostTrend,
      hoursTrend,
      distanceTrend,
      consumptionTrend,
      earningsPerHourTrend,
      earningsPerKmTrend
    };
  };

  // Função auxiliar para calcular percentual de tendência
  const calculateTrendPercentage = (older: number, recent: number): number => {
    if (older === 0) return 0;
    return ((recent - older) / older) * 100;
  };

  return {
    simulations,
    isLoading,
    error,
    addNewSimulation,
    removeSimulation,
    clearAllSimulations,
    calculateAverages
  };
}; 