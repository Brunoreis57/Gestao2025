import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Event {
  id: string;
  title: string;
  date?: string;
  time?: string;
  description?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  completed?: boolean;
  marker?: {
    name: string;
    color: string;
  };
}

interface EventStore {
  events: Event[];
  markers: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  addEvent: (event: Omit<Event, 'id'>) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  toggleEventCompletion: (id: string) => void;
  addMarker: (name: string, color: string) => void;
  removeMarker: (id: string) => void;
  updateMarker: (id: string, name: string, color: string) => void;
}

const formatDate = (dateStr: string) => {
  // Cria uma data local a partir da string YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Formata de volta para YYYY-MM-DD mantendo a data local
  return date.getFullYear() + '-' + 
         String(date.getMonth() + 1).padStart(2, '0') + '-' + 
         String(date.getDate()).padStart(2, '0');
};

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [],
      markers: [],

      addEvent: (event) => {
        const newEvent = { 
          ...event, 
          id: Date.now().toString(),
          date: event.date ? formatDate(event.date) : undefined
        };
        
        // Se for recorrente, criar eventos para os próximos meses
        if (event.isRecurring && event.date) {
          const events = [newEvent];
          const [year, month, day] = event.date.split('-').map(Number);
          const baseDate = new Date(year, month - 1, day);
          
          // Criar eventos para os próximos 6 meses
          for (let i = 1; i <= 6; i++) {
            const nextDate = new Date(baseDate);
            
            if (event.recurrencePattern === 'daily') {
              nextDate.setDate(nextDate.getDate() + i);
            } else if (event.recurrencePattern === 'weekly') {
              nextDate.setDate(nextDate.getDate() + (i * 7));
            } else if (event.recurrencePattern === 'monthly') {
              nextDate.setMonth(nextDate.getMonth() + i);
            }

            events.push({
              ...newEvent,
              id: Date.now().toString() + i,
              date: formatDate(`${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`),
            });
          }

          set((state) => ({
            events: [...state.events, ...events],
          }));
        } else {
          set((state) => ({
            events: [...state.events, newEvent],
          }));
        }
      },

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { 
              ...event, 
              ...updatedEvent,
              date: updatedEvent.date ? formatDate(updatedEvent.date) : event.date
            } : event
          ),
        })),

      toggleEventCompletion: (id) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, completed: !event.completed } : event
          ),
        })),

      addMarker: (name, color) =>
        set((state) => ({
          markers: [...state.markers, { id: Date.now().toString(), name, color }],
        })),

      removeMarker: (id) =>
        set((state) => ({
          markers: state.markers.filter((marker) => marker.id !== id),
          events: state.events.map(event => 
            event.marker && event.marker.name === state.markers.find(m => m.id === id)?.name
              ? { ...event, marker: undefined }
              : event
          ),
        })),

      updateMarker: (id, name, color) =>
        set((state) => {
          const oldMarker = state.markers.find(m => m.id === id);
          return {
            markers: state.markers.map(marker =>
              marker.id === id ? { ...marker, name, color } : marker
            ),
            events: state.events.map(event =>
              event.marker && event.marker.name === oldMarker?.name
                ? { ...event, marker: { name, color } }
                : event
            ),
          };
        }),
    }),
    {
      name: 'event-storage',
    }
  )
); 