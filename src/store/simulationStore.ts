import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Simulation {
  id: string;
  date: string;
  hoursWorked: number;
  distance: number;
  consumption: number;
  fuelPrice: number;
  grossEarnings: number;
  fuelCost: number;
  netEarnings: number;
  earningsPerHour: number;
  earningsPerKm: number;
}

interface SimulationState {
  simulations: Simulation[];
  addSimulation: (simulation: Omit<Simulation, 'id' | 'fuelCost' | 'netEarnings' | 'earningsPerHour' | 'earningsPerKm'>) => void;
  removeSimulation: (id: string) => void;
  clearSimulations: () => void;
  addMultipleSimulations: (simulations: Simulation[]) => void;
}

// Função para limpar dados muito antigos para evitar o crescimento excessivo do localStorage
const cleanupOldSimulations = (simulations: Simulation[]) => {
  const MAX_SIMULATIONS = 100; // Limitar o número máximo de simulações salvas
  const DAYS_TO_KEEP = 365; // Manter apenas simulações do último ano
  
  if (simulations.length <= MAX_SIMULATIONS) {
    return simulations;
  }
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  // Primeiro, remover simulações mais antigas que um ano
  let filtered = simulations.filter(sim => 
    new Date(sim.date) > oneYearAgo
  );
  
  // Se ainda tivermos mais do que o máximo, remover as mais antigas pelo timestamp
  if (filtered.length > MAX_SIMULATIONS) {
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    filtered = filtered.slice(0, MAX_SIMULATIONS);
  }
  
  return filtered;
};

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      simulations: [],
      
      addSimulation: (simulationData) => {
        const id = crypto.randomUUID();
        const fuelCost = (simulationData.distance / simulationData.consumption) * simulationData.fuelPrice;
        const netEarnings = simulationData.grossEarnings - fuelCost;
        const earningsPerHour = netEarnings / simulationData.hoursWorked;
        const earningsPerKm = netEarnings / simulationData.distance;
        
        const newSimulation: Simulation = {
          ...simulationData,
          id,
          fuelCost,
          netEarnings,
          earningsPerHour,
          earningsPerKm
        };
        
        set((state) => ({
          simulations: [...state.simulations, newSimulation]
        }));
      },
      
      removeSimulation: (id) => {
        set((state) => ({
          simulations: state.simulations.filter((simulation) => simulation.id !== id)
        }));
      },
      
      clearSimulations: () => {
        set(() => ({ simulations: [] }));
      },
      
      addMultipleSimulations: (simulations) => {
        set((state) => ({
          simulations: [...state.simulations, ...simulations]
        }));
      }
    }),
    {
      name: 'simulations-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
); 