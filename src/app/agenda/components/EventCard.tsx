'use client';

import { Event } from '@/store/eventStore';

interface EventCardProps {
  event: Event;
  onComplete: (id: string) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR');
};

const EventCard = ({ event, onComplete, onEdit, onDelete }: EventCardProps) => {
  const getMarkerStyles = () => {
    if (event.completed) {
      return 'bg-green-50/30 dark:bg-green-900/10 border-green-200/40 dark:border-green-800/30';
    }
    
    if (event.marker) {
      switch (event.marker.color) {
        case 'red':
          return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        case 'blue':
          return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
        case 'yellow':
          return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
        case 'purple':
          return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
        case 'green':
          return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        default:
          return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
      }
    }

    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  const getMarkerBadgeStyles = () => {
    if (!event.marker) return '';

    switch (event.marker.color) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className={`p-3 rounded-lg border transition-all ${getMarkerStyles()} relative ${event.completed ? 'overflow-hidden opacity-60' : ''}`}>
      {event.completed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t-2 border-green-500/50 dark:border-green-500/30 transform -rotate-5"></div>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-base font-semibold ${event.completed ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'} line-clamp-1`}>
            {event.title}
          </h3>
          {event.date && (
            <p className={`text-xs ${event.completed ? 'text-gray-500/70 dark:text-gray-500/70' : 'text-gray-600 dark:text-gray-300'} mt-0.5`}>
              {formatDate(event.date)}
              {event.time && ` às ${event.time}`}
            </p>
          )}
          {event.description && (
            <p className={`mt-1.5 text-sm ${event.completed ? 'text-gray-500/80 dark:text-gray-500/70' : 'text-gray-700 dark:text-gray-300'} line-clamp-2`}>
              {event.description}
            </p>
          )}
          {event.marker && (
            <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded-full text-xs ${event.completed ? 'opacity-60' : ''} ${getMarkerBadgeStyles()}`}>
              {event.marker.name}
            </span>
          )}
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onComplete(event.id)}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors hover:scale-110 ${
              event.completed
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={event.completed ? "Desmarcar como concluído" : "Marcar como concluído"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(event)}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hover:scale-110"
            title="Editar evento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors hover:scale-110"
            title="Excluir evento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export { EventCard };
export default EventCard; 