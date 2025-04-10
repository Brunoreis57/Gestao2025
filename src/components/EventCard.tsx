'use client';

import { Event } from '@/store/eventStore';

interface EventCardProps {
  event: Event;
  onComplete: (id: string) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

function EventCard({ event, onComplete, onEdit, onDelete }: EventCardProps) {
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
    <div className={`p-4 rounded-lg border transition-all ${getMarkerStyles()} relative ${event.completed ? 'overflow-hidden opacity-60' : ''}`}>
      {event.completed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t-2 border-green-500/50 dark:border-green-500/30 transform -rotate-5"></div>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${event.completed ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {event.title}
          </h3>
          {event.date && (
            <p className={`text-sm ${event.completed ? 'text-gray-500/70 dark:text-gray-500/70' : 'text-gray-600 dark:text-gray-300'}`}>
              {new Date(event.date).toLocaleDateString('pt-BR')}
              {event.time && ` às ${event.time}`}
            </p>
          )}
          {event.description && (
            <p className={`mt-2 ${event.completed ? 'text-gray-500/80 dark:text-gray-500/70' : 'text-gray-700 dark:text-gray-300'}`}>
              {event.description}
            </p>
          )}
          {event.marker && (
            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${event.completed ? 'opacity-60' : ''} ${getMarkerBadgeStyles()}`}>
              {event.marker.name}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onComplete(event.id)}
            className={`p-2 rounded-full transition-colors ${
              event.completed
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            ✓
          </button>
          <button
            onClick={() => onEdit(event)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard; 