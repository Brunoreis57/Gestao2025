'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { useEventStore } from '@/store/eventStore';
import { FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';

export default function Home() {
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  // Função para navegar entre meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
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

  // Função para obter os eventos do mês atual
  const getCurrentMonthEvents = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= firstDay && eventDate <= lastDay;
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

  // Função para obter os eventos de um dia específico (para o calendário mensal)
  const getEventsForMonthDay = (date: Date) => {
    return events.filter(event => {
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

  // Gera array com os dias do mês atual
  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Determinar o primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Determinar o último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Determinar o dia da semana do primeiro dia (0 = Domingo, 1 = Segunda...)
    const firstDayOfWeek = firstDay.getDay();
    
    // Array para armazenar todos os dias a serem exibidos no calendário
    const calendarDays = [];
    
    // Adicionar dias do mês anterior para completar a primeira semana
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = new Date(year, month - 1, prevMonthDays - firstDayOfWeek + i + 1);
      calendarDays.push({ date: day, isCurrentMonth: false });
    }
    
    // Adicionar dias do mês atual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      calendarDays.push({ date: day, isCurrentMonth: true });
    }
    
    // Adicionar dias do próximo mês para completar a última semana
    const daysToAdd = 7 - (calendarDays.length % 7);
    if (daysToAdd < 7) {
      for (let i = 1; i <= daysToAdd; i++) {
        const day = new Date(year, month + 1, i);
        calendarDays.push({ date: day, isCurrentMonth: false });
      }
    }
    
    return calendarDays;
  };

  // Formata a data para exibição
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric' }).format(date);
  };

  // Formata o dia para calendário mensal
  const formatMonthDay = (date: Date) => {
    return date.getDate().toString();
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

  // Formata o mês atual para exibição
  const formatMonth = () => {
    const formatOptions: Intl.DateTimeFormatOptions = { 
      month: 'long',
      year: 'numeric'
    };

    return new Intl.DateTimeFormat('pt-BR', formatOptions).format(currentMonth);
  };

  // Nome dos dias da semana para o cabeçalho do calendário
  const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
                <FaChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => navigateWeek('next')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Próxima semana"
              >
                <FaChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
                    ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-500/50 shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <h3 className={`font-medium mb-3 ${
                  isToday
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {formatDate(date)}
                </h3>
                <div className="space-y-2">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => {
                      // Determinar a cor de fundo com base no marcador ou status do evento
                      let bgColorClass = 'bg-gray-50 dark:bg-gray-700';
                      
                      if (event.completed) {
                        bgColorClass = 'bg-green-50 dark:bg-green-900/20';
                      } else if (event.marker) {
                        const color = event.marker.color;
                        if (color === 'red') bgColorClass = 'bg-red-50 dark:bg-red-900/20';
                        else if (color === 'blue') bgColorClass = 'bg-blue-50 dark:bg-blue-900/20';
                        else if (color === 'green') bgColorClass = 'bg-green-50 dark:bg-green-900/20';
                        else if (color === 'yellow') bgColorClass = 'bg-yellow-50 dark:bg-yellow-900/20';
                        else if (color === 'purple') bgColorClass = 'bg-purple-50 dark:bg-purple-900/20';
                        else if (color === 'pink') bgColorClass = 'bg-pink-50 dark:bg-pink-900/20';
                        else if (color === 'orange') bgColorClass = 'bg-orange-50 dark:bg-orange-900/20';
                      }
                      
                      return (
                        <div
                          key={event.id}
                          className={`p-2 rounded-lg text-sm ${bgColorClass} text-gray-700 dark:text-gray-200`}
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
                                <FaCheckCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          {event.marker && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-white/50 dark:bg-black/20 text-gray-700 dark:text-gray-200">
                              {event.marker.name}
                            </span>
                          )}
                        </div>
                      );
                    })
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

      {/* Agenda Mensal */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agenda Mensal
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatMonth()}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Mês anterior"
              >
                <FaChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Próximo mês"
              >
                <FaChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendário Mensal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 text-center py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            {weekdayNames.map((day, index) => (
              <div key={index} className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do calendário */}
          <div className="grid grid-cols-7">
            {getMonthDays().map(({ date, isCurrentMonth }, index) => {
              const dayEvents = getEventsForMonthDay(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index}
                  className={`min-h-[100px] p-2 border-b border-r border-gray-200 dark:border-gray-700 ${
                    !isCurrentMonth 
                      ? 'bg-gray-50 dark:bg-gray-900/30 opacity-40' 
                      : isToday 
                        ? 'bg-blue-50 dark:bg-blue-900/30 shadow-inner' 
                        : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {formatMonthDay(date)}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      // Determinar a cor com base no marcador ou status
                      let bgColorClass = 'bg-gray-100 dark:bg-gray-700';
                      
                      if (event.completed) {
                        bgColorClass = 'bg-green-100 dark:bg-green-900/30';
                      } else if (event.marker) {
                        const color = event.marker.color;
                        if (color === 'red') bgColorClass = 'bg-red-100 dark:bg-red-900/30';
                        else if (color === 'blue') bgColorClass = 'bg-blue-100 dark:bg-blue-900/30';
                        else if (color === 'green') bgColorClass = 'bg-green-100 dark:bg-green-900/30';
                        else if (color === 'yellow') bgColorClass = 'bg-yellow-100 dark:bg-yellow-900/30';
                        else if (color === 'purple') bgColorClass = 'bg-purple-100 dark:bg-purple-900/30';
                        else if (color === 'pink') bgColorClass = 'bg-pink-100 dark:bg-pink-900/30';
                        else if (color === 'orange') bgColorClass = 'bg-orange-100 dark:bg-orange-900/30';
                      }
                      
                      return (
                        <div 
                          key={event.id}
                          className={`px-2 py-1 text-xs truncate rounded ${bgColorClass} text-gray-700 dark:text-gray-200`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      );
                    })}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                        +{dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
} 