import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Expense {
  id: number;
  name: string;
  value: number;
  date: string;
  time?: string;
  type: 'debit' | 'credit';
  recurring: boolean;
}

interface Event {
  id: number;
  name: string;
  value: number;
  date: string;
  time: string;
  recurring: boolean;
  completed: boolean;
}

interface FinancialData {
  saldoConta: number;
  limiteCredito: number;
  contasAbertas: number;
}

// Novas interfaces
interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

interface PersonalDebt {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  paid: boolean;
}

interface UberSimulation {
  id: string;
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
}

interface Store {
  expenses: Expense[];
  events: Event[];
  financialData: FinancialData;
  
  // Novas propriedades
  categories: Category[];
  personalDebts: PersonalDebt[];
  uberSimulations: UberSimulation[];
  
  // Funções existentes
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: number) => void;
  updateExpense: (id: number, expense: Partial<Expense>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  removeEvent: (id: number) => void;
  updateEvent: (id: number, event: Partial<Event>) => void;
  updateFinancialData: (data: Partial<FinancialData>) => void;
  
  // Novas funções para categorias
  addCategory: (category: Omit<Category, 'id'>) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  
  // Novas funções para dívidas pessoais
  addPersonalDebt: (debt: Omit<PersonalDebt, 'id'>) => void;
  removePersonalDebt: (id: string) => void;
  updatePersonalDebt: (id: string, debt: Partial<PersonalDebt>) => void;
  toggleDebtPaid: (id: string) => void;
  
  // Novas funções para simulação Uber
  addUberSimulation: (simulation: Omit<UberSimulation, 'id'>) => void;
  removeUberSimulation: (id: string) => void;
  updateUberSimulation: (id: string, simulation: Partial<UberSimulation>) => void;
  clearAllSimulations: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      expenses: [],
      events: [],
      financialData: {
        saldoConta: 5000.0,
        limiteCredito: 8000.0,
        contasAbertas: 1500.0,
      },
      
      // Inicialização das novas propriedades
      categories: [
        { id: '1', name: 'Gasolina', color: 'red' },
        { id: '2', name: 'Empréstimos', color: 'blue' },
        { id: '3', name: 'Compras', color: 'green' },
      ],
      personalDebts: [],
      uberSimulations: [],

      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: Date.now() },
          ],
        })),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          ),
        })),

      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            { ...event, id: Date.now() },
          ],
        })),

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),

      updateFinancialData: (data) =>
        set((state) => ({
          financialData: { ...state.financialData, ...data },
        })),
        
      // Implementação das novas funções
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: Date.now().toString() },
          ],
        })),
        
      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          // Remover a categoria dos débitos pessoais também
          personalDebts: state.personalDebts.map(debt => 
            debt.categoryId === id 
              ? { ...debt, categoryId: '' } 
              : debt
          ),
        })),
        
      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updatedCategory } : category
          ),
        })),
        
      addPersonalDebt: (debt) =>
        set((state) => ({
          personalDebts: [
            ...state.personalDebts,
            { ...debt, id: Date.now().toString(), paid: false },
          ],
        })),
        
      removePersonalDebt: (id) =>
        set((state) => ({
          personalDebts: state.personalDebts.filter((debt) => debt.id !== id),
        })),
        
      updatePersonalDebt: (id, updatedDebt) =>
        set((state) => ({
          personalDebts: state.personalDebts.map((debt) =>
            debt.id === id ? { ...debt, ...updatedDebt } : debt
          ),
        })),
        
      toggleDebtPaid: (id) =>
        set((state) => ({
          personalDebts: state.personalDebts.map((debt) =>
            debt.id === id ? { ...debt, paid: !debt.paid } : debt
          ),
        })),
        
      addUberSimulation: (simulation) =>
        set((state) => ({
          uberSimulations: [
            ...state.uberSimulations,
            { ...simulation, id: Date.now().toString() },
          ],
        })),
        
      removeUberSimulation: (id) =>
        set((state) => ({
          uberSimulations: state.uberSimulations.filter((simulation) => simulation.id !== id),
        })),
        
      updateUberSimulation: (id, updatedSimulation) =>
        set((state) => ({
          uberSimulations: state.uberSimulations.map((simulation) =>
            simulation.id === id ? { ...simulation, ...updatedSimulation } : simulation
          ),
        })),
        
      clearAllSimulations: () =>
        set((state) => ({
          uberSimulations: [],
        })),
    }),
    {
      name: 'financial-storage',
    }
  )
); 