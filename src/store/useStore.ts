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

interface Store {
  expenses: Expense[];
  events: Event[];
  financialData: FinancialData;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: number) => void;
  updateExpense: (id: number, expense: Partial<Expense>) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  removeEvent: (id: number) => void;
  updateEvent: (id: number, event: Partial<Event>) => void;
  updateFinancialData: (data: Partial<FinancialData>) => void;
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
    }),
    {
      name: 'financial-storage',
    }
  )
); 