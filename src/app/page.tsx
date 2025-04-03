'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { useEventStore } from '@/store/eventStore';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const { events, toggleEventCompletion } = useEventStore();

  // Função para obter o início da semana (domingo)
  function getStartOfWeek(date: Date) {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    return newDate;
  }

  // Função para navegar entre semanas
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  // Função para obter os eventos da semana atual
  const getCurrentWeekEvents = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= currentWeekStart && eventDate <= endOfWeek;
    });
  };

  // Função para obter os eventos de um dia específico
  const getEventsForDay = (date: Date) => {
    return getCurrentWeekEvents().filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Função para verificar eventos atrasados (mais de uma semana)
  const getOverdueEvents = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return events.filter(event => {
      if (!event.date || event.completed) return false;
      const eventDate = new Date(event.date);
      return eventDate < oneWeekAgo;
    });
  };

  // Gera array com os dias da semana atual
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Formata a data para exibição
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric' }).format(date);
  };

  // Formata o período da semana para exibição
  const formatWeekPeriod = () => {
    const endOfWeek = new Date(currentWeekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long'
    };

    const startStr = new Intl.DateTimeFormat('pt-BR', formatOptions).format(currentWeekStart);
    const endStr = new Intl.DateTimeFormat('pt-BR', formatOptions).format(endOfWeek);
    
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-12">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Seção de Cards */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Resumo de Eventos
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Eventos em Aberto na Semana"
            value={getCurrentWeekEvents().filter(e => !e.completed).length}
            type="blue"
          />
          <Card
            title="Eventos Concluídos na Semana"
            value={getCurrentWeekEvents().filter(e => e.completed).length}
            type="success"
          />
          <Card
            title="Eventos Atrasados"
            value={getOverdueEvents().length}
            type="danger"
          />
        </div>
      </section>

      {/* Agenda Semanal */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agenda Semanal
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatWeekPeriod()}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Semana anterior"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Próxima semana"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {weekDays.map((date) => {
            const dayEvents = getEventsForDay(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={date.toISOString()}
                className={`p-4 rounded-xl border ${
                  isToday
                    ? 'bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <h3 className={`font-medium mb-3 ${
                  isToday
                    ? 'text-primary dark:text-primary/90'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {formatDate(date)}
                </h3>
                <div className="space-y-2">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded-lg text-sm ${
                          event.completed
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : event.marker
                            ? `bg-${event.marker.color}-50 dark:bg-${event.marker.color}-900/20 text-${event.marker.color}-700 dark:text-${event.marker.color}-400`
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            {event.time && (
                              <p className="text-xs opacity-75">{event.time}</p>
                            )}
                          </div>
                          {!event.completed && (
                            <button
                              onClick={() => toggleEventCompletion(event.id)}
                              className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
                              title="Marcar como concluído"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        {event.marker && (
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-${event.marker.color}-100 dark:bg-${event.marker.color}-900/30 text-${event.marker.color}-800 dark:text-${event.marker.color}-300`}>
                            {event.marker.name}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhum evento
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
} 