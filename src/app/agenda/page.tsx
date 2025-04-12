'use client';

import { useState } from 'react';
import { useEventStore } from '@/store/eventStore';
import type { Event } from '@/store/eventStore';
import dynamic from 'next/dynamic';

const AddEventModal = dynamic(() => import('@/components/AddEventModal'), {
  ssr: false,
  loading: () => <div>Carregando...</div>
});

const EventCard = dynamic(() => import('./components/EventCard'), {
  ssr: false,
  loading: () => <div>Carregando...</div>
});

const EventListItem = dynamic(() => import('./components/EventListItem'), {
  ssr: false,
  loading: () => <div>Carregando...</div>
});

export default function AgendaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [expandedMonths, setExpandedMonths] = useState<string[]>([getCurrentMonth()]);
  const [showCompleted, setShowCompleted] = useState(false);
  const { events, removeEvent, toggleEventCompletion, updateEvent, addEvent } = useEventStore();

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  const groupEventsByMonth = () => {
    const grouped = events.reduce((acc, event) => {
      if (!event.date) return acc;
      
      const eventDate = new Date(event.date);
      const monthKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          markerGroups: {}
        };
      }

      const markerKey = event.marker?.name || 'Sem marcador';
      if (!acc[monthKey].markerGroups[markerKey]) {
        acc[monthKey].markerGroups[markerKey] = [];
      }

      if (!event.completed || showCompleted) {
        acc[monthKey].markerGroups[markerKey].push(event);
      }

      return acc;
    }, {} as Record<string, { 
      markerGroups: Record<string, Event[]>
    }>);

    // Remove grupos vazios
    Object.keys(grouped).forEach(monthKey => {
      Object.keys(grouped[monthKey].markerGroups).forEach(markerKey => {
        if (grouped[monthKey].markerGroups[markerKey].length === 0) {
          delete grouped[monthKey].markerGroups[markerKey];
        }
      });
      if (Object.keys(grouped[monthKey].markerGroups).length === 0) {
        delete grouped[monthKey];
      }
    });

    return grouped;
  };

  const groupedEvents = groupEventsByMonth();

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }
    setIsModalOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      removeEvent(id);
    }
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthKey)
        ? prev.filter(m => m !== monthKey)
        : [...prev, monthKey]
    );
  };

  const sortMonths = (entries: [string, any][]) => {
    const currentMonth = getCurrentMonth();
    
    return entries.sort(([a], [b]) => {
      // Se um dos meses é o atual, ele deve vir primeiro
      if (a === currentMonth) return -1;
      if (b === currentMonth) return 1;
      // Caso contrário, ordenar em ordem decrescente
      return b.localeCompare(a);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded ${viewMode === 'card' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
              title="Visualização em cards"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
              title="Visualização em lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className={`p-2 rounded-lg ${
              showCompleted 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            title={showCompleted ? "Ocultar eventos concluídos" : "Mostrar eventos concluídos"}
          >
            {showCompleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            )}
          </button>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Novo Evento
        </button>
      </div>
      </div>

      <div className="space-y-6">
        {sortMonths(Object.entries(groupedEvents))
          .map(([monthKey, monthData]) => (
            <div key={monthKey} className={`${monthKey === getCurrentMonth() ? 'bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-lg' : ''}`}>
              <button
                onClick={() => toggleMonth(monthKey)}
                className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-4"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className={`w-5 h-5 transition-transform ${
                    expandedMonths.includes(monthKey) ? 'transform rotate-180' : ''
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                {formatMonthYear(monthKey)}
                {monthKey === getCurrentMonth() && (
                  <span className="text-sm font-normal text-blue-600 dark:text-blue-400 ml-2">
                    (Mês atual)
                  </span>
                )}
              </button>

              {expandedMonths.includes(monthKey) && (
                <div className="space-y-4">
                  {Object.entries(monthData.markerGroups).map(([markerName, markerEvents]: [string, Event[]]) => (
                    <div key={markerName} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        {markerName}
                      </h3>
                      <div className={viewMode === 'card' 
                        ? "grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        : "divide-y dark:divide-gray-700 border-y dark:border-gray-700"
                      }>
                        {markerEvents
                          .sort((a, b) => {
                            const dateA = new Date(a.date || '');
                            const dateB = new Date(b.date || '');
                            return dateA.getTime() - dateB.getTime();
                          })
                          .map(event => (
                            viewMode === 'card' 
                              ? <EventCard 
                                  key={event.id} 
                                  event={event}
                                  onComplete={toggleEventCompletion}
                                  onEdit={handleEditEvent}
                                  onDelete={handleDeleteEvent}
                                />
                              : <EventListItem 
                                  key={event.id} 
                                  event={event}
                                  onComplete={toggleEventCompletion}
                                  onEdit={handleEditEvent}
                                  onDelete={handleDeleteEvent}
                                />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {isModalOpen && (
      <AddEventModal
        isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        initialData={editingEvent || undefined}
      />
      )}
    </div>
  );
} 